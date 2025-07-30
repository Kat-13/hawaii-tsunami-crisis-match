import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function ExportPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState({ total: 0, missing: 0, safe: 0 });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const event_id = localStorage.getItem('event_id') || 'event_2025_tx_floods';
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('event_id', event_id)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error loading reports:', error);
      } else {
        setReports(data || []);
        
        // Calculate statistics
        const total = data?.length || 0;
        const missing = data?.filter(r => r.status === 'missing').length || 0;
        const safe = data?.filter(r => r.status === 'safe').length || 0;
        setStats({ total, missing, safe });
      }
    } catch (error) {
      console.error('Unexpected error loading reports:', error);
    }
    setLoading(false);
  };

  const downloadJSON = async () => {
    setExporting(true);
    try {
      const event_id = localStorage.getItem('event_id') || 'event_2025_tx_floods';
      
      // Prepare data for export (remove sensitive hashes)
      const exportData = reports.map(report => ({
        id: report.id,
        event_id: report.event_id,
        first_name: report.first_name,
        last_name: report.last_name,
        last_known_location: report.last_known_location,
        status: report.status,
        reported_by: report.reported_by,
        timestamp: report.timestamp
      }));

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${event_id}_reports_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting JSON:', error);
      alert('Failed to export JSON file');
    }
    setExporting(false);
  };

  const downloadCSV = async () => {
    setExporting(true);
    try {
      const event_id = localStorage.getItem('event_id') || 'event_2025_tx_floods';
      
      // Prepare data for CSV export
      const csvData = reports.map(report => ({
        'First Name': report.first_name,
        'Last Name': report.last_name,
        'Status': report.status,
        'Last Known Location': report.last_known_location,
        'Reported By': report.reported_by,
        'Timestamp': new Date(report.timestamp).toLocaleString()
      }));

      // Generate CSV manually
      const headers = ['First Name', 'Last Name', 'Status', 'Last Known Location', 'Reported By', 'Timestamp'];
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${event_id}_reports_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV file');
    }
    setExporting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Export Reports
      </h2>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-800">Total Reports</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.missing}</div>
          <div className="text-sm text-red-800">Still Missing</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.safe}</div>
          <div className="text-sm text-green-800">Marked Safe</div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Download Reports
        </h3>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={downloadJSON}
              disabled={exporting || reports.length === 0}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? 'Exporting...' : 'Download JSON'}
            </button>
            
            <button
              onClick={downloadCSV}
              disabled={exporting || reports.length === 0}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? 'Exporting...' : 'Download CSV'}
            </button>
          </div>

          <button
            onClick={loadReports}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Refresh Data
          </button>
        </div>

        {reports.length === 0 && (
          <div className="mt-4 text-center text-gray-500">
            No reports available for export.
          </div>
        )}
      </div>

      {/* Data Privacy Notice */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">
          Data Privacy Notice
        </h4>
        <p className="text-xs text-yellow-700">
          Exported data excludes sensitive hashed information (DOB and SSN hashes) for privacy protection. 
          Only basic identifying information and status updates are included in exports.
        </p>
      </div>

      {/* Recent Reports Preview */}
      {reports.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Recent Reports Preview
          </h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.slice(0, 5).map((report) => (
                    <tr key={report.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.first_name?.[0]}*** {report.last_name?.[0]}***
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          report.status === 'safe' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {report.last_known_location}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {reports.length > 5 && (
              <div className="px-4 py-3 bg-gray-50 text-sm text-gray-500 text-center">
                Showing 5 of {reports.length} reports. Download full data using the buttons above.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

