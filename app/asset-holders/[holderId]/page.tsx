
"use client";
import { PageContainer } from "@/components/shared/PageContainer";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { useAssetHolder } from "@/hooks/useAssetHolder"; // Example hook

export default function AssetHolderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const holderId = typeof params.holderId === "string" ? params.holderId : "";
  // const { assetHolder, loading, error } = useAssetHolder(holderId); // Example usage

  // Mock data for now
  const assetHolder = { id: holderId, name: "Engineering Department", type: "Department", contactInfo: "eng@example.com", notes: "Primary users of specialized lab equipment." };
  const loading = false;

  if (loading) {
    return <PageContainer title="Loading Asset Holder..."><p>Loading...</p></PageContainer>;
  }
  if (!assetHolder) {
    return <PageContainer title="Asset Holder Not Found"><p>Could not find asset holder details.</p></PageContainer>;
  }

  return (
    <PageContainer 
        title={assetHolder.name} 
        description={`Details for asset holder ID: ${holderId}`}
        actions={
            <div className="flex gap-2">
                <Button onClick={() => router.push(`/asset-holders/create-or-update?id=${holderId}`)}><Edit className="mr-2 h-4 w-4"/>Edit</Button>
                <Button variant="destructive" onClick={() => alert("Delete action placeholder")}><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
            </div>
        }
    >
        <Button onClick={() => router.back()} variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      <Card className="shadow-lg">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="font-headline text-2xl">{assetHolder.name}</CardTitle>
                    <CardDescription>Type: <Badge variant="outline">{assetHolder.type}</Badge></CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Contact Information</p>
                <p>{assetHolder.contactInfo || "N/A"}</p>
            </div>
             <div className="md:col-span-2 space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="whitespace-pre-wrap">{assetHolder.notes || "No notes provided."}</p>
            </div>
            <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-semibold mb-2">Assigned Assets (Placeholder)</h3>
                <div className="border rounded-md p-4 text-center text-muted-foreground">
                    List of assets assigned to this holder would appear here.
                </div>
            </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
