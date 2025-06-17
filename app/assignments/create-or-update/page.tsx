
"use client";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Package, User, CalendarDays } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CreateOrUpdateAssignmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get("id");

  const pageTitle = assignmentId ? "Edit Assignment" : "Create New Assignment";

  return (
    <PageContainer title={pageTitle} description="Manage asset assignment details.">
      <Button onClick={() => router.back()} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">{pageTitle}</CardTitle>
            <CardDescription>Fill in the assignment details below.</CardDescription>
        </CardHeader>
        <CardContent>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label htmlFor="asset" className="block text-sm font-medium mb-1 flex items-center"><Package className="w-4 h-4 mr-1"/>Asset(s)</label>
                    {/* Replace with an Asset Selector component */}
                    <Input id="asset" placeholder="Select asset(s) to assign"/>
                </div>
                <div>
                    <label htmlFor="assignedTo" className="block text-sm font-medium mb-1 flex items-center"><User className="w-4 h-4 mr-1"/>Assigned To</label>
                    {/* Replace with an Asset Holder/User Selector component */}
                    <Input id="assignedTo" placeholder="Select user or asset holder"/>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="assignmentDate" className="block text-sm font-medium mb-1 flex items-center"><CalendarDays className="w-4 h-4 mr-1"/>Assignment Date</label>
                        <Input id="assignmentDate" type="date"/>
                    </div>
                    <div>
                        <label htmlFor="expectedReturnDate" className="block text-sm font-medium mb-1 flex items-center"><CalendarDays className="w-4 h-4 mr-1"/>Expected Return Date (Optional)</label>
                        <Input id="expectedReturnDate" type="date"/>
                    </div>
                </div>
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                    {/* Replace with a Select component for status (e.g., Active, Returned) */}
                    <Input id="status" placeholder="e.g., Active"/>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes (Optional)</label>
                    <Textarea id="notes" placeholder="Any relevant notes about the assignment..." />
                </div>
                <Button type="submit">Save Assignment (Placeholder)</Button>
            </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
