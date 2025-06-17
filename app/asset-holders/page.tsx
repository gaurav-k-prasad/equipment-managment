
"use client";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function AssetHoldersPage() {
  return (
    <PageContainer 
        title="Asset Holders" 
        description="Manage individuals or entities responsible for assets."
        actions={
            <Button asChild>
                <Link href="/asset-holders/create-or-update"><PlusCircle className="mr-2 h-4 w-4"/> Add Asset Holder</Link>
            </Button>
        }
    >
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground mb-4">No asset holders found or feature under construction.</p>
        <p>You can add asset holders (e.g., employees, departments) to track asset assignments.</p>
        {/* Placeholder for a table or list of asset holders */}
      </div>
    </PageContainer>
  );
}
