
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { EquipmentForm, type EquipmentFormValues } from "@/components/equipment/EquipmentForm"; // TODO: AssetForm
import { useEquipment } from "@/hooks/useEquipment"; // TODO: useAssets
import type { Equipment } from "@/types"; // TODO: Asset type
import { Timestamp } from "firebase/firestore";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function CreateOrUpdateAssetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assetId = searchParams.get("id");

  const { getEquipmentById, addEquipment, updateEquipment, loading: equipmentLoading } = useEquipment(); // TODO: useAssets

  const [asset, setAsset] = React.useState<Equipment | null>(null); // TODO: Asset type
  const [isLoading, setIsLoading] = React.useState(!!assetId); // Only load if assetId exists
  const [formIsSubmitting, setFormIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (assetId) {
      const fetchAsset = async () => {
        setIsLoading(true);
        const data = await getEquipmentById(assetId); // TODO: getAssetById
        setAsset(data);
        setIsLoading(false);
      };
      fetchAsset();
    } else {
      setIsLoading(false);
    }
  }, [assetId, getEquipmentById]);

  const handleFormSubmit = async (data: EquipmentFormValues) => { // TODO: AssetFormValues
    setFormIsSubmitting(true);
    const assetData = {
      ...data,
      purchaseDate: data.purchaseDate ? Timestamp.fromDate(data.purchaseDate) : null,
      warrantyExpiryDate: data.warrantyExpiryDate ? Timestamp.fromDate(data.warrantyExpiryDate) : null,
    };

    try {
      if (assetId && asset) {
        await updateEquipment(assetId, assetData); // TODO: updateAsset
      } else {
        await addEquipment(assetData as Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>); // TODO: addAsset
      }
      router.push("/assets"); // Redirect to assets list page after successful submission
    } catch (error) {
      console.error("Error submitting asset form:", error);
      // Toast notification for error can be added here
    } finally {
      setFormIsSubmitting(false);
    }
  };

  const defaultFormValues = assetId && asset
    ? {
        ...asset,
        purchaseDate: asset.purchaseDate?.toDate(),
        warrantyExpiryDate: asset.warrantyExpiryDate?.toDate(),
      }
    : undefined;
  
  const pageTitle = assetId ? "Edit Asset" : "Create New Asset";
  const pageDescription = assetId ? "Update the details of the existing asset." : "Fill in the details for the new asset.";


  if (isLoading) {
    return (
      <PageContainer title="Loading Asset Form...">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={48} />
        </div>
      </PageContainer>
    );
  }
  
  if (assetId && !asset && !isLoading) {
     return (
      <PageContainer title="Asset Not Found">
        <p>The asset you are trying to edit does not exist.</p>
        <Button onClick={() => router.push("/assets")} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assets List
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={pageTitle} description={pageDescription}>
        <Button onClick={() => router.back()} variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">{pageTitle}</CardTitle>
            <CardDescription>{pageDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <EquipmentForm // TODO: AssetForm
            onSubmit={handleFormSubmit}
            defaultValues={defaultFormValues}
            isLoading={formIsSubmitting || equipmentLoading}
            submitButtonText={assetId ? "Update Asset" : "Create Asset"}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
