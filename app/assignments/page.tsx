
"use client";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function AssignmentsPage() {
  return (
    <PageContainer 
        title="Asset Assignments" 
        description="Track which assets are assigned to whom and for how long."
        actions={
            <Button asChild>
                <Link href="/assignments/create-or-update"><PlusCircle className="mr-2 h-4 w-4"/>New Assignment</Link>
            </Button>
        }
    >
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground mb-4">No assignments found or feature under construction.</p>
        <p>You can assign assets to users or asset holders and track assignment history.</p>
        {/* Placeholder for a table or list of assignments */}
      </div>
    </PageContainer>
  );
}
