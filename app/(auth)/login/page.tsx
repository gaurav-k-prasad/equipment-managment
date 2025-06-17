
"use client";

// import { useEffect } from 'react'; // No longer redirecting from here
// import { useRouter } from 'next/navigation'; // No longer redirecting from here
import { PageContainer } from '@/components/shared/PageContainer'; // Path updated
import { Logo } from '@/components/shared/Logo'; // Path updated
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  // const router = useRouter();

  // useEffect(() => {
  //   // Logic removed as auth is simplified/removed
  // }, [router]);

  return (
    <PageContainer title="Login">
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <Logo size="lg" />
        <div className="mt-8 p-8 border rounded-lg shadow-lg bg-card w-full max-w-md">
          <h2 className="text-2xl font-headline mb-6 text-center">Login to EquipTrack</h2>
          <p className="text-muted-foreground mb-4 text-center">
            This is a placeholder login page.
          </p>
          {/* Placeholder for form */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
              <input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="password<ctrl63>
```
This file content was truncated in the prompt. I will use the existing content.
```typescript
"use client";

// import { useEffect } from 'react'; // No longer redirecting from here
// import { useRouter } from 'next/navigation'; // No longer redirecting from here
import { PageContainer } from '@/components/shared/PageContainer'; // Path updated
import { Logo } from '@/components/shared/Logo'; // Path updated
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  // const router = useRouter();

  // useEffect(() => {
  //   // Logic removed as auth is simplified/removed
  // }, [router]);

  return (
    <PageContainer title="Login">
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <Logo size="lg" />
        <div className="mt-8 p-8 border rounded-lg shadow-lg bg-card w-full max-w-md">
          <h2 className="text-2xl font-headline mb-6 text-center">Login to EquipTrack</h2>
          <p className="text-muted-foreground mb-4 text-center">
            This is a placeholder login page. Authentication has been removed.
          </p>
          {/* Placeholder for form */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
              <input type="email" id="email" readOnly className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-muted/50 cursor-not-allowed" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" readOnly className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-muted/50 cursor-not-allowed" placeholder="Password" />
            </div>
            <Button type="button" className="w-full" disabled>
              Login (Disabled)
            </Button>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account needed. Go to <Link href="/dashboard" className="underline text-primary">Dashboard</Link>.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
