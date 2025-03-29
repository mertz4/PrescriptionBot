// 7. Create a ProtectedRoute component for pages that require authentication

'use client';

import { ReactNode } from 'react';
import { useAuth } from '@components/AuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If auth is still loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  // If no user is logged in, redirect to sign in
  if (!user) {
    router.push('/sign-in');
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;

// Usage example for a protected page:
/*
'use client';

import ProtectedRoute from '@components/ProtectedRoute';

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>This is protected content</p>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
*/