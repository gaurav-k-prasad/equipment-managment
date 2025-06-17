
"use client"; // Needed for usePathname

import type { Metadata } from 'next'; // Metadata type can still be used if needed, but export needs to be handled differently for client components or be static.
import '@/styles/globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { usePathname } from 'next/navigation';

// For client component layout, metadata should be handled via `generateMetadata` in child server components or page.tsx

const AUTH_PATHS = ['/login', '/register'];

// This component defines the main application shell with sidebar and header
function AppShell({ children }: { children: React.ReactNode }) {
  // AuthProvider handles its own loading state before rendering children.
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col md:ml-64"> {/* Sidebar width offset */}
        <AppHeader />
        <main className="flex-1 p-6 md:p-8 lg:p-10"> {/* Increased padding: p-4 sm:p-6 lg:p-8 -> p-6 md:p-8 lg:p-10 */}
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPath = AUTH_PATHS.some(authPath => pathname.startsWith(authPath));

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* Default/fallback title and meta description. More specific ones can be set in page.tsx files or child layouts using generateMetadata. */}
        <title>EquipTrack - Equipment Management System</title> 
        <meta name="description" content="Manage your equipment efficiently with EquipTrack." />
      </head>
      <body className="font-body antialiased"> {/* Main structure handled by AppShell or AuthLayout */}
        <AuthProvider>
          {isAuthPath ? (
            <>{children}</> // AuthLayout will render here, providing its own full-page structure
          ) : (
            <AppShell>{children}</AppShell>
          )}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

