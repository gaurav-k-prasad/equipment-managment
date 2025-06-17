
"use client";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Package, DollarSign, CalendarDays, Wrench, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function CreateOrUpdateMaintenancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const maintenanceId = searchParams.get("id");

  const pageTitle = maintenanceId ? "Edit Maintenance Log" : "Create New Maintenance Log";

  return (
    <PageContainer title={pageTitle} description="Log details of asset maintenance.">
      <Button onClick={() => router.back()} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">{pageTitle}</CardTitle>
            <CardDescription>Fill in the maintenance details below.</CardDescription>
        </CardHeader>
        <CardContent>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label htmlFor="asset" className="block text-sm font-medium mb-1 flex items-center"><Package className="w-4 h-4 mr-1"/>Asset</label>
                    {/* Replace with an Asset Selector component */}
                    <Input id="asset" placeholder="Select asset that was serviced"/>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="maintenanceDate" className="block text-sm font-medium mb-1 flex items-center"><CalendarDays className="w-4 h-4 mr-1"/>Maintenance Date</label>
                        <Input id="maintenanceDate" type="date"/>
                    </div>
                    <div>
                        <label htmlFor="maintenanceType" className="block text-sm font-medium mb-1 flex items-center"><Wrench className="w-4 h-4 mr-1"/>Type of Maintenance</label>
                        {/* <Select>
                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="repair">Repair</SelectItem>
                                <SelectItem value="preventive">Preventive Maintenance</SelectItem>
                                <SelectItem value="inspection">Inspection</SelectItem>
                                <SelectItem value="upgrade">Upgrade</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select> */}
                        <Input id="maintenanceType" placeholder="e.g., Repair, Inspection"/>
                    </div>
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">Description of Work Performed</label>
                    <Textarea id="description" placeholder="Detailed description of the service..." rows={4}/>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="cost" className="block text-sm font-medium mb-1 flex items-center"><DollarSign className="w-4 h-4 mr-1"/>Cost (Optional)</label>
                        <Input id="cost" type="number" placeholder="0.00"/>
                    </div>
                    <div>
                        <label htmlFor="performedBy" className="block text-sm font-medium mb-1 flex items-center"><User className="w-4 h-4 mr-1"/>Performed By (Optional)</label>
                        <Input id="performedBy" placeholder="e.g., Technician Name, Internal Team, Vendor"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium mb-1">Additional Notes (Optional)</label>
                    <Textarea id="notes" placeholder="Any other relevant details..." />
                </div>
                <Button type="submit">Save Maintenance Log (Placeholder)</Button>
            </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
