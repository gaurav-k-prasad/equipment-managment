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
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Package,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

// Mock data based on schema structure
const mockAssignments = [
  {
    assignmentId: "assign_001",
    assetId: "asset_001",
    holderId: "holder_001",
    assignedDate: "2024-01-15T10:00:00Z",
    returnDate: null,
    status: "ACTIVE",
    acknowledgment: true,
    chainOfCustodyDoc: "doc_001.pdf",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
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
    assignmentId: "assign_002",
    assetId: "asset_002",
    holderId: "holder_002",
    assignedDate: "2024-02-01T10:00:00Z",
    returnDate: null,
    status: "ACTIVE",
    acknowledgment: false,
    chainOfCustodyDoc: null,
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
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
    assignmentId: "assign_003",
    assetId: "asset_003",
    holderId: "holder_003",
    assignedDate: "2024-01-20T10:00:00Z",
    returnDate: "2024-03-15T10:00:00Z",
    status: "RETURNED",
    acknowledgment: true,
    chainOfCustodyDoc: "doc_003.pdf",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
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
    assignmentId: "assign_004",
    assetId: "asset_004",
    holderId: "holder_004",
    assignedDate: "2024-02-15T10:00:00Z",
    returnDate: null,
    status: "EXPIRED",
    acknowledgment: true,
    chainOfCustodyDoc: "doc_004.pdf",
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-02-15T10:00:00Z",
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
    case "ACTIVE":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    case "RETURNED":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Returned
        </Badge>
      );
    case "EXPIRED":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getAcknowledgmentBadge = (acknowledged: boolean) => {
  return acknowledged ? (
    <Badge variant="default" className="bg-green-100 text-green-800">
      ✓ Acknowledged
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
      Pending
    </Badge>
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export default function AssignmentPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Asset Assignments
          </h1>
          <p className="text-muted-foreground">
            Manage equipment assignments to users
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/assignment/new">
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assignments
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAssignments.length}</div>
            <p className="text-xs text-muted-foreground">
              All time assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockAssignments.filter(
                  (assignment) => assignment.status === "ACTIVE"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Currently assigned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returned</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockAssignments.filter(
                  (assignment) => assignment.status === "RETURNED"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully returned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockAssignments.filter(
                  (assignment) => assignment.status === "EXPIRED"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Overdue returns</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Management</CardTitle>
          <CardDescription>
            Search and filter assignments by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by asset, holder, or assignment ID..."
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

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>
            Complete list of all asset assignments in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment ID</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Holder</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Acknowledgment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAssignments.map((assignment) => (
                  <TableRow key={assignment.assignmentId}>
                    <TableCell className="font-medium">
                      {assignment.assignmentId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {assignment.asset.type} - {assignment.asset.model}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {assignment.asset.serialNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {assignment.holder.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {assignment.holder.department}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(assignment.assignedDate)}</TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell>
                      {getAcknowledgmentBadge(assignment.acknowledgment)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            href={`/dashboard/assignment/${assignment.assignmentId}`}
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
