
"use client";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import Link from "next/link";

export default function MaintenancesPage() {
  return (
    <PageContainer 
        title="Asset Maintenance Logs" 
        description="Track service, repairs, and maintenance activities for your assets."
        actions={
            <Button asChild>
                <Link href="/maintenances/create-or-update"><PlusCircle className="mr-2 h-4 w-4"/>Log New Maintenance</Link>
            </Button>
        }
    >
      <div className="border rounded-lg p-8 text-center">
         <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4"/>
        <p className="text-muted-foreground mb-4">No maintenance logs found or feature under construction.</p>
        <p>Keep a detailed history of all maintenance performed on your assets to ensure longevity and performance.</p>
        {/* Placeholder for a table or list of maintenance logs */}
      </div>
    </PageContainer>
  );
}
