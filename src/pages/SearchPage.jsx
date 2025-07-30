import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { fuzzySearch } from '../utils/fuzzy';

function formatAge(age) {
  if (!age || age === null || age === undefined) {
    return '';
  }
  
  const numAge = parseInt(age);
  if (isNaN(numAge) || numAge < 0 || numAge > 150) {
    return '';
  }
  
  return ` (${numAge})`;
}

function extractRegion(location) {
  if (!location) return 'Unknown region';
  
  const countyMatch = location.match(/([A-Za-z\s]+)\s+County/i);
  if (countyMatch) return `${countyMatch[1]} County`;
  
  const cityMatch = location.match(/([A-Za-z\s]+),?\s*(TX|Texas)/i);
  if (cityMatch) return `${cityMatch[1]} area`;
  
  const zipMatch = location.match(/(\d{2})\d{3}/);
  if (zipMatch) return `ZIP ${zipMatch[1]}xxx area`;
  
  const parts = location.split(',');
  return parts[0].trim() || 'Unknown region';
}

function DetailModal({ report, onClose }) {
  const publicId = report.record_id || `${report.first_name?.[0] || 'X'}${report.last_name?.[0] || 'X'}-${new Date(report.timestamp).getTime().toString().slice(-4)}`.toUpperCase();
  const region = extractRegion(report.last_known_location);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h3 className="text-lg font-semibold mb-4">
          {report.first_name?.[0]?.toUpperCase()}*** {report.last_name?.[0]?.toUpperCase()}***{formatAge(report.age)}
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Reference ID:</span>
            <span className="text-gray-900">{publicId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Region:</span>
            <span className="text-gray-900">{region}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Status:</span>
            <span className={`px-2 py-1 rounded text-sm font-medium ${
              report.status === 'safe' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {report.status === 'safe' ? 'SAFE' : 'MISSING'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Last Known Location:</span>
            <span className="text-gray-900">{report.last_known_location}</span>
          </div>
          
          {report.age && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Age:</span>
              <span className="text-gray-900">{report.age} years old</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Report Date:</span>
            <span className="text-gray-900">
              {new Date(report.timestamp).toLocaleDateString()} at {new Date(report.timestamp).toLocaleTimeString()}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Reported By:</span>
            <span className="text-gray-900">
              {report.status === 'safe' ? 'Self-reported as safe' : 'Family/Friend'}
            </span>
          </div>
        </div>
        
        {report.status === 'safe' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">Marked Safe</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              This person checked in as safe on {new Date(report.timestamp).toLocaleDateString()} at {new Date(report.timestamp).toLocaleTimeString()}
            </p>
            <p className="text-green-600 text-xs mt-1">
              Self-reported - they marked themselves safe
            </p>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function ReportCard({ report, onClick }) {
  const publicId = report.record_id || `${report.first_name?.[0] || 'X'}${report.last_name?.[0] || 'X'}-${new Date(report.timestamp).getTime().toString().slice(-4)}`.toUpperCase();
  const region = extractRegion(report.last_known_location);
  
  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-900">
          {report.first_name?.[0]?.toUpperCase()}*** {report.last_name?.[0]?.toUpperCase()}***{formatAge(report.age)}
        </h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          report.status === 'safe' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {report.status === 'safe' ? 'SAFE' : 'MISSING'}
        </span>
      </div>
      
      <div className="space-y-1 text-sm text-gray-600">
        <p><span className="font-medium">ID:</span> {publicId}</p>
        <p><span className="font-medium">Region:</span> {region}</p>
        <p><span className="font-medium">Reported:</span> {new Date(report.timestamp).toLocaleDateString()} at {new Date(report.timestamp).toLocaleTimeString()}</p>
      </div>
      
      {report.status === 'safe' && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm">
          <p className="text-green-800 font-medium">✓ Your loved one has marked themselves safe!</p>
          <p className="text-green-600 text-xs">Self-reported - they marked themselves safe</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nameQuery, setNameQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [recordIdQuery, setRecordIdQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterAndSortReports();
  }, [reports, nameQuery, locationQuery, recordIdQuery, statusFilter, sortBy]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const event_id = localStorage.getItem('event_id') || 'event_2025_tx_floods';
      
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('event_id', event_id)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
      } else {
        console.log('Fetched reports with age data:', data);
        setReports(data || []);
      }
    } catch (error) {
      console.error('Error in fetchReports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortReports = () => {
    let filtered = [...reports];

    if (recordIdQuery.trim()) {
      const recordIdLower = recordIdQuery.toLowerCase().trim();
      filtered = filtered.filter(report => {
        const reportId = (report.record_id || '').toLowerCase();
        return reportId.includes(recordIdLower);
      });
    } else {
      if (nameQuery.trim()) {
        filtered = fuzzySearch(filtered, nameQuery.trim(), ['first_name', 'last_name']);
      }

      if (locationQuery.trim()) {
        filtered = fuzzySearch(filtered, locationQuery.trim(), ['last_known_location']);
      }
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => {
        if (statusFilter === 'missing') return report.status !== 'safe';
        if (statusFilter === 'safe') return report.status === 'safe';
        return true;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'location':
          return (a.last_known_location || '').localeCompare(b.last_known_location || '');
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        default:
          return 0;
      }
    });

    setFilteredReports(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Search Missing Persons</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by Name
              </label>
              <input
                type="text"
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                placeholder="Enter first or last name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by Location
              </label>
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Enter city, county, or area..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by Record ID
              </label>
              <input
                type="text"
                value={recordIdQuery}
                onChange={(e) => setRecordIdQuery(e.target.value)}
                placeholder="Enter record ID (e.g., JS-1234)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Reports</option>
                <option value="missing">Missing Only</option>
                <option value="safe">Safe Only</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="timestamp">Most Recent</option>
                <option value="location">Location</option>
                <option value="status">Status</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={fetchReports}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Refresh Reports
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredReports.length} report(s) total
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No reports available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={() => setSelectedReport(report)}
              />
            ))}
          </div>
        )}

        {selectedReport && (
          <DetailModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </div>
    </div>
  );
}
