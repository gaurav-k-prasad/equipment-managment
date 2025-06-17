
import type { ReactNode } from 'react';

// The main AppSidebar and AppHeader are now provided by RootLayout for all non-auth pages.
// This layout is simplified to just pass children through.
// The main content area, including padding, is handled by AppShell in RootLayout.
export default function PublicLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
