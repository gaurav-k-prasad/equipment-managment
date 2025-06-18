import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Activity,
  Package,
  Users,
  Wrench,
  Truck,
  ArrowUpDown,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

// Mock data based on schema structure
const mockStats = {
  totalAssets: 1247,
  availableAssets: 892,
  assignedAssets: 298,
  maintenanceAssets: 57,
  totalHolders: 156,
  activeAssignments: 245,
  pendingShipments: 23,
  returnRequests: 12,
  totalOrders: 89,
  totalCustomers: 67,
};

const mockRecentActivities = [
  {
    id: "1",
    type: "assignment",
    title: "Asset Assigned",
    description: "Laptop Dell XPS 13 assigned to John Smith",
    timestamp: "2 hours ago",
    status: "completed",
  },
  {
    id: "2",
    type: "maintenance",
    title: "Maintenance Scheduled",
    description: "Printer HP LaserJet scheduled for maintenance",
    timestamp: "4 hours ago",
    status: "pending",
  },
  {
    id: "3",
    type: "shipment",
    title: "Shipment Delivered",
    description: 'Monitor Samsung 27" delivered to Marketing Dept',
    timestamp: "6 hours ago",
    status: "completed",
  },
  {
    id: "4",
    type: "return",
    title: "Return Request",
    description: "Tablet iPad Pro return requested by Sarah Johnson",
    timestamp: "1 day ago",
    status: "pending",
  },
  {
    id: "5",
    type: "order",
    title: "New Order",
    description: "Order #ORD-2024-001 placed by Tech Solutions Inc",
    timestamp: "1 day ago",
    status: "pending",
  },
];

const mockAssetStatus = [
  { status: "Available", count: 892, percentage: 71.5, color: "bg-green-500" },
  { status: "Assigned", count: 298, percentage: 23.9, color: "bg-blue-500" },
  {
    status: "In Maintenance",
    count: 57,
    percentage: 4.6,
    color: "bg-yellow-500",
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "assignment":
      return <Users className="h-4 w-4" />;
    case "maintenance":
      return <Wrench className="h-4 w-4" />;
    case "shipment":
      return <Truck className="h-4 w-4" />;
    case "return":
      return <ArrowUpDown className="h-4 w-4" />;
    case "order":
      return <ShoppingCart className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your equipment management dashboard
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStats.totalAssets.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Assets
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStats.availableAssets.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                (mockStats.availableAssets / mockStats.totalAssets) *
                100
              ).toFixed(1)}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Assignments
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStats.activeAssignments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+8% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Actions
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStats.pendingShipments + mockStats.returnRequests}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockStats.pendingShipments} shipments, {mockStats.returnRequests}{" "}
              returns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Asset Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Asset Status Overview</CardTitle>
            <CardDescription>
              Distribution of assets by current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAssetStatus.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {item.count} assets
                    </span>
                    <span className="text-sm font-medium">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/assets">
                <Package className="h-4 w-4 mr-2" />
                Manage Assets
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/assignment">
                <Users className="h-4 w-4 mr-2" />
                Assign Assets
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/maintenances">
                <Wrench className="h-4 w-4 mr-2" />
                Schedule Maintenance
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/shipment">
                <Truck className="h-4 w-4 mr-2" />
                Track Shipments
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Latest updates and activities in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-4 border rounded-lg"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(activity.status)}
                  <span className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              View All Activities
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
