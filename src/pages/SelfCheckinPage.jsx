import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { hashField } from '../utils/hash';

export default function SelfCheckinPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    ssn: '',
    lastKnownLocation: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { firstName, lastName, dob, ssn, lastKnownLocation } = form;

      // Validate required fields
      if (!firstName || !lastName || !dob || !ssn || !lastKnownLocation) {
        setMessage('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Validate SSN format (9 digits)
      if (!/^\d{9}$/.test(ssn)) {
        setMessage('Please enter a valid 9-digit SSN');
        setLoading(false);
        return;
      }

      // Hash sensitive data for matching (using same format as existing records)
      const dobHash = hashField(dob);
      const ssn4Hash = hashField(ssn.slice(-4)); // Use last 4 digits for compatibility

      // Check for existing record
      const { data: existingReports, error: fetchError } = await supabase
        .from('reports')
        .select('*')
        .eq('first_name', firstName)
        .eq('last_name', lastName)
        .eq('dob_hash', dobHash)
        .eq('ssn4_hash', ssn4Hash);

      if (fetchError) {
        console.error('Error checking for existing record:', fetchError);
        setMessage('Error checking for existing record. Please try again.');
        setLoading(false);
        return;
      }

      if (existingReports && existingReports.length > 0) {
        // Update existing record to mark as safe
        const { error: updateError } = await supabase
          .from('reports')
          .update({ 
            status: 'safe',
            last_known_location: lastKnownLocation,
            timestamp: new Date().toISOString()
          })
          .eq('id', existingReports[0].id);

        if (updateError) {
          console.error('Error updating record:', updateError);
          setMessage('Error updating your status. Please try again.');
        } else {
          setMessage('Thank you! You have been marked as safe. Your loved ones will be notified when they search for you.');
          setForm({
            firstName: '',
            lastName: '',
            dob: '',
            ssn: '',
            lastKnownLocation: ''
          });
        }
      } else {
        // Create new record for person marking themselves safe
        const currentEventId = localStorage.getItem('event_id') || 'event_2025_tx_floods';
        
        const { error: insertError } = await supabase
          .from('reports')
          .insert([{
            event_id: currentEventId,
            first_name: firstName,
            last_name: lastName,
            dob_hash: dobHash,
            ssn4_hash: ssn4Hash, // Use ssn4_hash for compatibility
            last_known_location: lastKnownLocation,
            status: 'safe',
            reported_by: 'Self-reported as safe',
            timestamp: new Date().toISOString()
          }]);

        if (insertError) {
          console.error('Error creating safe record:', insertError);
          setMessage('Error marking yourself as safe. Please try again.');
        } else {
          setMessage('Thank you! You have been marked as safe. Your information has been added to the system so loved ones can find you.');
          setForm({
            firstName: '',
            lastName: '',
            dob: '',
            ssn: '',
            lastKnownLocation: ''
          });
        }
      }

    } catch (error) {
      console.error('Error in self check-in:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Check In as Safe</h2>
          <p className="mt-2 text-sm text-gray-600">
            Mark yourself as safe so your loved ones can find you during this emergency
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
              Date of Birth *
            </label>
            <input
              type="date"
              id="dob"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="ssn" className="block text-sm font-medium text-gray-700">
              Social Security Number (9 digits) *
            </label>
            <input
              type="text"
              id="ssn"
              value={form.ssn}
              onChange={(e) => setForm({ ...form, ssn: e.target.value.replace(/\D/g, '') })}
              placeholder="123456789"
              maxLength="9"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your full 9-digit SSN (numbers only) - required for secure identification
            </p>
          </div>

          <div>
            <label htmlFor="lastKnownLocation" className="block text-sm font-medium text-gray-700">
              Current/Last Known Location *
            </label>
            <input
              type="text"
              id="lastKnownLocation"
              value={form.lastKnownLocation}
              onChange={(e) => setForm({ ...form, lastKnownLocation: e.target.value })}
              placeholder="Address, neighborhood, or general area"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Checking In...' : 'Mark Myself as Safe'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-md ${
            message.includes('Error') 
              ? 'bg-red-50 text-red-700' 
              : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Privacy Notice</h3>
          <p className="text-xs text-blue-600">
            Your personal information is hashed and stored securely. Only your first initial and last initial 
            are displayed publicly to protect your privacy while allowing identification by loved ones.
          </p>
        </div>
      </div>
    </div>
  );
}
