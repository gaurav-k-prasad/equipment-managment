"use client";

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
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

const mockAssignments = [
  {
    assignmentId: "assign_001",
    assetId: "asset_001",
    holderId: "holder_001",
    assignedDate: "2024-01-15T10:00:00Z",
    returnDate: null,
    status: "ACTIVE",
    acknowledgment: true,
    asset: {
      type: "Laptop",
      model: "Dell XPS 13",
      serialNumber: "DLXPS13001",
    },
    holder: {
      name: "John Smith",
      department: "IT",
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
    asset: {
      type: "Monitor",
      model: 'Samsung 27" 4K',
      serialNumber: "SMS27001",
    },
    holder: {
      name: "Sarah Johnson",
      department: "Marketing",
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
    asset: {
      type: "Tablet",
      model: 'iPad Pro 12.9"',
      serialNumber: "IPADP001",
    },
    holder: {
      name: "Mike Davis",
      department: "Sales",
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
    asset: {
      type: "Phone",
      model: "iPhone 15 Pro",
      serialNumber: "IPH15P001",
    },
    holder: {
      name: "Lisa Wilson",
      department: "Executive",
    },
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge className="bg-green-100 text-green-800 text-sm">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    case "RETURNED":
      return (
        <Badge className="bg-blue-100 text-blue-800 text-sm">Returned</Badge>
      );
    case "EXPIRED":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 text-sm">
          <Clock className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    default:
      return <Badge className="text-sm">{status}</Badge>;
  }
};

const getAcknowledgmentBadge = (ack: boolean) => {
  return ack ? (
    <Badge className="bg-green-100 text-green-800 text-sm">✓ Acknowledged</Badge>
  ) : (
    <Badge className="bg-yellow-100 text-yellow-800 text-sm">Pending</Badge>
  );
};

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

export default function AssignmentPage() {
  const newAssignments = mockAssignments.slice(0, 2); // Simulated subset for 'New'

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Asset Assignments</h1>
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
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAssignments.length}</div>
            <p className="text-xs text-muted-foreground">All Assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAssignments.filter((a) => a.status === "ACTIVE").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently assigned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Returned</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAssignments.filter((a) => a.status === "RETURNED").length}
            </div>
            <p className="text-xs text-muted-foreground">Returned assets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAssignments.filter((a) => a.status === "EXPIRED").length}
            </div>
            <p className="text-xs text-muted-foreground">Overdue returns</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Management</CardTitle>
          <CardDescription>
            Search and filter assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by asset or holder..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* New Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>New Assignments</CardTitle>
          <CardDescription>Recently assigned assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-[300px] border rounded-md">
            <Table className="min-w-[900px]">
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Holder</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ack</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newAssignments.map((a) => (
                  <TableRow key={a.assignmentId}>
                    <TableCell>{a.assignmentId}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {a.asset.type} - {a.asset.model}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {a.asset.serialNumber}
                      </div>
                    </TableCell>
                    <TableCell>{a.holder.name}</TableCell>
                    <TableCell>{formatDate(a.assignedDate)}</TableCell>
                    <TableCell>{getStatusBadge(a.status)}</TableCell>
                    <TableCell>{getAcknowledgmentBadge(a.acknowledgment)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* All Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>Complete list of records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-[400px] border rounded-md">
            <Table className="min-w-[1000px]">
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Holder</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ack</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAssignments.map((a) => (
                  <TableRow key={a.assignmentId}>
                    <TableCell>{a.assignmentId}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {a.asset.type} - {a.asset.model}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {a.asset.serialNumber}
                      </div>
                    </TableCell>
                    <TableCell>{a.holder.name}</TableCell>
                    <TableCell>{formatDate(a.assignedDate)}</TableCell>
                    <TableCell>{getStatusBadge(a.status)}</TableCell>
                    <TableCell>{getAcknowledgmentBadge(a.acknowledgment)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button asChild size="icon" variant="ghost">
                          <Link href={`/dashboard/assignment/${a.assignmentId}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
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
