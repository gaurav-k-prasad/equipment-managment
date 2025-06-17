
"use client";
// AppHeader and AppSidebar are now in RootLayout.
// The global loading state (handled by AuthProvider) and main page structure are also in RootLayout.
// This layout now simply passes its children through to be rendered in the main content area defined by AppShell.

export default function DashboardAppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
