
"use client";

import * as React from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Settings2, Edit3 } from "lucide-react";
import { useEquipment } from "@/hooks/useEquipment";
// import { useAuth } from "@/context/AuthContext"; // No longer needed
// import { useRouter } from "next/navigation"; // No longer needed
import type { Equipment } from "@/types";
import type { VisibilityState } from "@tanstack/react-table";
import { EquipmentTable } from "@/components/equipment/EquipmentTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultColumnVisibility: VisibilityState = {
  serialNumber: true,
  purchaseDate: true,
  warrantyExpiryDate: true,
  assignedTo: false,
  location: false,
};

export default function AdminPage() {
  const { equipmentList, loading, exportEquipmentToCSV, batchUpdateEquipment } = useEquipment();
  // const { isAdmin, loading: authLoading } = useAuth(); // No longer needed
  // const router = useRouter(); // No longer needed

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("adminTableColumnVisibility");
      return saved ? JSON.parse(saved) : defaultColumnVisibility;
    }
    return defaultColumnVisibility;
  });
  
  const [selectedEquipment, setSelectedEquipment] = React.useState<Equipment[]>([]);
  const [bulkActionStatus, setBulkActionStatus] = React.useState<Equipment['status'] | ''>('');

  // React.useEffect(() => { // No longer needed
  //   if (!authLoading && !isAdmin) {
  //     router.replace("/dashboard");
  //   }
  // }, [isAdmin, authLoading, router]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
       localStorage.setItem("adminTableColumnVisibility", JSON.stringify(columnVisibility));
    }
  }, [columnVisibility]);

  const handleColumnVisibilityChange = (id: keyof Equipment | string, checked: boolean) => {
    setColumnVisibility(prev => ({ ...prev, [id]: checked }));
  };
  
  const handleBulkUpdateStatus = async () => {
    if (selectedEquipment.length === 0 || !bulkActionStatus) return;
    const idsToUpdate = selectedEquipment.map(eq => eq.id);
    await batchUpdateEquipment(idsToUpdate, { status: bulkActionStatus });
    setSelectedEquipment([]); // Clear selection
  };
  
  const allTableColumns: Array<{ id: keyof Equipment | string; label: string }> = [
    { id: "name", label: "Name" },
    { id: "category", label: "Category" },
    { id: "status", label: "Status" },
    { id: "serialNumber", label: "Serial Number" },
    { id: "purchaseDate", label: "Purchase Date" },
    { id: "warrantyExpiryDate", label: "Warranty Expiry" },
    { id: "assignedTo", label: "Assigned To" },
    { id: "location", label: "Location" },
  ];

  // The loading/unauthorized message is removed as the page is now always accessible
  // if (authLoading || !isAdmin) {
  //   return (
  //     <PageContainer title="Admin Panel">
  //       <p>Loading or unauthorized...</p>
  //     </PageContainer>
  //   );
  // }

  return (
    <PageContainer
      title="Admin Panel"
      description="Manage advanced settings and perform bulk operations."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Settings2 className="h-5 w-5"/>Table Column Visibility</CardTitle>
            <CardDescription>Choose which columns are visible in the main equipment table for all users (admin view might differ based on this setting for consistency).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {allTableColumns.filter(col => col.id !== 'name' && col.id !== 'status' && col.id !== 'category').map(col => (
                 <div key={col.id} className="flex items-center space-x-2">
                    <Checkbox
                        id={col.id}
                        checked={columnVisibility[col.id] ?? false}
                        onCheckedChange={(checked) => handleColumnVisibilityChange(col.id, !!checked)}
                    />
                    <Label htmlFor={col.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {col.label}
                    </Label>
                 </div>
            ))}
            <p className="text-xs text-muted-foreground pt-2">Note: Name, Category, and Status columns are always visible. Changes apply to the main dashboard table.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Download className="h-5 w-5"/>Bulk Data Export</CardTitle>
            <CardDescription>Export all equipment data to a CSV file.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={exportEquipmentToCSV} className="w-full">
              <Download className="mr-2 h-4 w-4" /> Export to CSV
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Edit3 className="h-5 w-5"/>Bulk Status Update</CardTitle>
            <CardDescription>Select equipment from the table below and update their status in bulk.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={bulkActionStatus} onValueChange={(value) => setBulkActionStatus(value as Equipment['status'])}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="In Use">In Use</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Retired">Retired</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleBulkUpdateStatus} 
              disabled={selectedEquipment.length === 0 || !bulkActionStatus}
              className="w-full"
            >
              Update Status for {selectedEquipment.length} item(s)
            </Button>
             {selectedEquipment.length > 0 && <p className="text-xs text-muted-foreground">Selected items: {selectedEquipment.map(eq => eq.name).join(', ')}</p>}
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="font-headline">Equipment Overview for Bulk Actions</CardTitle>
          <CardDescription>Select equipment items from this table to perform bulk actions.</CardDescription>
        </CardHeader>
        <CardContent>
            <EquipmentTable
                data={equipmentList}
                onEdit={() => {}} // Not used here, or navigate to edit page
                onDelete={() => {}} // Not used here, or implement bulk delete
                isLoading={loading}
                columnVisibilityInitial={columnVisibility} 
                onColumnVisibilityChange={setColumnVisibility} 
                enableRowSelection={true} // Always enable row selection
                onSelectionChange={setSelectedEquipment}
            />
        </CardContent>
      </Card>

    </PageContainer>
  );
}
