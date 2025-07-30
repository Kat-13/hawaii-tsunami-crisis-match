import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { hashField } from '../utils/hash';
import { checkForDuplicates } from '../utils/fuzzy';

// CORRECTED AGE CALCULATION FUNCTION
function calculateAge(dobString) {
  console.log('calculateAge called with:', dobString);
  
  if (!dobString) {
    console.log('No DOB provided');
    return null;
  }

  let dob;
  
  // Handle YYYY-MM-DD format (HTML date input)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dobString)) {
    const parts = dobString.split('-');
    dob = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    console.log('Parsed as YYYY-MM-DD:', dob);
  }
  // Handle MM/DD/YYYY format
  else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dobString)) {
    const parts = dobString.split('/');
    dob = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
    console.log('Parsed as MM/DD/YYYY:', dob);
  }
  // Fallback with timezone
  else {
    dob = new Date(dobString + 'T12:00:00');
    console.log('Parsed with timezone:', dob);
  }

  // Validate the parsed date
  if (isNaN(dob.getTime())) {
    console.log('Invalid date parsed');
    return null;
  }

  // Calculate age
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  // Adjust if birthday hasn't occurred this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  console.log('Calculated age:', age);

  // Validate reasonable age range
  if (age < 0 || age > 150) {
    console.log('Unreasonable age calculated:', age, 'from DOB:', dob.toISOString().split('T')[0]);
    return null;
  }

  return age;
}

