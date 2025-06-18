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
  Package,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

// Mock data based on schema structure
const mockMaintenances = [
  {
    maintenanceId: "maint_001",
    assetId: "asset_001",
    maintenanceDate: "2024-03-15T10:00:00Z",
    issueReported: "Screen flickering and battery not holding charge",
    resolution: "Replaced LCD panel and battery. Device working normally now.",
    warrantyCovered: true,
    reminderScheduled: "2024-09-15T10:00:00Z",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
    asset: {
      type: "Laptop",
      model: "Dell XPS 13",
      serialNumber: "DLXPS13001",
    },
  },
  {
    maintenanceId: "maint_002",
    assetId: "asset_002",
    maintenanceDate: "2024-03-10T10:00:00Z",
    issueReported: "Printer not responding to print jobs",
    resolution:
      "Cleaned print heads and updated firmware. Printer operational.",
    warrantyCovered: false,
    reminderScheduled: null,
    createdAt: "2024-03-10T10:00:00Z",
    updatedAt: "2024-03-10T10:00:00Z",
    asset: {
      type: "Printer",
      model: "HP LaserJet Pro",
      serialNumber: "HPLJP001",
    },
  },
  {
    maintenanceId: "maint_003",
    assetId: "asset_003",
    maintenanceDate: "2024-03-20T10:00:00Z",
    issueReported: "Tablet screen cracked and unresponsive touch",
    resolution:
      "Replaced screen assembly and digitizer. Device fully functional.",
    warrantyCovered: true,
    reminderScheduled: "2024-09-20T10:00:00Z",
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-20T10:00:00Z",
    asset: {
      type: "Tablet",
      model: 'iPad Pro 12.9"',
      serialNumber: "IPADP001",
    },
  },
  {
    maintenanceId: "maint_004",
    assetId: "asset_004",
    maintenanceDate: "2024-03-25T10:00:00Z",
    issueReported: "Monitor showing distorted colors and artifacts",
    resolution:
      "Replaced video cable and updated graphics drivers. Monitor working properly.",
    warrantyCovered: false,
    reminderScheduled: null,
    createdAt: "2024-03-25T10:00:00Z",
    updatedAt: "2024-03-25T10:00:00Z",
    asset: {
      type: "Monitor",
      model: 'Samsung 27" 4K',
      serialNumber: "SMS27001",
    },
  },
];

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export default function MaintenancesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Maintenance Records
          </h1>
          <p className="text-muted-foreground">
            Track equipment maintenance and repairs
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/maintenances/new">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Maintenance
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMaintenances.length}</div>
            <p className="text-xs text-muted-foreground">
              All maintenance records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Warranty Covered
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMaintenances.filter((maint) => maint.warrantyCovered).length}
            </div>
            <p className="text-xs text-muted-foreground">Under warranty</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Pocket</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockMaintenances.filter((maint) => !maint.warrantyCovered)
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Paid maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Scheduled Reminders
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockMaintenances.filter((maint) => maint.reminderScheduled)
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              With follow-up reminders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Management</CardTitle>
          <CardDescription>
            Search and filter maintenance records by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by asset, issue, or maintenance ID..."
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

      {/* Maintenance Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Maintenance Records</CardTitle>
          <CardDescription>
            Complete list of all equipment maintenance and repair records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Maintenance ID</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Maintenance Date</TableHead>
                  <TableHead>Warranty</TableHead>
                  <TableHead>Reminder</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMaintenances.map((maintenance) => (
                  <TableRow key={maintenance.maintenanceId}>
                    <TableCell className="font-medium">
                      {maintenance.maintenanceId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {maintenance.asset.type} - {maintenance.asset.model}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {maintenance.asset.serialNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="text-sm font-medium truncate">
                          {maintenance.issueReported}
                        </div>
                        {maintenance.resolution && (
                          <div className="text-xs text-muted-foreground truncate">
                            {maintenance.resolution}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(maintenance.maintenanceDate)}
                    </TableCell>
                    <TableCell>
                      {getWarrantyBadge(maintenance.warrantyCovered)}
                    </TableCell>
                    <TableCell>
                      {getReminderBadge(maintenance.reminderScheduled)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            href={`/dashboard/maintenances/${maintenance.maintenanceId}`}
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
