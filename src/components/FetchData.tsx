import { useEffect, useState } from 'react';
import { useAuth } from '@components/AuthContext';

// Define the medication data structure
interface MedicationDetails {
  startDate: string;
  pillAmount: number;
  daysOfWeek: string[];
  servingSize: string;
  frequency: number;
  timesOfDay: string[];
  specialInstructions: string;
}

// Define the result dictionary type
type MedicationDictionary = {
  [drugName: string]: MedicationDetails;
};

// API fetch function
export const useMedicationData = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState<MedicationDictionary>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Replace with your actual API endpoint 
        // const response = await fetch(`https://your-api-endpoint.com/medications?userId=${user.uid}`, {
        const response = await fetch(`@components/test-data.json`, {
          //headers: {
            // 'Authorization': `Bearer ${await user.getIdToken()}`,
            //'Content-Type': 'application/json'
          //}
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Process the data into the required dictionary format
        const medicationDict: MedicationDictionary = {};
        
        data.forEach((med: any) => {
          medicationDict[med.drugName] = {
            startDate: med.startDate,
            pillAmount: med.pillAmount,
            daysOfWeek: med.daysOfWeek,
            servingSize: med.servingSize,
            frequency: med.frequency,
            timesOfDay: med.timesOfDay,
            specialInstructions: med.specialInstructions || ''
          };
        });
        
        setMedications(medicationDict);
      } catch (err: any) {
        console.error('Error fetching medication data:', err);
        setError(err.message || 'Failed to fetch medication data');
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [user]);

  return { medications, loading, error };
};

// Direct function version (alternative to the hook)
export const fetchMedicationData = async (userId: string, authToken: string): Promise<MedicationDictionary> => {
  try {
    // Replace with your actual API endpoint
    //const response = await fetch(`https://your-api-endpoint.com/medications?userId=${userId}`, {
    const response = await fetch(`test-data.json`, {
      headers: {
        //'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Process the data into the required dictionary format
    const medicationDict: MedicationDictionary = {};
    
    data.forEach((med: any) => {
      medicationDict[med.drugName] = {
        startDate: med.startDate,
        pillAmount: med.pillAmount,
        daysOfWeek: med.daysOfWeek,
        servingSize: med.servingSize,
        frequency: med.frequency,
        timesOfDay: med.timesOfDay,
        specialInstructions: med.specialInstructions || ''
      };
    });
    
    return medicationDict;
  } catch (error: any) {
    console.error('Error fetching medication data:', error);
    throw new Error(error.message || 'Failed to fetch medication data');
  }
};

// Example of how to use the function directly
export const getMedicationData = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const token = await user.getIdToken();
  return fetchMedicationData(user.uid, token);
};

// Don't forget to import getAuth at the top
import { getAuth } from 'firebase/auth';