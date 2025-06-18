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
import {
  Truck,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Package,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

// Mock data based on schema structure
const mockShipments = [
  {
    shipmentId: "ship_001",
    assetId: "asset_001",
    holderId: "holder_001",
    shipmentDate: "2024-03-15T10:00:00Z",
    deliveryStatus: "DELIVERED",
    carrier: "FedEx",
    trackingNumber: "FX123456789",
    courierApiResponse: { status: "delivered", location: "New York, NY" },
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-16T10:00:00Z",
    asset: {
      type: "Laptop",
      model: "Dell XPS 13",
      serialNumber: "DLXPS13001",
    },
    holder: {
      name: "John Smith",
      department: "IT",
      email: "john.smith@company.com",
    },
  },
  {
    shipmentId: "ship_002",
    assetId: "asset_002",
    holderId: "holder_002",
    shipmentDate: "2024-03-20T10:00:00Z",
    deliveryStatus: "IN_TRANSIT",
    carrier: "UPS",
    trackingNumber: "UP987654321",
    courierApiResponse: { status: "in_transit", location: "Chicago, IL" },
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-20T10:00:00Z",
    asset: {
      type: "Monitor",
      model: 'Samsung 27" 4K',
      serialNumber: "SMS27001",
    },
    holder: {
      name: "Sarah Johnson",
      department: "Marketing",
      email: "sarah.johnson@company.com",
    },
  },
  {
    shipmentId: "ship_003",
    assetId: "asset_003",
    holderId: "holder_003",
    shipmentDate: "2024-03-18T10:00:00Z",
    deliveryStatus: "PENDING",
    carrier: "DHL",
    trackingNumber: "DH456789123",
    courierApiResponse: null,
    createdAt: "2024-03-18T10:00:00Z",
    updatedAt: "2024-03-18T10:00:00Z",
    asset: {
      type: "Tablet",
      model: 'iPad Pro 12.9"',
      serialNumber: "IPADP001",
    },
    holder: {
      name: "Mike Davis",
      department: "Sales",
      email: "mike.davis@company.com",
    },
  },
  {
    shipmentId: "ship_004",
    assetId: "asset_004",
    holderId: "holder_004",
    shipmentDate: "2024-03-22T10:00:00Z",
    deliveryStatus: "FAILED",
    carrier: "USPS",
    trackingNumber: "US789123456",
    courierApiResponse: { status: "failed", reason: "Address not found" },
    createdAt: "2024-03-22T10:00:00Z",
    updatedAt: "2024-03-23T10:00:00Z",
    asset: {
      type: "Phone",
      model: "iPhone 15 Pro",
      serialNumber: "IPH15P001",
    },
    holder: {
      name: "Lisa Wilson",
      department: "Executive",
      email: "lisa.wilson@company.com",
    },
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case "IN_TRANSIT":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Truck className="h-3 w-3 mr-1" />
          In Transit
        </Badge>
      );
    case "DELIVERED":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Delivered
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      );
    case "RETURNED":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          Returned
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export default function ShipmentPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
          <p className="text-muted-foreground">
            Track equipment shipments and deliveries
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/shipment/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Shipment
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Shipments
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockShipments.length}</div>
            <p className="text-xs text-muted-foreground">All time shipments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockShipments.filter(
                  (shipment) => shipment.deliveryStatus === "IN_TRANSIT"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Currently shipping</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockShipments.filter(
                  (shipment) => shipment.deliveryStatus === "DELIVERED"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockShipments.filter(
                  (shipment) => shipment.deliveryStatus === "FAILED"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Delivery issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Shipment Management</CardTitle>
          <CardDescription>
            Search and filter shipments by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by tracking number, asset, or shipment ID..."
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

      {/* Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Shipments</CardTitle>
          <CardDescription>
            Complete list of all equipment shipments in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Shipment Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockShipments.map((shipment) => (
                  <TableRow key={shipment.shipmentId}>
                    <TableCell className="font-medium">
                      {shipment.shipmentId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {shipment.asset.type} - {shipment.asset.model}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {shipment.asset.serialNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {shipment.holder.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {shipment.holder.department}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Truck className="h-3 w-3 text-muted-foreground" />
                        {shipment.carrier}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">
                        {shipment.trackingNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(shipment.deliveryStatus)}
                    </TableCell>
                    <TableCell>{formatDate(shipment.shipmentDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            href={`/dashboard/shipment/${shipment.shipmentId}`}
                          >
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
