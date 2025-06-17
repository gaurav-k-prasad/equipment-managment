
"use client";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <PageContainer title="Register Account">
      <h2 className="text-2xl font-headline mb-6 text-center">Create an Account</h2>
      <p className="text-muted-foreground mb-4 text-center">
        Registration is currently a placeholder.
      </p>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground">Full Name</label>
          <input type="text" id="name" className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Your Name" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
          <input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Password" />
        </div>
        <Button type="button" className="w-full">
          Register (Placeholder)
        </Button>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link href="/login" className="underline text-primary">Login</Link>
      </p>
    </PageContainer>
  );
}
