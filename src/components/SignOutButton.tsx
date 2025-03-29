'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@components/AuthContext';

const SignOutButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await logout();
      router.push('/sign-in');
    } catch (error) {
      console.error('Failed to sign out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="h-10 items-center cursor-pointer font-medium rounded-lg text-m text-center focus:ring-2 focus:outline-none my-0 justify-center align-middle w-12 flex bg-indigo-400 hover:bg-indigo-500 focus:ring-indigo-600 text-white"
    >
      {loading ? '...' : 'Sign Out'}
    </button>
  );
};

export default SignOutButton;