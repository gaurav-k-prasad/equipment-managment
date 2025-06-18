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
  ArrowUpDown,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Package,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

// Mock data based on schema structure
const mockReturnRequests = [
  {
    returnId: "return_001",
    holderId: "holder_001",
    customerId: null,
    assetId: "asset_001",
    orderId: null,
    requestDate: "2024-03-15T10:00:00Z",
    returnStatus: "APPROVED",
    prepaidLabelGenerated: true,
    finalStatusConfirmed: false,
    reason: "Device no longer needed for current project",
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
    customer: null,
    order: null,
  },
  {
    returnId: "return_002",
    holderId: null,
    customerId: "customer_001",
    assetId: "asset_002",
    orderId: "order_001",
    requestDate: "2024-03-18T10:00:00Z",
    returnStatus: "PENDING",
    prepaidLabelGenerated: false,
    finalStatusConfirmed: false,
    reason: "Defective product upon arrival",
    createdAt: "2024-03-18T10:00:00Z",
    updatedAt: "2024-03-18T10:00:00Z",
    asset: {
      type: "Monitor",
      model: 'Samsung 27" 4K',
      serialNumber: "SMS27001",
    },
    holder: null,
    customer: {
      name: "Tech Solutions Inc",
      email: "support@techsolutions.com",
    },
    order: {
      orderId: "order_001",
      orderDate: "2024-03-10T10:00:00Z",
    },
  },
  {
    returnId: "return_003",
    holderId: "holder_002",
    customerId: null,
    assetId: "asset_003",
    orderId: null,
    requestDate: "2024-03-20T10:00:00Z",
    returnStatus: "COMPLETED",
    prepaidLabelGenerated: true,
    finalStatusConfirmed: true,
    reason: "Upgraded to newer model",
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-25T10:00:00Z",
    asset: {
      type: "Tablet",
      model: 'iPad Pro 12.9"',
      serialNumber: "IPADP001",
    },
    holder: {
      name: "Sarah Johnson",
      department: "Marketing",
      email: "sarah.johnson@company.com",
    },
    customer: null,
    order: null,
  },
  {
    returnId: "return_004",
    holderId: null,
    customerId: "customer_002",
    assetId: "asset_004",
    orderId: "order_002",
    requestDate: "2024-03-22T10:00:00Z",
    returnStatus: "REJECTED",
    prepaidLabelGenerated: false,
    finalStatusConfirmed: false,
    reason: "Changed mind about purchase",
    createdAt: "2024-03-22T10:00:00Z",
    updatedAt: "2024-03-23T10:00:00Z",
    asset: {
      type: "Phone",
      model: "iPhone 15 Pro",
      serialNumber: "IPH15P001",
    },
    holder: null,
    customer: {
      name: "Digital Innovations LLC",
      email: "orders@digitalinnovations.com",
    },
    order: {
      orderId: "order_002",
      orderDate: "2024-03-15T10:00:00Z",
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
    case "APPROVED":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getLabelBadge = (generated: boolean) => {
  return generated ? (
    <Badge variant="default" className="bg-green-100 text-green-800">
      ✓ Generated
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
      Pending
    </Badge>
  );
};

const getConfirmationBadge = (confirmed: boolean) => {
  return confirmed ? (
    <Badge variant="default" className="bg-green-100 text-green-800">
      ✓ Confirmed
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-gray-100 text-gray-800">
      Pending
    </Badge>
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export default function ReturnRequestPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Return Requests</h1>
          <p className="text-muted-foreground">
            Manage equipment return requests and processing
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/returnrequest/new">
            <Plus className="h-4 w-4 mr-2" />
            New Return Request
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockReturnRequests.length}
            </div>
            <p className="text-xs text-muted-foreground">All return requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockReturnRequests.filter(
                  (request) => request.returnStatus === "PENDING"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockReturnRequests.filter(
                  (request) => request.returnStatus === "APPROVED"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Processing returns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockReturnRequests.filter(
                  (request) => request.returnStatus === "COMPLETED"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully returned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Return Request Management</CardTitle>
          <CardDescription>
            Search and filter return requests by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by asset, requester, or return ID..."
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

      {/* Return Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Return Requests</CardTitle>
          <CardDescription>
            Complete list of all equipment return requests in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return ID</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Confirmation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReturnRequests.map((request) => (
                  <TableRow key={request.returnId}>
                    <TableCell className="font-medium">
                      {request.returnId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {request.asset.type} - {request.asset.model}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {request.asset.serialNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {request.holder ? (
                          <>
                            <div className="font-medium">
                              {request.holder.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {request.holder.department}
                            </div>
                          </>
                        ) : request.customer ? (
                          <>
                            <div className="font-medium">
                              {request.customer.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Customer
                            </div>
                          </>
                        ) : (
                          <div className="text-muted-foreground">Unknown</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(request.requestDate)}</TableCell>
                    <TableCell>
                      {getStatusBadge(request.returnStatus)}
                    </TableCell>
                    <TableCell>
                      {getLabelBadge(request.prepaidLabelGenerated)}
                    </TableCell>
                    <TableCell>
                      {getConfirmationBadge(request.finalStatusConfirmed)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            href={`/dashboard/returnrequest/${request.returnId}`}
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
