
"use client";

import * as React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/PageContainer";
import { EquipmentTable } from "@/components/equipment/EquipmentTable"; // This will need to be AssetTable or similar
import { EquipmentForm, type EquipmentFormValues } from "@/components/equipment/EquipmentForm"; // This will be AssetForm
import { DeleteEquipmentDialog } from "@/components/equipment/DeleteEquipmentDialog"; // This will be DeleteAssetDialog
import { useEquipment, type EquipmentFilters } from "@/hooks/useEquipment"; // This will be useAssets
import type { Equipment } from "@/types"; // This will be Asset type
import { Timestamp } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package, AlertTriangle } from "lucide-react";
import Link from 'next/link'; // Added missing import
// import { ChartContainer, ChartTooltipContent, BarChart, XAxis, YAxis, Bar } from "@/components/ui/chart"; // Example for charts
// For now, this page shows "Equipment", will need refactor to "Assets" and general dashboard items

export default function DashboardOverviewPage() {
  const { equipmentList, loading, addEquipment, updateEquipment, deleteEquipment } = useEquipment();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingEquipment, setEditingEquipment] = React.useState<Equipment | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = React.useState<Equipment | null>(null);
  const [formIsLoading, setFormIsLoading] = React.useState(false);

  const handleAddEquipment = () => {
    setEditingEquipment(null);
    setIsFormOpen(true);
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setIsFormOpen(true);
  };

  const handleDeleteEquipment = (equipment: Equipment) => {
    setEquipmentToDelete(equipment);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (equipmentToDelete) {
      await deleteEquipment(equipmentToDelete.id);
      setIsDeleteDialogOpen(false);
      setEquipmentToDelete(null);
    }
  };

  const handleFormSubmit = async (data: EquipmentFormValues) => {
    setFormIsLoading(true);
    const equipmentData = {
      ...data,
      purchaseDate: data.purchaseDate ? Timestamp.fromDate(data.purchaseDate) : null,
      warrantyExpiryDate: data.warrantyExpiryDate ? Timestamp.fromDate(data.warrantyExpiryDate) : null,
    };

    if (editingEquipment) {
      await updateEquipment(editingEquipment.id, equipmentData);
    } else {
      await addEquipment(equipmentData as Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>);
    }
    setFormIsLoading(false);
    setIsFormOpen(false);
    setEditingEquipment(null);
  };
  
  const defaultFormValues = editingEquipment
    ? {
        ...editingEquipment,
        purchaseDate: editingEquipment.purchaseDate?.toDate(),
        warrantyExpiryDate: editingEquipment.warrantyExpiryDate?.toDate(),
      }
    : undefined;

  // Placeholder data for charts - replace with real data aggregation
  const equipmentByCategory = [
    { category: "Laptops", count: equipmentList.filter(e => e.category === 'Laptop').length || 5 },
    { category: "Monitors", count: equipmentList.filter(e => e.category === 'Monitor').length || 8 },
    { category: "Printers", count: equipmentList.filter(e => e.category === 'Printer').length || 3 },
    { category: "Misc", count: equipmentList.filter(e => !['Laptop', 'Monitor', 'Printer'].includes(e.category)).length || 2 },
  ];

  // const chartConfig = { count: { label: "Count", color: "hsl(var(--primary))" } } satisfies ChartConfig;


  if (loading && equipmentList.length === 0) {
    return (
      <PageContainer title="Dashboard Overview" description="Key metrics and quick actions.">
        <Skeleton className="h-32 w-full mb-6" /> 
        <Skeleton className="h-32 w-full mb-6" /> 
        <Skeleton className="h-32 w-full mb-6" />
        <Skeleton className="h-96 w-full rounded-md" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Dashboard Overview"
      description="Key metrics, recent activity, and quick actions."
      actions={
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddEquipment}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-headline">
                {editingEquipment ? "Edit Asset" : "Add New Asset"}
              </DialogTitle>
              <DialogDescription>
                {editingEquipment
                  ? "Update the details of the existing asset."
                  : "Fill in the details for the new asset."}
              </DialogDescription>
            </DialogHeader>
            <EquipmentForm // TODO: Rename to AssetForm
              onSubmit={handleFormSubmit}
              defaultValues={defaultFormValues}
              isLoading={formIsLoading}
              submitButtonText={editingEquipment ? "Update Asset" : "Add Asset"}
            />
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipmentList.length}</div>
            <p className="text-xs text-muted-foreground">+2 since last month (mock data)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assets In Use</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipmentList.filter(e => e.status === 'In Use').length}</div>
             <p className="text-xs text-muted-foreground">Currently assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipmentList.filter(e => e.status === 'Maintenance').length}</div>
            <p className="text-xs text-muted-foreground">Awaiting or in service</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Warranty (Soon)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{
                equipmentList.filter(e => e.warrantyExpiryDate && e.warrantyExpiryDate.toDate() < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && e.warrantyExpiryDate.toDate() > new Date()).length
            }</div>
            <p className="text-xs text-muted-foreground">Within next 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><BarChart3 className="h-5 w-5"/>Asset Categories</CardTitle>
          <CardDescription>Distribution of assets across different categories.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart accessibilityLayer data={equipmentByCategory}>
              <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltipContent hideLabel />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card> */}


      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Recent Assets Overview</CardTitle>
            <CardDescription>A quick look at your asset inventory. Manage all assets in the <Link href="/assets" className="text-primary underline">Assets section</Link>.</CardDescription>
        </CardHeader>
        <CardContent>
            <EquipmentTable // TODO: Rename to AssetTable
                data={equipmentList}
                onEdit={handleEditEquipment}
                onDelete={(id) => {
                const eq = equipmentList.find(e => e.id === id);
                if (eq) handleDeleteEquipment(eq);
                }}
                onViewDetails={(id) => { /* Navigate to /assets/[id] */ }}
                isLoading={loading}
                enableRowSelection={true}
            />
        </CardContent>
      </Card>
      {equipmentToDelete && (
        <DeleteEquipmentDialog // TODO: Rename to DeleteAssetDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          equipmentName={equipmentToDelete.name}
        />
      )}
    </PageContainer>
  );
}

// Placeholder for Users icon if not imported from lucide
const Users = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

    