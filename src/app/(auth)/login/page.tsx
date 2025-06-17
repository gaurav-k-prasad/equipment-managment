
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/ui/PageContainer';
import { Logo } from '@/components/ui/Logo';

export default function LoginPageRemoved() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard as login is no longer a separate step
    router.replace('/dashboard');
  }, [router]);

  return (
    <PageContainer title="Redirecting...">
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <Logo size="lg" />
        <p className="text-muted-foreground mt-4">
          The login page has been removed. You will be redirected shortly.
        </p>
      </div>
    </PageContainer>
  );
}
