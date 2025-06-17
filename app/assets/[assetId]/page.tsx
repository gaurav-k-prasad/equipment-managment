
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useEquipment } from "@/hooks/useEquipment"; // TODO: useAssets
import type { Equipment } from "@/types"; // TODO: Asset type
import { EquipmentForm, type EquipmentFormValues } from "@/components/equipment/EquipmentForm"; // TODO: AssetForm
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { DeleteEquipmentDialog } from "@/components/equipment/DeleteEquipmentDialog"; // TODO: DeleteAssetDialog
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assetId = typeof params.assetId === "string" ? params.assetId : ""; // Changed from id to assetId
  const { getEquipmentById, updateEquipment, deleteEquipment } = useEquipment(); // TODO: useAssets, getAssetById, updateAsset, deleteAsset

  const [asset, setAsset] = React.useState<Equipment | null>(null); // TODO: Rename to asset
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formIsLoading, setFormIsLoading] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (assetId) {
      const fetchDetails = async () => {
        setIsLoading(true);
        const data = await getEquipmentById(assetId); // TODO: getAssetById
        setAsset(data);
        setIsLoading(false);
      };
      fetchDetails();
    }
  }, [assetId, getEquipmentById]);

  const handleFormSubmit = async (data: EquipmentFormValues) => { // TODO: AssetFormValues
    if (!asset) return;
    setFormIsLoading(true);
    const assetDataToUpdate = { // TODO: assetDataToUpdate
      ...data,
      purchaseDate: data.purchaseDate ? Timestamp.fromDate(data.purchaseDate) : null,
      warrantyExpiryDate: data.warrantyExpiryDate ? Timestamp.fromDate(data.warrantyExpiryDate) : null,
    };
    await updateEquipment(asset.id, assetDataToUpdate); // TODO: updateAsset
    const updatedAsset = await getEquipmentById(assetId); // Refetch after update // TODO: getAssetById
    setAsset(updatedAsset);
    setFormIsLoading(false);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!asset) return;
    await deleteEquipment(asset.id); // TODO: deleteAsset
    setIsDeleteDialogOpen(false);
    router.push("/assets"); // Navigate to assets list
  };

  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return "N/A";
    return format(timestamp.toDate(), "PPP");
  };
  
  const getStatusBadgeVariant = (status: Equipment["status"]) => {
    if (status === "Available") return "default";
    if (status === "In Use") return "secondary";
    if (status === "Maintenance") return "outline";
    if (status === "Retired") return "destructive";
    return "default";
  };

  if (isLoading) {
    return (
      <PageContainer title="Loading Asset...">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={48} />
        </div>
      </PageContainer>
    );
  }

  if (!asset) {
    return (
      <PageContainer title="Asset Not Found">
        <p>The asset item you are looking for does not exist or could not be loaded.</p>
        <Button onClick={() => router.push("/assets")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assets List
        </Button>
      </PageContainer>
    );
  }
  
  const defaultFormValues = {
    ...asset,
    purchaseDate: asset.purchaseDate?.toDate(),
    warrantyExpiryDate: asset.warrantyExpiryDate?.toDate(),
  };

  return (
    <PageContainer
      title={isEditing ? `Editing: ${asset.name}` : asset.name}
      description={isEditing ? "Update the asset details below." : `Details for ${asset.serialNumber}`}
      actions={
        !isEditing && (
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        )
      }
    >
      <Button onClick={() => router.back()} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Edit Asset Form</CardTitle>
          </CardHeader>
          <CardContent>
            <EquipmentForm // TODO: AssetForm
              onSubmit={handleFormSubmit}
              defaultValues={defaultFormValues}
              isLoading={formIsLoading}
              submitButtonText="Update Asset"
            />
            <Button variant="outline" onClick={() => setIsEditing(false)} className="mt-4">
              Cancel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline text-2xl">{asset.name}</CardTitle>
                <CardDescription>Serial Number: {asset.serialNumber}</CardDescription>
              </div>
              <Badge variant={getStatusBadgeVariant(asset.status)} className="text-sm px-3 py-1">{asset.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {asset.imageUrl && (
              <div className="md:col-span-2 relative w-full h-64 rounded-md overflow-hidden border">
                 <Image src={asset.imageUrl} alt={asset.name} layout="fill" objectFit="contain" data-ai-hint="product photo"/>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <p>{asset.category}</p>
            </div>
             <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Purchase Date</p>
              <p>{formatDate(asset.purchaseDate)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Warranty Expiry Date</p>
              <p>{formatDate(asset.warrantyExpiryDate)}</p>
            </div>
             <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
              <p>{asset.assignedTo || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p>{asset.location || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Tracking Number</p>
              <p>{asset.trackingNumber || "N/A"}</p>
            </div>
             <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Tracking Status</p>
              <p>{asset.trackingStatus || "N/A"}</p>
            </div>
            <div className="md:col-span-2 space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="whitespace-pre-wrap">{asset.notes || "No notes provided."}</p>
            </div>
          </CardContent>
        </Card>
      )}
      {asset && 
        <DeleteEquipmentDialog // TODO: DeleteAssetDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDelete}
            equipmentName={asset.name} // TODO: assetName
        />
      }
    </PageContainer>
  );
}
