"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPills, 
  faCalendarAlt, 
  faArrowLeft,
  faClock,
  faClipboardList
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { submitMedication } from "@components/PostData"; // Import the submit function

interface FormData {
  name: string;
  startDate: string;
  pillCount: string;
  daysOfWeek: string[];
  timesPerDay: string;
  serving: string;
  timeOfDay: string[];
  specialInstructions: string;
}

const AddMedicationPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    startDate: new Date().toISOString().split('T')[0],
    pillCount: "",
    daysOfWeek: [],
    timesPerDay: "1",
    serving: "",
    timeOfDay: [],
    specialInstructions: ""
  });

  // Available days and time slots
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = ["Morning", "Noon", "Afternoon", "Evening"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => {
      if (prev.daysOfWeek.includes(day)) {
        return {
          ...prev,
          daysOfWeek: prev.daysOfWeek.filter(d => d !== day)
        };
      } else {
        return {
          ...prev,
          daysOfWeek: [...prev.daysOfWeek, day]
        };
      }
    });
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    setFormData((prev) => {
      if (prev.timeOfDay.includes(timeSlot)) {
        return {
          ...prev,
          timeOfDay: prev.timeOfDay.filter(t => t !== timeSlot)
        };
      } else {
        return {
          ...prev,
          timeOfDay: [...prev.timeOfDay, timeSlot]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.daysOfWeek.length === 0) {
      setError("Please select at least one day of the week");
      return;
    }

    if (!formData.name || !formData.startDate || !formData.pillCount || !formData.serving) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Convert daysOfWeek to the required format (Mon, Tue, Wed...)
      const formattedDays = formData.daysOfWeek.map(day => day.substring(0, 3));
      
      // Prepare data for submission in the format expected by submitMedication
      const medicationData = {
        drugName: formData.name,
        startDate: formData.startDate,
        pillAmount: parseInt(formData.pillCount),
        daysOfWeek: formattedDays,
        servingSize: formData.serving,
        timesPerDay: parseInt(formData.timesPerDay),
      };
      
      // Add optional fields only if they have values
      if (formData.timeOfDay.length > 0) {
        Object.assign(medicationData, { timesOfDay: formData.timeOfDay });
      }
      
      if (formData.specialInstructions.trim()) {
        Object.assign(medicationData, { specialInstructions: formData.specialInstructions.trim() });
      }

      // Submit the medication data
      const result = await submitMedication(medicationData);
      console.log('Medication added successfully:', result);
      
      // Show success message
      setSuccess(true);
      
      // Redirect to home after successful submission with a slight delay
      setTimeout(() => {
        router.push("/home");
      }, 1500);
      
    } catch (err: any) {
      console.error('Error adding medication:', err);
      setError(err.message || 'Failed to add medication');
    } finally {
      setLoading(false);
    }
  };

  // Generate time of day options based on times per day
  const renderTimeSlots = () => {
    return (
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
                formData.timeOfDay.includes(time)
                  ? 'bg-indigo-100 border-indigo-300 text-indigo-700 border'
                  : 'bg-gray-50 border-gray-300 text-gray-700 border hover:bg-gray-100'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl min-h-screen bg-gray-50 text-gray-900">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FontAwesomeIcon icon={faPills} className="text-indigo-500 mr-2" />
          Add New Medication
        </h1>
      </div>
      
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 relative">
          <span className="block sm:inline">Medication added successfully!</span>
        </div>
      )}
      
      {/* Form Container */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Medication Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Medication Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter medication name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-500 mr-2" />
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Pill Count */}
          <div>
            <label htmlFor="pillCount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount of Pills *
            </label>
            <input
              type="number"
              id="pillCount"
              name="pillCount"
              value={formData.pillCount}
              onChange={handleChange}
              required
              min="1"
              placeholder="Number of pills"
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
                    formData.daysOfWeek.includes(day)
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700 border'
                      : 'bg-gray-50 border-gray-300 text-gray-700 border hover:bg-gray-100'
                  }`}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
            {formData.daysOfWeek.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Please select at least one day</p>
            )}
          </div>
          
          {/* Serving */}
          <div>
            <label htmlFor="serving" className="block text-sm font-medium text-gray-700 mb-1">
              Serving Size *
            </label>
            <input
              type="text"
              id="serving"
              name="serving"
              value={formData.serving}
              onChange={handleChange}
              required
              placeholder="e.g., 10mg, 1 tablet, 2 capsules"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Times Per Day */}
          <div>
            <label htmlFor="timesPerDay" className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon={faClock} className="text-indigo-500 mr-2" />
              Times Per Day
            </label>
            <select
              id="timesPerDay"
              name="timesPerDay"
              value={formData.timesPerDay}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3 times per day</option>
            </select>
            
            {/* Show time slots if not "As needed" */}
            {formData.timesPerDay !== "0" && renderTimeSlots()}
          </div>
          
          {/* Special Instructions (Optional) */}
          <div>
            <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon={faClipboardList} className="text-indigo-500 mr-2" />
              Special Instructions (Optional)
            </label>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              rows={3}
              placeholder="Any special instructions or notes"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Form Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => router.push("/home")}
              disabled={loading}
              className="px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-4 py-3 bg-indigo-600 rounded-md text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding Medication...' : 'Add Medication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicationPage;