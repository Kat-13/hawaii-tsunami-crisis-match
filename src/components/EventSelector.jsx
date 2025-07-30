import { useState, useEffect } from 'react';

const EVENTS = [
  { id: 'event_2025_tx_floods', name: 'Texas Floods 2025' },
  { id: 'event_2025_tx_drill', name: 'Mock Drill 2025' },
  { id: 'event_2025_ca_wildfire', name: 'California Wildfire 2025' },
  { id: 'event_2025_fl_hurricane', name: 'Florida Hurricane 2025' },
];

export default function EventSelector({ onChange }) {
  const [selectedEvent, setSelectedEvent] = useState(
    localStorage.getItem('event_id') || EVENTS[0].id
  );

  useEffect(() => {
    localStorage.setItem('event_id', selectedEvent);
    if (onChange) {
      onChange(selectedEvent);
    }
  }, [selectedEvent, onChange]);

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
  };

  const getCurrentEventName = () => {
    const event = EVENTS.find(e => e.id === selectedEvent);
    return event ? event.name : 'Unknown Event';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Current Event</h3>
          <p className="text-lg font-semibold text-gray-900">{getCurrentEventName()}</p>
        </div>
        
        <div className="flex flex-col sm:items-end">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Switch Event
          </label>
          <select
            value={selectedEvent}
            onChange={handleEventChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {EVENTS.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        All reports and searches are scoped to the selected event. 
        Switch events to view reports from different disasters.
      </div>
    </div>
  );
}

