
"use client";

import * as React from "react";
import { PlusCircle } from "lucide-react"; // Removed Upload icon as it's not used
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/PageContainer";
import { EquipmentTable } from "@/components/equipment/EquipmentTable";
import { EquipmentForm, type EquipmentFormValues } from "@/components/equipment/EquipmentForm";
import { DeleteEquipmentDialog } from "@/components/equipment/DeleteEquipmentDialog";
import { useEquipment, type EquipmentFilters } from "@/hooks/useEquipment";
import type { Equipment } from "@/types";
import { Timestamp } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { useAuth } from "@/context/AuthContext"; // No longer needed
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { equipmentList, loading, addEquipment, updateEquipment, deleteEquipment } = useEquipment(); // Removed fetchEquipment as it's called internally
  // const { isAdmin } = useAuth(); // No longer needed, assuming all actions are available

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingEquipment, setEditingEquipment] = React.useState<Equipment | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = React.useState<Equipment | null>(null);
  const [formIsLoading, setFormIsLoading] = React.useState(false);
  // const [filters, setFilters] = React.useState<EquipmentFilters>({}); // Currently unused, can be re-added if needed

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

  if (loading && equipmentList.length === 0) {
    return (
      <PageContainer title="Equipment Dashboard" description="Manage all your company's equipment.">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-96 w-full rounded-md" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Equipment Dashboard"
      description="View, add, and manage all your company's equipment."
      actions={
        // "Add Equipment" button is now always visible
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddEquipment}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-headline">
                {editingEquipment ? "Edit Equipment" : "Add New Equipment"}
              </DialogTitle>
              <DialogDescription>
                {editingEquipment
                  ? "Update the details of the existing equipment."
                  : "Fill in the details for the new equipment."}
              </DialogDescription>
            </DialogHeader>
            <EquipmentForm
              onSubmit={handleFormSubmit}
              defaultValues={defaultFormValues}
              isLoading={formIsLoading}
              submitButtonText={editingEquipment ? "Update Equipment" : "Add Equipment"}
            />
          </DialogContent>
        </Dialog>
      }
    >
      <EquipmentTable
        data={equipmentList}
        onEdit={handleEditEquipment}
        onDelete={(id) => {
          const eq = equipmentList.find(e => e.id === id);
          if (eq) handleDeleteEquipment(eq);
        }}
        onViewDetails={(id) => { /* Navigate to /equipment/[id] */ }}
        isLoading={loading}
        enableRowSelection={true} // Always enable row selection
      />
      {equipmentToDelete && (
        <DeleteEquipmentDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          equipmentName={equipmentToDelete.name}
        />
      )}
    </PageContainer>
  );
}
