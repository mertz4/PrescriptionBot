import { faFlask, faPills } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time?: string;
  instructions?: string;
  taken?: boolean;
}

interface MedicationCardProps {
  medication: Medication;
  onToggle: (id: string) => void;
}

// Individual medication card component
const MedicationCard: React.FC<MedicationCardProps> = ({ medication, onToggle }) => {
  const [taken, setTaken] = useState<boolean>(medication.taken || false);
  
  const handleClick = () => {
    setTaken(!taken);
    onToggle(medication.id);
  };
  
  return (
    <div 
      className={`p-4 rounded-lg border transition-colors duration-300 cursor-pointer ${
        taken 
          ? 'bg-green-100 border-green-300 hover:bg-green-50' 
          : 'bg-white border-gray-200 hover:border-indigo-200'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{medication.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{medication.dosage} - {medication.frequency}</p>
          
          {medication.time && (
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {medication.time}
            </div>
          )}
          
          {medication.instructions && (
            <p className="text-sm text-gray-500 mt-2 italic">{medication.instructions}</p>
          )}
        </div>
        
        <div className={`h-6 w-6 flex items-center justify-center rounded-full transition-colors ${
          taken ? 'bg-green-500 text-white' : 'bg-gray-100'
        }`}>
          {taken && (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

// Main component
const TodaysMedications: React.FC = () => {
  // Sample data
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      time: 'Morning',
      instructions: 'Take with food',
      taken: false
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      time: 'Morning and evening',
      instructions: 'Take with meals',
      taken: false
    },
    {
      id: '3',
      name: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily',
      time: 'Evening',
      instructions: 'Take at bedtime',
      taken: false
    }
  ]);
  
  // Sample today's medications
  const todaysMeds = ['Lisinopril', 'Atorvastatin'];
  
  // Toggle medication status
  const toggleMedicationStatus = (id: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, taken: !med.taken } : med
    ));
  };
  
  return (
    <div className="max-w-200 p-6 bg-white border border-gray-300 rounded-lg shadow-md">
       <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faPills} className="text-indigo-500 mr-2" />
            Today's Medications
        </h2>
      
      {todaysMeds.length > 0 ? (
        <div className="space-y-3">
          {medications
            .filter(med => todaysMeds.includes(med.name))
            .map(med => (
              <MedicationCard 
                key={med.id} 
                medication={med} 
                onToggle={toggleMedicationStatus} 
              />
            ))
          }
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-gray-500">
          <svg 
            className="h-10 w-10 mb-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-center">No medications scheduled for today.</p>
        </div>
      )}
    </div>
  );
};

export default TodaysMedications;