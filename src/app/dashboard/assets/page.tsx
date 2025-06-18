import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Package, Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

// Mock data based on schema structure
const mockAssets = [
  {
    assetId: "asset_001",
    type: "Laptop",
    model: "Dell XPS 13",
    serialNumber: "DLXPS13001",
    barcode: "123456789",
    status: "AVAILABLE",
    location: "IT Department",
    purchaseDate: "2024-01-15",
    warrantyExpiry: "2027-01-15",
    ownerHolderId: null,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    assetId: "asset_002",
    type: "Monitor",
    model: 'Samsung 27" 4K',
    serialNumber: "SMS27001",
    barcode: "123456790",
    status: "ASSIGNED",
    location: "Marketing Department",
    purchaseDate: "2024-02-01",
    warrantyExpiry: "2027-02-01",
    ownerHolderId: "holder_001",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
  {
    assetId: "asset_003",
    type: "Printer",
    model: "HP LaserJet Pro",
    serialNumber: "HPLJP001",
    barcode: "123456791",
    status: "IN_MAINTENANCE",
    location: "Office Services",
    purchaseDate: "2023-12-01",
    warrantyExpiry: "2026-12-01",
    ownerHolderId: null,
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
  {
    assetId: "asset_004",
    type: "Tablet",
    model: 'iPad Pro 12.9"',
    serialNumber: "IPADP001",
    barcode: "123456792",
    status: "AVAILABLE",
    location: "Sales Department",
    purchaseDate: "2024-01-20",
    warrantyExpiry: "2027-01-20",
    ownerHolderId: null,
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    assetId: "asset_005",
    type: "Phone",
    model: "iPhone 15 Pro",
    serialNumber: "IPH15P001",
    barcode: "123456793",
    status: "ASSIGNED",
    location: "Executive Office",
    purchaseDate: "2024-02-15",
    warrantyExpiry: "2027-02-15",
    ownerHolderId: "holder_002",
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-02-15T10:00:00Z",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Available
        </Badge>
      );
    case "ASSIGNED":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Assigned
        </Badge>
      );
    case "IN_MAINTENANCE":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          In Maintenance
        </Badge>
      );
    case "RETIRED":
      return <Badge variant="destructive">Retired</Badge>;
    case "LOST":
      return <Badge variant="destructive">Lost</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">
            Manage and track all equipment assets
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/assets/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAssets.length}</div>
            <p className="text-xs text-muted-foreground">
              All equipment in inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockAssets.filter((asset) => asset.status === "AVAILABLE")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAssets.filter((asset) => asset.status === "ASSIGNED").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              In Maintenance
            </CardTitle>
            <Package className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockAssets.filter((asset) => asset.status === "IN_MAINTENANCE")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Under repair</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Management</CardTitle>
          <CardDescription>
            Search and filter assets by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets by type, model, or serial number..."
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Assets</CardTitle>
          <CardDescription>
            Complete list of all equipment assets in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAssets.map((asset) => (
                  <TableRow key={asset.assetId}>
                    <TableCell className="font-medium">
                      {asset.assetId}
                    </TableCell>
                    <TableCell>{asset.type}</TableCell>
                    <TableCell>{asset.model}</TableCell>
                    <TableCell>{asset.serialNumber}</TableCell>
                    <TableCell>{getStatusBadge(asset.status)}</TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>{formatDate(asset.purchaseDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/assets/${asset.assetId}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
