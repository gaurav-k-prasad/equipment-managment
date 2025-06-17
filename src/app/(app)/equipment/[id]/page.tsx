
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useEquipment } from "@/hooks/useEquipment";
import type { Equipment } from "@/types";
import { EquipmentForm, type EquipmentFormValues } from "@/components/equipment/EquipmentForm";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
// import { useAuth } from "@/context/AuthContext"; // No longer needed
import { DeleteEquipmentDialog } from "@/components/equipment/DeleteEquipmentDialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function EquipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const { getEquipmentById, updateEquipment, deleteEquipment } = useEquipment();
  // const { isAdmin } = useAuth(); // No longer needed

  const [equipment, setEquipment] = React.useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formIsLoading, setFormIsLoading] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      const fetchDetails = async () => {
        setIsLoading(true);
        const data = await getEquipmentById(id);
        setEquipment(data);
        setIsLoading(false);
      };
      fetchDetails();
    }
  }, [id, getEquipmentById]);

  const handleFormSubmit = async (data: EquipmentFormValues) => {
    if (!equipment) return;
    setFormIsLoading(true);
    const equipmentDataToUpdate = {
      ...data,
      purchaseDate: data.purchaseDate ? Timestamp.fromDate(data.purchaseDate) : null,
      warrantyExpiryDate: data.warrantyExpiryDate ? Timestamp.fromDate(data.warrantyExpiryDate) : null,
    };
    await updateEquipment(equipment.id, equipmentDataToUpdate);
    const updatedEquipment = await getEquipmentById(id); // Refetch after update
    setEquipment(updatedEquipment);
    setFormIsLoading(false);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!equipment) return;
    await deleteEquipment(equipment.id);
    setIsDeleteDialogOpen(false);
    router.push("/dashboard");
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
      <PageContainer title="Loading Equipment...">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={48} />
        </div>
      </PageContainer>
    );
  }

  if (!equipment) {
    return (
      <PageContainer title="Equipment Not Found">
        <p>The equipment item you are looking for does not exist or could not be loaded.</p>
        <Button onClick={() => router.push("/dashboard")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </PageContainer>
    );
  }
  
  const defaultFormValues = {
    ...equipment,
    purchaseDate: equipment.purchaseDate?.toDate(),
    warrantyExpiryDate: equipment.warrantyExpiryDate?.toDate(),
  };

  return (
    <PageContainer
      title={isEditing ? `Editing: ${equipment.name}` : equipment.name}
      description={isEditing ? "Update the equipment details below." : `Details for ${equipment.serialNumber}`}
      actions={
        // Edit and Delete buttons are now always visible when not editing
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

      {isEditing ? ( // Removed isAdmin check for editing form
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Edit Equipment Form</CardTitle>
          </CardHeader>
          <CardContent>
            <EquipmentForm
              onSubmit={handleFormSubmit}
              defaultValues={defaultFormValues}
              isLoading={formIsLoading}
              submitButtonText="Update Equipment"
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
                <CardTitle className="font-headline text-2xl">{equipment.name}</CardTitle>
                <CardDescription>Serial Number: {equipment.serialNumber}</CardDescription>
              </div>
              <Badge variant={getStatusBadgeVariant(equipment.status)} className="text-sm px-3 py-1">{equipment.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {equipment.imageUrl && (
              <div className="md:col-span-2 relative w-full h-64 rounded-md overflow-hidden border">
                 <Image src={equipment.imageUrl} alt={equipment.name} layout="fill" objectFit="contain" data-ai-hint="product photo"/>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <p>{equipment.category}</p>
            </div>
             <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Purchase Date</p>
              <p>{formatDate(equipment.purchaseDate)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Warranty Expiry Date</p>
              <p>{formatDate(equipment.warrantyExpiryDate)}</p>
            </div>
             <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
              <p>{equipment.assignedTo || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p>{equipment.location || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Tracking Number</p>
              <p>{equipment.trackingNumber || "N/A"}</p>
            </div>
             <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Tracking Status</p>
              <p>{equipment.trackingStatus || "N/A"}</p>
            </div>
            <div className="md:col-span-2 space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="whitespace-pre-wrap">{equipment.notes || "No notes provided."}</p>
            </div>
          </CardContent>
        </Card>
      )}
      {equipment && 
        <DeleteEquipmentDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDelete}
            equipmentName={equipment.name}
        />
      }
    </PageContainer>
  );
}
