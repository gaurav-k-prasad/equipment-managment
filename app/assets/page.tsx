
"use client";

import * as React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/PageContainer";
import { EquipmentTable } from "@/components/equipment/EquipmentTable"; // This will need to be AssetTable or similar
import { EquipmentForm, type EquipmentFormValues } from "@/components/equipment/EquipmentForm"; // This will be AssetForm
import { DeleteEquipmentDialog } from "@/components/equipment/DeleteEquipmentDialog"; // This will be DeleteAssetDialog
import { useEquipment } from "@/hooks/useEquipment"; // This will be useAssets
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
import { useRouter }
 from "next/navigation";

// This page will list all assets, similar to the old dashboard page.
export default function AssetsListPage() {
  const router = useRouter();
  const { equipmentList, loading, addEquipment, updateEquipment, deleteEquipment } = useEquipment(); // TODO: Rename to useAssets

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingEquipment, setEditingEquipment] = React.useState<Equipment | null>(null); // TODO: Rename to editingAsset
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = React.useState<Equipment | null>(null); // TODO: Rename to assetToDelete
  const [formIsLoading, setFormIsLoading] = React.useState(false);

  const handleAddEquipment = () => {
    // router.push('/assets/create-or-update'); // Alternative: navigate to dedicated form page
    setEditingEquipment(null);
    setIsFormOpen(true);
  };

  const handleEditEquipment = (equipment: Equipment) => {
    // router.push(`/assets/create-or-update?id=${equipment.id}`); // Alternative: navigate to dedicated form page
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
    const equipmentData = { // TODO: Rename to assetData
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
      <PageContainer title="Manage Assets" description="View, add, and manage all company assets.">
        <Skeleton className="h-12 w-32 mb-4" />
        <Skeleton className="h-96 w-full rounded-md" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Manage Assets"
      description="View, add, and manage all company assets."
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
      <EquipmentTable // TODO: Rename to AssetTable
        data={equipmentList}
        onEdit={handleEditEquipment}
        onDelete={(id) => {
          const eq = equipmentList.find(e => e.id === id);
          if (eq) handleDeleteEquipment(eq);
        }}
        onViewDetails={(id) => router.push(`/assets/${id}`)}
        isLoading={loading}
        enableRowSelection={true}
      />
      {equipmentToDelete && (
        <DeleteEquipmentDialog // TODO: Rename to DeleteAssetDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          equipmentName={equipmentToDelete.name} // TODO: Rename to assetName
        />
      )}
    </PageContainer>
  );
}
