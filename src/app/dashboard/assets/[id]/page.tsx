import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Package,
  Calendar,
  MapPin,
  DollarSign,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";
import { AssetStatus } from "@prisma/client";
import Link from "next/link";

// This would be your actual data fetching function
async function getAsset(id: string) {
  // In a real app, you would use Prisma here
  // const asset = await prisma.asset.findUnique({ where: { assetId: id } });

  // Mock data for demonstration
  return {
    assetId: id,
    model: "Dell Latitude 5520",
    type: "EQUIPMENT",
    status: AssetStatus.AVAILABLE,
    location: "Warehouse A",
    purchaseDate: new Date("2023-01-15"),
    purchaseValue: 1200,
    serialNumber: "DL5520-12345",
    barcode: "123456789",
    warrantyExpiry: new Date("2026-01-15"),
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-12-01"),
  };
}

interface AssetDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AssetDetailPage({
  params,
}: AssetDetailPageProps) {
  const asset = await getAsset(params.id);

  if (!asset) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Asset not found</h2>
          <p className="text-muted-foreground">
            The asset you're looking for doesn't exist.
          </p>
          <Link href="/dashboard/assets">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assets
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: AssetStatus) => {
    const statusConfig = {
      [AssetStatus.AVAILABLE]: {
        color: "bg-green-100 text-green-800",
        label: "Available",
      },
      [AssetStatus.ASSIGNED]: {
        color: "bg-blue-100 text-blue-800",
        label: "Assigned",
      },
      [AssetStatus.IN_MAINTENANCE]: {
        color: "bg-orange-100 text-orange-800",
        label: "In Maintenance",
      },
      [AssetStatus.RETIRED]: {
        color: "bg-gray-100 text-gray-800",
        label: "Retired",
      },
      [AssetStatus.LOST]: { color: "bg-red-100 text-red-800", label: "Lost" },
    };
    const config = statusConfig[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/assets">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{asset.model}</h1>
            <p className="text-muted-foreground">Asset ID: {asset.assetId}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/assets/${asset.assetId}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Asset Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Asset Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Model
                </label>
                <p className="text-sm">{asset.model}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Type
                </label>
                <p className="text-sm">
                  <Badge variant="outline">{asset.type}</Badge>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <p className="text-sm">{getStatusBadge(asset.status)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Location
                </label>
                <p className="text-sm flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {asset.location}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Serial Number
                </label>
                <p className="text-sm font-mono">{asset.serialNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Barcode
                </label>
                <p className="text-sm font-mono">{asset.barcode}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Purchase Date
                </label>
                <p className="text-sm flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {asset.purchaseDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Purchase Value
                </label>
                <p className="text-sm font-medium">
                  ${asset.purchaseValue.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Warranty Expiry
                </label>
                <p className="text-sm flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {asset.warrantyExpiry?.toLocaleDateString() || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment History */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment History</CardTitle>
            <CardDescription>Recent assignments for this asset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No assignment history found</p>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance History */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance History</CardTitle>
            <CardDescription>Recent maintenance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No maintenance history found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
