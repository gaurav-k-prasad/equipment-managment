
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext'; // AuthContext now auto-handles user session
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  // const { currentUser, loading } = useAuth(); // No longer needed for this simple redirect
  const router = useRouter();

  useEffect(() => {
    // AuthContext now ensures a mock user is always set up.
    // Directly redirect to the dashboard.
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <LoadingSpinner size={48} />
      <p className="ml-2">Redirecting to dashboard...</p>
    </div>
  );
}
