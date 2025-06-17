// This is the root page.
// It should ideally redirect to the main landing page or dashboard.
// For now, it redirects to the new public landing page.
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'; // Path updated

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard'); // Default to dashboard as auth is removed
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <LoadingSpinner size={48} />
      <p className="ml-2">Loading application...</p>
    </div>
  );
}
