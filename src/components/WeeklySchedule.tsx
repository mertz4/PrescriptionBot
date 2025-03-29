import React, { useState, useEffect } from 'react';

interface Medication {
  name: string;
  time?: string;
  dosage?: string;
}

interface CalendarEvent {
  date: string;
  medications: string[];
}

const WeeklySchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [mockCalendarEvents, setMockCalendarEvents] = useState<CalendarEvent[]>([]);
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  
  // Generate mock data for the calendar
  useEffect(() => {
    const today = new Date('2025-03-29'); // Hardcoded for demo
    const nextSevenDays = getNextSevenDays(today);
    
    // Generate mock events for each day
    const events: CalendarEvent[] = nextSevenDays.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const medCount = Math.floor(Math.random() * 5); // 0-4 medications
      const meds: string[] = [];
      
      for (let i = 0; i < medCount; i++) {
        const medNames: string[] = [
          "Lisinopril", "Metformin", "Atorvastatin", "Levothyroxine", 
          "Amlodipine", "Metoprolol", "Omeprazole", "Losartan", 
          "Albuterol", "Gabapentin"
        ];
        meds.push(medNames[Math.floor(Math.random() * medNames.length)]);
      }
      
      return {
        date: dateStr,
        medications: meds
      };
    });
    
    setMockCalendarEvents(events);
    setWeekDates(nextSevenDays);
    setSelectedDate(today.toISOString().split('T')[0]); // Set today as selected
  }, []);
  
  // Get the next seven days starting from today
  const getNextSevenDays = (startDate: Date): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + i);
      dates.push(newDate);
    }
    return dates;
  };
  
  // Get the selected day's events
  const getSelectedDayEvents = (): CalendarEvent => {
    return mockCalendarEvents.find(event => event.date === selectedDate) || { date: selectedDate, medications: [] };
  };
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-full p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-7 w-7 text-indigo-500 mr-3" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
        Next 7 Days
      </h2>
      
      {/* Calendar grid - larger version */}
      <div className="grid grid-cols-7 gap-4 mb-6">
        {mockCalendarEvents.map((event, idx) => {
          const date = new Date(event.date);
          const isSelected = selectedDate === event.date;
          const isToday = date.toISOString().split('T')[0] === new Date('2025-03-29').toISOString().split('T')[0];
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          
          return (
            <div 
              key={idx}
              className={`p-3 border-2 rounded-lg cursor-pointer text-gray-900 ${
                isSelected 
                  ? 'border-indigo-500 bg-indigo-100' 
                  : isToday 
                    ? 'border-indigo-400 bg-indigo-50' 
                    : 'border-gray-200'
              } flex flex-col hover:border-indigo-300 transition-colors duration-200 min-h-32`}
              onClick={() => setSelectedDate(event.date)}
            >
              <div className={`text-base text-center font-medium mb-2 ${
                isSelected ? 'bg-indigo-200' : 'bg-gray-50'
              } rounded-md py-2`}>
                {dayName}<br/>
                <span className="text-lg font-semibold">{date.getDate()}</span>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                {event.medications.length > 0 ? (
                  <div className="text-center w-full">
                    <div 
                      className="bg-indigo-100 text-indigo-800 py-3 px-2 rounded-lg text-lg font-medium"
                    >
                      {event.medications.length}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 text-base">None</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Selected Day Details - larger version */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {formatDate(selectedDate)}
        </h3>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Medications for this day:</h4>
          
          {getSelectedDayEvents().medications.length > 0 ? (
            <ul className="space-y-3">
              {getSelectedDayEvents().medications.map((med, index) => (
                <li 
                  key={index} 
                  className="flex items-center bg-white p-4 rounded-lg border-2 border-gray-200 text-gray-900"
                >
                  <div className="h-5 w-5 bg-indigo-400 rounded-full mr-3"></div>
                  <span className="text-lg">{med}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-gray-500 italic p-4">No medications scheduled for this day.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;