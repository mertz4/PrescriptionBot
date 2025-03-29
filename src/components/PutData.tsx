import { getAuth } from 'firebase/auth';

// Define the type for the medication submission data
interface MedicationSubmitData {
  drugName: string;
  startDate: string;
  pillAmount: number;
  daysOfWeek: string[]; // ["Mon", "Tue", etc.]
  servingSize: string;
  timesPerDay: number;
  timesOfDay?: string[]; // Optional: ["Morning", "Noon", "Afternoon", "Evening"]
  specialInstructions?: string; // Optional
}

/**
 * Submits medication data to the API
 * @param medicationData The medication data to submit
 * @param apiEndpoint The API endpoint URL (defaults to your medication API)
 * @returns Promise resolving to the API response
 */
export const submitMedication = async (
  medicationData: MedicationSubmitData, 
  apiEndpoint = 'https://your-api-endpoint.com/medications'
): Promise<any> => {
  // Get the current user
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  try {
    // Get the authentication token
    const token = await user.getIdToken();
    
    // Prepare the request body
    const requestBody = {
      ...medicationData,
      userId: user.uid // Add the user ID to the request
    };
    
    // Make the API request
    const response = await fetch(apiEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`API error: ${response.status} - ${errorData || response.statusText}`);
    }
    
    // Return the response data
    return await response.json();
  } catch (error: any) {
    console.error('Error submitting medication:', error);
    throw new Error(error.message || 'Failed to submit medication data');
  }
};
