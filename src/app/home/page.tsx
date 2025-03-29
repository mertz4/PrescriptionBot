"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPills, 
  faCalendarAlt, 
  faFlask, 
  faPlus, 
  faPencilAlt 
} from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import Button from "@components/Button"; // Adjust path as needed
import WeeklySchedule from "@src/components/WeeklySchedule";
import TodaysMedications from "@src/components/MedicationCard";
import { useMedicationData } from '@components/FetchData'; // Using the provided fetch function

// Define TypeScript interfaces for UI components
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  refillDate: string;
  taken?: boolean;
}

interface CalendarEvent {
  date: string;
  medications: string[];
}

// Calculate when medication needs to be refilled
const calculateRefillDate = (startDate: string, pillAmount: number, daysOfWeek: string[], timesPerDay: number): string => {
  const start = new Date(startDate);
  
  // How many days per week the medication is taken
  const daysPerWeek = daysOfWeek.length;
  
  // Pills used per week
  const pillsPerWeek = daysPerWeek * timesPerDay;
  
  // Weeks the current supply will last
  const weeksSupply = pillAmount / pillsPerWeek;
  
  // Days the current supply will last
  const daysSupply = Math.floor(weeksSupply * 7);
  
  // Calculate refill date
  const refillDate = new Date(start);
  refillDate.setDate(start.getDate() + daysSupply);
  
  return refillDate.toISOString().split('T')[0];
};

// Generate time string based on timesOfDay or frequency
const generateTimeString = (timesOfDay: string[], frequency: number): string => {
  if (timesOfDay && timesOfDay.length > 0) {
    return timesOfDay.join(', ');
  }
  
  if (frequency === 1) {
    return "Once daily";
  } else if (frequency === 2) {
    return "Twice daily";
  } else if (frequency === 3) {
    return "Three times daily";
  }
  
  return `${frequency} times daily`;
};

// Generate frequency string based on days of week
const generateFrequencyString = (daysOfWeek: string[]): string => {
  if (daysOfWeek.length === 7) {
    return "Daily";
  }
  
  if (daysOfWeek.length <= 3) {
    return daysOfWeek.join(', ');
  }
  
  return `${daysOfWeek.length} days/week`;
};

// Generate calendar events for the next 14 days
const generateCalendarEvents = (medicationDict: any): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const today = new Date();
  
  // Generate events for the next 14 days
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
    
    const medsForDay: string[] = [];
    
    // Check each medication if it should be taken on this day
    Object.entries(medicationDict).forEach(([drugName, details]: [string, any]) => {
      if (details.daysOfWeek.includes(dayOfWeek)) {
        // Start date check
        const startDate = new Date(details.startDate);
        if (date >= startDate) {
          if (details.timesOfDay && details.timesOfDay.length > 0) {
            // Add each time of day as a separate entry
            details.timesOfDay.forEach((time: string) => {
              medsForDay.push(`${drugName} (${time})`);
            });
          } else {
            // Just add the medication name if no specific times
            medsForDay.push(drugName);
          }
        }
      }
    });
    
    events.push({
      date: dateString,
      medications: medsForDay
    });
  }
  
  return events;
};

// Map medication dictionary to the UI format
const mapMedicationsForUI = (medicationDict: any): Medication[] => {
  return Object.entries(medicationDict).map(([drugName, details]: [string, any], index) => {
    const refillDate = calculateRefillDate(
      details.startDate,
      details.pillAmount,
      details.daysOfWeek,
      details.frequency
    );
    
    return {
      id: index.toString(),
      name: drugName,
      dosage: details.servingSize,
      frequency: generateFrequencyString(details.daysOfWeek),
      time: generateTimeString(details.timesOfDay, details.frequency),
      refillDate: refillDate,
      taken: false
    };
  });
};

