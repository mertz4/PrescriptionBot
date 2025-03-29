// 6. Create a custom hook to fetch user data from Firestore

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@components/AuthContext';
import { db } from '@lib/firebase';

// Type for the user profile data stored in Firestore
interface UserProfile {
  email: string;
  createdAt: any; // Firestore Timestamp
  lastLogin: any; // Firestore Timestamp
  // Add any additional user fields here
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          setError('User profile not found');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  return { profile, loading, error };
};

// A hook to check if user is authenticated, for protecting routes
export const useRequireAuth = (redirectUrl = '/sign-in') => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectUrl);
    }
  }, [user, loading, redirectUrl, router]);

  return { user, loading };
};

// Add this import at the top
import { useRouter } from 'next/navigation';