// GENERATE RECORD ID FUNCTION
function generateRecordId(firstName, lastName) {
  const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${initials}-${timestamp}`;
}

export default function ReportPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    ssn4: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { firstName, lastName, dob, ssn4, location } = form;

      // Validate required fields
      if (!firstName || !lastName || !dob || !location) {
        setMessage('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Calculate age from DOB
      const age = calculateAge(dob);
      console.log('Age calculated for submission:', age);

      // Hash sensitive data for duplicate checking
      const dob_hash = hashField(dob);
      const ssn4_hash = hashField(ssn4 || '');
      const event_id = localStorage.getItem('event_id') || 'event_2025_tx_floods';

      // Generate Record ID
      const recordId = generateRecordId(firstName, lastName);
      console.log('Generated Record ID:', recordId);

      // Get all existing reports for deduplication check
      const { data: existingReports, error: fetchError } = await supabase
        .from('reports')
        .select('*')
        .eq('event_id', event_id);

      if (fetchError) {
        console.error('Error fetching reports:', fetchError);
        setMessage('Error checking for existing records. Please try again.');
        setLoading(false);
        return;
      }

      // Prepare new report data for duplicate checking with case normalization
      const newReport = {
        first_name: firstName.toLowerCase().trim(),
        last_name: lastName.toLowerCase().trim(),
        dob_hash,
        ssn4_hash,
        last_known_location: location
      };

      // Normalize existing reports for case-insensitive comparison
      const normalizedExistingReports = (existingReports || []).map(report => ({
        ...report,
        first_name: (report.first_name || '').toLowerCase().trim(),
        last_name: (report.last_name || '').toLowerCase().trim()
      }));

      // Check for duplicates using the existing function
      const duplicateResult = checkForDuplicates(newReport, normalizedExistingReports);

      if (duplicateResult) {
        // Find the original (non-normalized) existing record for status checking
        const originalExistingRecord = existingReports.find(report => {
          const normalizedExisting = {
            first_name: (report.first_name || '').toLowerCase().trim(),
            last_name: (report.last_name || '').toLowerCase().trim(),
            dob_hash: report.dob_hash,
            ssn4_hash: report.ssn4_hash
          };
          
          return normalizedExisting.first_name === newReport.first_name &&
                 normalizedExisting.last_name === newReport.last_name &&
                 normalizedExisting.dob_hash === newReport.dob_hash &&
                 normalizedExisting.ssn4_hash === newReport.ssn4_hash;
        });

        // Determine tier based on the duplicate result structure
        let tier = 1; // Default to exact match
        let confidence = 100;
        
        if (duplicateResult.confidence !== undefined) {
          confidence = Math.round(duplicateResult.confidence * 100);
          if (confidence === 100) {
            tier = 1; // Exact match
          } else if (confidence >= 95) {
            tier = 2; // High confidence
          } else if (confidence >= 80) {
            tier = 3; // Possible match
          }
        } else if (duplicateResult.tier !== undefined) {
          tier = duplicateResult.tier;
          confidence = duplicateResult.confidence || 100;
        }

        // Handle different tiers
        if (tier === 1) {
          // Tier 1: Exact Match (100%)
          if (originalExistingRecord && originalExistingRecord.status === 'safe') {
            const checkInDate = new Date(originalExistingRecord.timestamp).toLocaleDateString();
            const checkInTime = new Date(originalExistingRecord.timestamp).toLocaleTimeString();
            const existingRecordId = originalExistingRecord.record_id || 'N/A';
            
            setMessage({
              type: 'safe',
              text: `Exact match found (Record ID: ${existingRecordId})—this person has marked themselves safe on ${checkInDate} at ${checkInTime}. No missing person report is needed.`,
              timestamp: originalExistingRecord.timestamp,
              recordId: existingRecordId
            });
          } else {
            const existingRecordId = originalExistingRecord?.record_id || 'N/A';
            setMessage({
              type: 'duplicate',
              text: `A record for this individual has already been created (Record ID: ${existingRecordId}). Check back for updated status if they have marked themselves safe.`,
              recordId: existingRecordId
            });
          }
          setLoading(false);
          return;
        }
        
        else if (tier === 2) {
          // Tier 2: High Confidence Match (≥95%)
          if (originalExistingRecord && originalExistingRecord.status === 'safe') {
            const checkInDate = new Date(originalExistingRecord.timestamp).toLocaleDateString();
            const checkInTime = new Date(originalExistingRecord.timestamp).toLocaleTimeString();
            const existingRecordId = originalExistingRecord.record_id || 'N/A';
            
            setMessage({
              type: 'safe-uncertain',
              text: `High-confidence match (≈${confidence}% similar, Record ID: ${existingRecordId}). They may have marked themselves safe on ${checkInDate} at ${checkInTime}. Please verify this is the same person.`,
              timestamp: originalExistingRecord.timestamp,
              similarity: confidence,
              recordId: existingRecordId
            });
          } else {
            const existingRecordId = originalExistingRecord?.record_id || 'N/A';
            setMessage({
              type: 'warning',
              text: `High-confidence match (≈${confidence}% similar, Record ID: ${existingRecordId}) found. Please verify this isn't the same person. If you're certain this is a different person, please double-check the spelling and details.`,
              similarity: confidence,
              recordId: existingRecordId
            });
          }
          setLoading(false);
          return;
        }
        
        else if (tier === 3) {
          // Tier 3: Possible Match (80-95%) - Show warning but allow submission
          setMessage({
            type: 'info',
            text: `Possible duplicate detected (≈${confidence}% similar). Please verify spelling and details are correct before submitting.`,
            similarity: confidence,
            allowSubmit: true
          });
          // Continue to submission logic below
        }
      }

      // If no high-confidence duplicates found, or Tier 3 with user proceeding, create the report
      const reportData = {
        event_id,
        first_name: firstName, // Store original case
        last_name: lastName,   // Store original case
        dob_hash,
        ssn4_hash,
        age, // Store calculated age
        last_known_location: location,
        status: 'missing',
        reported_by: 'anon',
        record_id: recordId, // Store generated Record ID
        timestamp: new Date().toISOString()
      };

      console.log('Submitting report data:', reportData);

      const { error: insertError } = await supabase
        .from('reports')
        .insert([reportData]);

      if (insertError) {
        console.error('Error creating report:', insertError);
        setMessage('Error creating report. Please try again.');
      } else {
        setMessage({
          type: 'success',
          text: `Missing person report has been submitted successfully. Record ID: ${recordId}${age ? ` (Age: ${age})` : ''}. The information will be available for search immediately.`,
          recordId: recordId,
          age: age
        });
        // Reset form
        setForm({
          firstName: '',
          lastName: '',
          dob: '',
          ssn4: '',
          location: ''
        });
      }

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMessageStyle = (messageType) => {
    switch (messageType) {
      case 'safe':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'safe-uncertain':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'info':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'success':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'duplicate':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:
        return 'bg-red-50 text-red-700 border border-red-200';
    }
  };

  const getMessageIcon = (messageType) => {
    switch (messageType) {
      case 'safe':
        return (
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'safe-uncertain':
      case 'warning':
        return (
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Report Missing Person</h1>
          <p className="mt-2 text-sm text-gray-600">
            Help us locate someone who may be missing during this emergency
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth *
            </label>
            <input
              type="date"
              id="dob"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="ssn4" className="block text-sm font-medium text-gray-700 mb-1">
              Last 4 digits of SSN (Optional)
            </label>
            <input
              type="text"
              id="ssn4"
              value={form.ssn4}
              onChange={(e) => setForm({ ...form, ssn4: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              placeholder="1234"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              maxLength="4"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Last Known Location *
            </label>
            <input
              type="text"
              id="location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Address, neighborhood, or general area"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Report Missing'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-md ${getMessageStyle(typeof message === 'object' ? message.type : 'error')}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {getMessageIcon(typeof message === 'object' ? message.type : 'error')}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {typeof message === 'object' ? message.text : message}
                </p>
                {typeof message === 'object' && message.recordId && (
                  <p className="text-xs mt-1 opacity-75">
                    Record ID: {message.recordId}
                  </p>
                )}
                {typeof message === 'object' && message.timestamp && (
                  <p className="text-xs mt-1 opacity-75">
                    Timestamp: {new Date(message.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Privacy Notice</h3>
          <p className="text-xs text-blue-600">
            Personal information is hashed and stored securely. Only initials are displayed publicly 
            to protect privacy while allowing identification by loved ones.
          </p>
        </div>
      </div>
    </div>
  );
}
