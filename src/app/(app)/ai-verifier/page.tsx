
"use client";

import { PageContainer } from "@/components/ui/PageContainer";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AIDataVerifierPageRemoved() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard as this page is removed
    router.replace('/dashboard');
  }, [router]);

  return (
    <PageContainer title="Page Removed">
      <p>This feature has been removed. Redirecting to dashboard...</p>
    </PageContainer>
  );
}
