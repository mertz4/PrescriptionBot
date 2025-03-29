"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPills, 
  faCalendarAlt, 
  faArrowLeft,
  faClock,
  faClipboardList,
  faPencilAlt,
  faTrash,
  faChevronDown,
  faChevronUp
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

// Updated interface to match the new field names
interface Medication {
  id: string;
  medication_name: string;
  date_purch: string;
  pills_count: string;
  dow: string[];
  frequency: string;
  dosage: string;
  tod: string[] | null;
  description_med: string | null;
}

const EditMedicationsPage: React.FC = () => {
  const router = useRouter();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [expandedMedicationId, setExpandedMedicationId] = useState<string | null>(null);
  const [editingMedicationId, setEditingMedicationId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Medication | null>(null);
  
  // Available days and time slots
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = ["Morning", "Noon", "Afternoon", "Evening", "Bedtime"];
  
  // Fetch medication data from API
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch('@components/test-data.json', {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform API data to component format with IDs
        const formattedMedications: Medication[] = data.map((med: any, index: number) => ({
          id: String(index + 1),
          medication_name: med.medication_name,
          date_purch: med.date_purch,
          pills_count: String(med.pills_count), // Convert to string for form handling
          dow: med.dow,
          frequency: String(med.frequency), // Convert to string for form handling
          dosage: med.dosage,
          tod: med.tod,
          description_med: med.description_med
        }));
        
        setMedications(formattedMedications);
      } catch (err: any) {
        console.error('Error fetching medication data:', err);
        // Show error state if needed
      }
    };

    fetchMedications();
  }, []);
  
  const handleBackToHome = () => {
    // Navigate back to the dashboard
    router.push('/home');
  };
  
  const toggleMedicationExpand = (id: string) => {
    if (expandedMedicationId === id) {
      setExpandedMedicationId(null);
    } else {
      setExpandedMedicationId(id);
    }
  };
  
  const startEditing = (medication: Medication) => {
    setEditingMedicationId(medication.id);
    setEditFormData({ ...medication });
  };
  
  const cancelEditing = () => {
    setEditingMedicationId(null);
    setEditFormData(null);
  };
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editFormData) return;
    
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  const handleDayToggle = (day: string) => {
    if (!editFormData) return;
    
    setEditFormData(prev => {
      if (!prev) return prev;
      
      if (prev.dow.includes(day)) {
        return {
          ...prev,
          dow: prev.dow.filter(d => d !== day)
        };
      } else {
        return {
          ...prev,
          dow: [...prev.dow, day]
        };
      }
    });
  };
  
  const handleTimeSlotToggle = (timeSlot: string) => {
    if (!editFormData) return;
    
    setEditFormData(prev => {
      if (!prev) return prev;
      
      // Handle null tod array
      const currentTod = prev.tod || [];
      
      if (currentTod.includes(timeSlot)) {
        return {
          ...prev,
          tod: currentTod.filter(t => t !== timeSlot)
        };
      } else {
        return {
          ...prev,
          tod: [...currentTod, timeSlot]
        };
      }
    });
  };
  
  const saveChanges = () => {
    if (!editFormData) return;
    
    // Validation
    if (editFormData.dow.length === 0) {
      alert("Please select at least one day of the week");
      return;
    }
    
    // Update the medication in the list
    const updatedMedications = medications.map(med => 
      med.id === editFormData.id ? editFormData : med
    );
    
    setMedications(updatedMedications);
    setEditingMedicationId(null);
    setEditFormData(null);
    
    alert("Medication updated successfully");
  };
  
  const deleteMedication = (id: string) => {
    if (window.confirm("Are you sure you want to delete this medication?")) {
      const updatedMedications = medications.filter(med => med.id !== id);
      setMedications(updatedMedications);
      alert("Medication deleted successfully");
    }
  };
  
  // Format day(s) of week for display
  const formatDaysOfWeek = (days: string[]) => {
    if (days.length === 7) return "Every day";
    
    if (days.length <= 2) {
      return days.map(day => day.substring(0, 3)).join(", ");
    }
    
    return `${days.length} days per week`;
  };
  
  // Format time(s) of day for display
  const formatTimesOfDay = (times: string[] | null) => {
    if (!times || times.length === 0) return "Not specified";
    return times.join(", ");
  };
  
  // Render the edit form for a medication
  const renderEditForm = (medication: Medication) => {
    if (!editFormData) return null;
    
    return (
      <div className="bg-indigo-50 p-4 rounded-b-lg border-t border-indigo-200 mt-2">
        <form className="space-y-5">
          {/* Medication Name */}
          <div>
            <label htmlFor="medication_name" className="block text-sm font-medium text-gray-700 mb-1">
              Medication Name *
            </label>
            <input
              type="text"
              id="medication_name"
              name="medication_name"
              value={editFormData.medication_name}
              onChange={handleEditChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Start Date */}
          <div>
            <label htmlFor="date_purch" className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-500 mr-2" />
              Start Date *
            </label>
            <input
              type="date"
              id="date_purch"
              name="date_purch"
              value={editFormData.date_purch}
              onChange={handleEditChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Pill Count */}
          <div>
            <label htmlFor="pills_count" className="block text-sm font-medium text-gray-700 mb-1">
              Amount of Pills *
            </label>
            <input
              type="number"
              id="pills_count"
              name="pills_count"
              value={editFormData.pills_count}
              onChange={handleEditChange}
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Days of Week */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Days of Week *
            </label>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {daysOfWeek.map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleDayToggle(day)}
                  className={`px-0 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    editFormData.dow.includes(day)
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700 border'
                      : 'bg-gray-50 border-gray-300 text-gray-700 border hover:bg-gray-100'
                  }`}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
            {editFormData.dow.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Please select at least one day</p>
            )}
          </div>
          
          {/* Serving (Dosage) */}
          <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
              Serving Size *
            </label>
            <input
              type="text"
              id="dosage"
              name="dosage"
              value={editFormData.dosage}
              onChange={handleEditChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Times Per Day (Frequency) */}
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon={faClock} className="text-indigo-500 mr-2" />
              Times Per Day (Optional)
            </label>
            <select
              id="frequency"
              name="frequency"
              value={editFormData.frequency}
              onChange={handleEditChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1">1 time per day</option>
              <option value="2">2 times per day</option>
              <option value="3">3 times per day</option>
              <option value="4">4 times per day</option>
              <option value="0">As needed</option>
            </select>
            
            {/* Time slots */}
            {editFormData.frequency !== "0" && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time(s) of Day (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((time) => (
                    <button
                      type="button"
                      key={time}
                      onClick={() => handleTimeSlotToggle(time)}
                      className={`px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                        (editFormData.tod || []).includes(time)
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-700 border'
                          : 'bg-gray-50 border-gray-300 text-gray-700 border hover:bg-gray-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Special Instructions (Optional) */}
          <div>
            <label htmlFor="description_med" className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon={faClipboardList} className="text-indigo-500 mr-2" />
              Special Instructions (Optional)
            </label>
            <textarea
              id="description_med"
              name="description_med"
              value={editFormData.description_med || ''}
              onChange={handleEditChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Form Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <button 
              type="button" 
              onClick={cancelEditing} 
              className="px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={saveChanges}
              className="px-4 py-3 bg-indigo-600 rounded-md text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl min-h-screen bg-gray-50 text-gray-900">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={handleBackToHome}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors mr-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FontAwesomeIcon icon={faPills} className="text-indigo-500 mr-2" />
          View & Edit Medications
        </h1>
      </div>
      
      {/* Medication List */}
      <div className="space-y-4">
        {medications.length === 0 ? (
          <div className="bg-white border border-gray-300 rounded-lg shadow-md p-8 text-center">
            <FontAwesomeIcon icon={faPills} className="text-gray-400 text-5xl mb-4" />
            <p className="text-gray-500">No medications found.</p>
            <button 
              className="mt-4 px-4 py-2 bg-indigo-600 rounded-md text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              onClick={() => alert("Redirecting to Add Medication page")}
            >
              Add Your First Medication
            </button>
          </div>
        ) : (
          medications.map((medication) => (
            <div 
              key={medication.id} 
              className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden"
            >
              <div 
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleMedicationExpand(medication.id)}
              >
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faPills} className="text-indigo-500 text-lg mr-3" />
                  <div>
                    <h3 className="font-medium text-lg">{medication.medication_name}</h3>
                    <p className="text-sm text-gray-600">{medication.dosage} • {formatDaysOfWeek(medication.dow)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {editingMedicationId !== medication.id && (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(medication);
                        }}
                        className="text-gray-500 hover:text-indigo-600 p-2"
                        aria-label="Edit medication"
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMedication(medication.id);
                        }}
                        className="text-gray-500 hover:text-red-600 p-2"
                        aria-label="Delete medication"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </>
                  )}
                  <span className="text-gray-400 ml-2">
                    <FontAwesomeIcon 
                      icon={expandedMedicationId === medication.id ? faChevronUp : faChevronDown} 
                    />
                  </span>
                </div>
              </div>
              
              {/* Medication Details */}
              {expandedMedicationId === medication.id && editingMedicationId !== medication.id && (
                <div className="bg-gray-50 p-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium">{new Date(medication.date_purch).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pill Count</p>
                      <p className="font-medium">{medication.pills_count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Days</p>
                      <p className="font-medium">{formatDaysOfWeek(medication.dow)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Times Per Day</p>
                      <p className="font-medium">
                        {medication.frequency === "0" 
                          ? "As needed" 
                          : `${medication.frequency} time(s) per day`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time of Day</p>
                      <p className="font-medium">{formatTimesOfDay(medication.tod)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Serving Size</p>
                      <p className="font-medium">{medication.dosage}</p>
                    </div>
                  </div>
                  
                  {medication.description_med && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Special Instructions</p>
                      <p className="font-medium mt-1">{medication.description_med}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => startEditing(medication)}
                      className="px-4 py-2 bg-indigo-600 rounded-md text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    >
                      <FontAwesomeIcon icon={faPencilAlt} className="mr-2" />
                      Edit
                    </button>
                  </div>
                </div>
              )}
              
              {/* Edit Form */}
              {editingMedicationId === medication.id && renderEditForm(medication)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EditMedicationsPage;