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
  Wrench,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  User,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";

// ✅ Mock Data
const mockMaintenances = [
  {
    maintenanceId: "maint_001",
    assetId: "asset_001",
    maintenanceDate: "2024-03-15T10:00:00Z",
    issueReported: "Screen flickering and battery not holding charge",
    resolution: "Replaced LCD panel and battery. Device working normally now.",
    warrantyCovered: true,
    reminderScheduled: "2024-09-15T10:00:00Z",
    asset: {
      type: "Laptop",
      model: "Dell XPS 13",
      serialNumber: "DLXPS13001",
    },
    companyDetails: {
      department: "Engineering",
      employee: "John Doe",
      purchaseDate: "2023-01-05T00:00:00Z",
      warrantyExpiry: "2026-01-05T00:00:00Z",
      vendor: "Dell India Pvt Ltd",
      location: "Hyderabad Office",
    },
  },
  {
    maintenanceId: "maint_002",
    assetId: "asset_002",
    maintenanceDate: "2024-04-10T10:00:00Z",
    issueReported: "Overheating and slow performance",
    resolution: "Cleaned fan and applied thermal paste. Upgraded RAM.",
    warrantyCovered: false,
    reminderScheduled: null,
    asset: {
      type: "Laptop",
      model: "Lenovo ThinkPad T14",
      serialNumber: "LTPD001122",
    },
    companyDetails: {
      department: "HR",
      employee: "Meera K",
      purchaseDate: "2022-05-12T00:00:00Z",
      warrantyExpiry: "2024-05-12T00:00:00Z",
      vendor: "Lenovo Services",
      location: "Mumbai Office",
    },
  },
  {
    maintenanceId: "maint_003",
    assetId: "asset_003",
    maintenanceDate: "2024-05-02T10:00:00Z",
    issueReported: "Wi-Fi not connecting",
    resolution: "Replaced wireless adapter and updated drivers.",
    warrantyCovered: true,
    reminderScheduled: "2024-11-02T10:00:00Z",
    asset: {
      type: "Laptop",
      model: "HP EliteBook 840",
      serialNumber: "HPELITE001",
    },
    companyDetails: {
      department: "Sales",
      employee: "Ravi Verma",
      purchaseDate: "2023-06-20T00:00:00Z",
      warrantyExpiry: "2026-06-20T00:00:00Z",
      vendor: "HP India",
      location: "Chennai Office",
    },
  },
];

// ✅ Helper Functions
const getWarrantyBadge = (covered: boolean) => {
  return covered ? (
    <Badge variant="default" className="bg-green-100 text-green-800">
      <CheckCircle className="h-3 w-3 mr-1" />
      Warranty
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-red-100 text-red-800">
      Out of Pocket
    </Badge>
  );
};

const getReminderBadge = (scheduled: string | null) => {
  if (!scheduled) return <Badge variant="outline">No Reminder</Badge>;

  const reminderDate = new Date(scheduled);
  const now = new Date();
  const daysUntil = Math.ceil(
    (reminderDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntil < 0) {
    return (
      <Badge variant="destructive">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Overdue
      </Badge>
    );
  } else if (daysUntil <= 30) {
    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
        <Clock className="h-3 w-3 mr-1" />
        Soon
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-800">
        Scheduled
      </Badge>
    );
  }
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// ✅ Component
export default function MaintenancesPage() {
  return (
    <TooltipProvider>
      <div className="space-y-8 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              Maintenance 
            </h1>
            <p className="text-muted-foreground text-sm">
              Overview of equipment servicing & warranty schedules
            </p>
          </div>
          <Button asChild className="bg-primary text-white">
            <Link href="/dashboard/maintenances/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Maintenance
            </Link>
          </Button>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm">Total Records</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockMaintenances.length}</div>
              <p className="text-xs text-muted-foreground">As of today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm">Warranty Covered</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {mockMaintenances.filter((m) => m.warrantyCovered).length}
              </div>
              <p className="text-xs text-muted-foreground">Covered Devices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm">Out of Pocket</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {mockMaintenances.filter((m) => !m.warrantyCovered).length}
              </div>
              <p className="text-xs text-muted-foreground">Paid Maintenances</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm">Scheduled Reminders</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {mockMaintenances.filter((m) => m.reminderScheduled).length}
              </div>
              <p className="text-xs text-muted-foreground">Upcoming Checks</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Maintenance Records</CardTitle>
            <CardDescription>
              All maintenance history for assigned equipment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Warranty</TableHead>
                    <TableHead>Reminder</TableHead>
                    <TableHead>Dept</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMaintenances.map((m) => (
                    <TableRow key={m.maintenanceId}>
                      <TableCell>{m.maintenanceId}</TableCell>
                      <TableCell>
                        {m.asset.type} - {m.asset.model}
                        <div className="text-xs text-muted-foreground">
                          SN: {m.asset.serialNumber}
                        </div>
                      </TableCell>
                      <TableCell>{m.issueReported}</TableCell>
                      <TableCell>{formatDate(m.maintenanceDate)}</TableCell>
                      <TableCell>
                        {getWarrantyBadge(m.warrantyCovered)}
                        <div className="text-xs text-muted-foreground">
                          Exp: {formatDate(m.companyDetails.warrantyExpiry)}
                        </div>
                      </TableCell>
                      <TableCell>{getReminderBadge(m.reminderScheduled)}</TableCell>
                      <TableCell>{m.companyDetails.department}</TableCell>
                      <TableCell>{m.companyDetails.employee}</TableCell>
                      <TableCell>{m.companyDetails.vendor}</TableCell>
                      <TableCell>{m.companyDetails.location}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button asChild variant="ghost" size="sm">
                                <Link href={`/dashboard/maintenances/${m.maintenanceId}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
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
    </TooltipProvider>
  );
}
