
import type { ReactNode } from 'react';
import { Logo } from '@/components/shared/Logo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-lg border">
        {children}
      </div>
    </div>
  );
}