interface MedicationCardProps {
  medication: Medication;
  onToggle: (id: string) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication, onToggle }) => (
  <div className="max-w-100 p-4 bg-white border border-gray-300 rounded-lg shadow hover:shadow-md transition-all duration-200 ease-in-out">
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 text-indigo-500">
        <FontAwesomeIcon icon={faPills} size="lg" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="text-lg font-bold text-gray-900">{medication.name}</h3>
          <button 
            onClick={() => onToggle(medication.id)}
            className={`w-6 h-6 flex items-center justify-center rounded-full 
              ${medication.taken ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
          >
            <FontAwesomeIcon icon={faCircleCheck} size="sm" />
          </button>
        </div>
        <p className="text-sm font-medium text-gray-800">{medication.dosage}</p>
        <div className="flex items-center mt-1">
          <p className="text-xs text-gray-600">{medication.frequency}</p>
          <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500" />
          <p className="text-xs text-gray-600">{medication.time}</p>
        </div>
      </div>
    </div>
  </div>
);

interface CalendarDayProps {
  date: string;
  medications: string[];
}

const CalendarDay: React.FC<CalendarDayProps> = ({ date, medications }) => {
  const today = new Date().toISOString().split('T')[0];
  const isToday = date === today;
  
  return (
    <div className={`border p-3 rounded-lg mb-2 ${isToday 
      ? 'border-indigo-400 bg-indigo-50' 
      : 'border-gray-200 hover:border-indigo-200 transition-colors duration-200'}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-900">
          {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
        {isToday && <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">Today</span>}
      </div>
      <ul className="text-sm space-y-1">
        {medications.map((med, idx) => (
          <li key={idx} className="text-gray-700 flex items-center space-x-1">
            <FontAwesomeIcon icon={faPills} className="text-indigo-400" size="xs" />
            <span>{med}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const MedicationDashboard: React.FC = () => {
  // Use the medication data hook from the FetchData component
  const { medications: medicationDict, loading, error } = useMedicationData();
  
  const [medications, setMedications] = useState<Medication[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [showMedList, setShowMedList] = useState<boolean>(false);

  // Process medication data when it changes
  useEffect(() => {
    if (!loading && Object.keys(medicationDict).length > 0) {
      // Generate calendar events
      const events = generateCalendarEvents(medicationDict);
      setCalendarEvents(events);
      
      // Map medications to UI format
      const medsForUI = mapMedicationsForUI(medicationDict);
      setMedications(medsForUI);
    }
  }, [medicationDict, loading]);

  // Toggle medication taken status
  const toggleMedicationStatus = (id: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, taken: !med.taken } : med
    ));
  };

  // Filter today's medications
  const today = new Date().toISOString().split('T')[0];
  const todaysMeds = calendarEvents.find(event => event.date === today)?.medications || [];
  
  // Sort medications by refill date
  const upcomingRefills = [...medications].sort((a, b) => 
    new Date(a.refillDate).getTime() - new Date(b.refillDate).getTime());

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your medications...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (    
    <div className="container mx-auto p-4 max-w-6xl min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <FontAwesomeIcon icon={faPills} className="text-indigo-500 mr-2" />
        Medication Dashboard
      </h1>
      
      {/* Action buttons at top */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Button variant="long" onClick="/add-medication">
          <div className="flex items-center justify-center">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            <span>Add New Medication</span>
          </div>  
        </Button>
        <Button color="white" variant="long" onClick="/view-medications">
          <div className="flex items-center justify-center">
            <FontAwesomeIcon icon={faPencilAlt} className="mr-2" />
            <span>View & Edit Medications</span>
          </div>  
        </Button>
      </div>
      
      {/* Calendar section */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Replace the WeeklySchedule component with our custom calendar */}
        <div className="max-w-full p-6 bg-white border border-gray-300 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-500 mr-2" />
            Medication Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {calendarEvents.slice(0, 5).map((event) => (
              <CalendarDay 
                key={event.date} 
                date={event.date} 
                medications={event.medications} 
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Today's Medications and Upcoming Refills side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {/* Today's Medications */}
        <div className="max-w-full p-6 bg-white border border-gray-300 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faPills} className="text-indigo-500 mr-2" />
            Today's Medications
          </h2>
          
          {todaysMeds.length > 0 ? (
            <div className="space-y-4">
              {medications.filter(med => 
                todaysMeds.some(todayMed => todayMed.includes(med.name))
              ).map((med) => (
                <MedicationCard 
                  key={med.id} 
                  medication={med} 
                  onToggle={toggleMedicationStatus} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
              <div className="bg-green-500 text-white rounded-full h-16 w-16 flex items-center justify-center mb-4 shadow-md">
                <FontAwesomeIcon icon={faCircleCheck} size="2x" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">All Caught Up!</h3>
              <p className="text-center text-gray-500">No medications scheduled for today.</p>
            </div>
          )}
        </div>
        
        {/* Upcoming Refills */}
        <div className="max-w-full p-6 bg-white border border-gray-300 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faFlask} className="text-indigo-500 mr-2" />
            Upcoming Refills
          </h2>
          
          <div>
            {upcomingRefills.length > 0 ? (
              <div className="space-y-3">
                {upcomingRefills.map((med) => {
                  // Calculate days until refill
                  const daysUntilRefill = Math.ceil(
                    (new Date(med.refillDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                
                  return (
                    <div 
                      key={med.id} 
                      className={`flex justify-between items-center p-4 rounded-lg border-2 transition-colors ${
                        daysUntilRefill <= 3
                          ? 'border-red-400 bg-red-50'
                          : daysUntilRefill <= 7
                            ? 'border-yellow-400 bg-yellow-50'
                            : 'border-green-400 bg-green-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="ml-3">
                          <h3 className="font-semibold text-gray-900 text-lg">{med.name}</h3>
                          <div className="flex items-center text-sm">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-500 mr-1" />
                            <span className="text-gray-700 font-medium">
                              Refill by: {new Date(med.refillDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                        daysUntilRefill <= 3
                          ? 'bg-red-500 text-white'
                          : daysUntilRefill <= 7
                            ? 'bg-yellow-500 text-white'
                            : 'bg-green-500 text-white'
                      }`}>
                        {daysUntilRefill <= 0 
                          ? 'OVERDUE!' 
                          : `${daysUntilRefill} DAYS`}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                <div className="bg-green-500 text-white rounded-full h-16 w-16 flex items-center justify-center mb-4 shadow-md">
                  <FontAwesomeIcon icon={faCircleCheck} size="2x" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">All Set!</h3>
                <p className="text-center text-gray-500">No refills needed at this time.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Optional: Toggle medication list view */}
      {showMedList && (
        <div className="max-w-100 p-6 bg-white border border-gray-300 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faPills} className="text-indigo-500 mr-2" />
              All Medications
            </h2>
            <button 
              onClick={() => setShowMedList(false)}
              className="text-sm text-gray-600 hover:text-indigo-600 underline"
            >
              Hide
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {medications.map((med) => (
              <MedicationCard 
                key={med.id} 
                medication={med} 
                onToggle={toggleMedicationStatus} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationDashboard;