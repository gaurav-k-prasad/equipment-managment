"use client";

import { useAssets } from "@/src/hooks/useAssets";
import { useAssetHolders } from "@/src/hooks/useAssetHolders";
import { useOrders } from "@/src/hooks/useOrders";
import { useProducts } from "@/src/hooks/useProducts";
import { useAssignments } from "@/src/hooks/useAssignments";
import { useMaintenance } from "@/src/hooks/useMaintenance";
import { useShipments } from "@/src/hooks/useShipments";
import { useReturnRequests } from "@/src/hooks/useReturnRequests";
import { useCustomers } from "@/src/hooks/useCustomers";
import { useEffect } from "react";
import { StatsCards } from "@/src/components/global/StatsCards";
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
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/src/components/ui/table";
import Link from "next/link";

// Placeholder/mock data for AnalyticsReport, ApiIntegration, and User
const analyticsReports = [
  { reportId: "r1", reportType: "Compliance", complianceFlag: false, generatedDate: new Date(), details: {} },
  { reportId: "r2", reportType: "Loss/Damage", complianceFlag: true, generatedDate: new Date(), details: {} },
];
const apiIntegrations = [
  { integrationId: "a1", systemName: "SAP", apiType: "REST", status: "ACTIVE", lastSyncTime: new Date() },
  { integrationId: "a2", systemName: "Legacy", apiType: "SOAP", status: "INACTIVE", lastSyncTime: new Date() },
];

export default function DashboardPage() {
  // Hooks for all entities
  const { assets, fetchAssets, loading: loadingAssets } = useAssets();
  const { assetHolders, fetchAssetHolders, loading: loadingHolders } = useAssetHolders();
  const { orders, fetchOrders, loading: loadingOrders } = useOrders();
  const { products, fetchProducts, loading: loadingProducts } = useProducts();
  const { assignments, fetchAssignments, loading: loadingAssignments } = useAssignments();
  const { maintenances, fetchMaintenances, loading: loadingMaintenances } = useMaintenance();
  const { shipments, fetchShipments, loading: loadingShipments } = useShipments();
  const { returnRequests, fetchReturnRequests, loading: loadingReturns } = useReturnRequests();
  const { customers, fetchCustomers, loading: loadingCustomers } = useCustomers();

  // Mock users only for stats count
  const users = [
    { id: "u1", name: "Admin User", email: "admin@example.com", role: "ADMIN" },
    { id: "u2", name: "Jane Doe", email: "jane@example.com", role: "USER" },
  ];

  useEffect(() => {
    fetchAssets();
    fetchAssetHolders();
    fetchOrders();
    fetchProducts();
    fetchAssignments();
    fetchMaintenances();
    fetchShipments();
    fetchReturnRequests();
    fetchCustomers();
    // eslint-disable-next-line
  }, []);

  // Stats for the dashboard (expanded)
  const stats = [
    { title: "Total Assets", value: loadingAssets ? "..." : assets.length, link: "/dashboard/assets" },
    { title: "Asset Holders", value: loadingHolders ? "..." : assetHolders.length, link: "/dashboard/asset-holders" },
    { title: "Shipments", value: loadingShipments ? "..." : shipments.length, link: "/dashboard/shipment" },
    { title: "Assignments", value: loadingAssignments ? "..." : assignments.length, link: "/dashboard/assignment" },
    { title: "Maintenances", value: loadingMaintenances ? "..." : maintenances.length, link: "/dashboard/maintenances" },
    { title: "Return Requests", value: loadingReturns ? "..." : returnRequests.length, link: "/dashboard/returnrequest" },
    { title: "Analytics Reports", value: analyticsReports.length, link: "/dashboard/analytics" },
    { title: "API Integrations", value: apiIntegrations.length, link: "/dashboard/integrations" },
    { title: "Customers", value: loadingCustomers ? "..." : customers.length, link: "/dashboard/customers" },
    { title: "Products", value: loadingProducts ? "..." : products.length, link: "/dashboard/products" },
    { title: "Orders", value: loadingOrders ? "..." : orders.length, link: "/dashboard/orders" },
    { title: "Users", value: users.length, link: "/dashboard/users" },
  ];

  // Recent activities (combine latest from assignments, maintenances, shipments, returns, orders)
  const recentActivities = [
    ...assignments.slice(0, 2).map((a) => ({
      id: a.assignmentId,
      type: "assignment",
      title: "Asset Assigned",
      description: `Asset ${a.assetId} assigned to Holder ${a.holderId}`,
      timestamp: a.assignedDate ? new Date(a.assignedDate).toLocaleString() : "-",
      status: a.status,
    })),
    ...maintenances.slice(0, 2).map((m) => ({
      id: m.maintenanceId,
      type: "maintenance",
      title: "Maintenance Scheduled",
      description: `Asset ${m.assetId} maintenance: ${m.issueReported}`,
      timestamp: m.maintenanceDate ? new Date(m.maintenanceDate).toLocaleString() : "-",
      status: m.resolution ? "completed" : "pending",
    })),
    ...shipments.slice(0, 2).map((s) => ({
      id: s.shipmentId,
      type: "shipment",
      title: "Shipment",
      description: `Asset ${s.assetId} shipped to Holder ${s.holderId}`,
      timestamp: s.shipmentDate ? new Date(s.shipmentDate).toLocaleString() : "-",
      status: s.deliveryStatus,
    })),
    ...returnRequests.slice(0, 2).map((r) => ({
      id: r.returnId,
      type: "return",
      title: "Return Request",
      description: `Asset ${r.assetId} return requested by Holder ${r.holderId}`,
      timestamp: r.requestDate ? new Date(r.requestDate).toLocaleString() : "-",
      status: r.returnStatus,
    })),
    ...orders.slice(0, 2).map((o) => ({
      id: o.orderId,
      type: "order",
      title: "Order",
      description: `Order ${o.orderId} placed by Customer ${o.customerId}`,
      timestamp: o.orderDate ? new Date(o.orderDate).toLocaleString() : "-",
      status: o.orderStatus,
    })),
  ].slice(0, 5);

  // Users (show first 3 asset holders)
  const displayedUsers = assetHolders.slice(0, 3);

  // Recent orders (show first 3 orders)
  const recentOrders = orders.slice(0, 3);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "assignment": return <Users className="h-4 w-4" />;
      case "maintenance": return <Wrench className="h-4 w-4" />;
      case "shipment": return <Truck className="h-4 w-4" />;
      case "return": return <ArrowUpDown className="h-4 w-4" />;
      case "order": return <ShoppingCart className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "shipped":
      case "delivered":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" /> {status}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" /> {status}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your equipment management dashboard
          </p>
        </div>
        <Button variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" /> Generate Report
        </Button>
      </div>

      {/* Expanded Stats Grid with links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.link} className="block">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-sm text-muted-foreground mt-2">{stat.title}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Health/Status Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>Monitor your API integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              {apiIntegrations.map((integration) => (
                <li key={integration.integrationId} className="flex items-center justify-between py-2">
                  <span>{integration.systemName} ({integration.apiType})</span>
                  <Badge variant={integration.status === "ACTIVE" ? "default" : "destructive"}>
                    {integration.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compliance & Analytics</CardTitle>
            <CardDescription>Latest compliance and analytics reports</CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              {analyticsReports.map((report) => (
                <li key={report.reportId} className="flex items-center justify-between py-2">
                  <span>{report.reportType}</span>
                  <Badge variant={report.complianceFlag ? "default" : "destructive"}>
                    {report.complianceFlag ? "Compliant" : "Non-Compliant"}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Latest updates and activities in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(activity.status)}
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
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

      {/* Users */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage your team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedUsers.map((user) => (
              <Card key={user.holderId} className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-medium">{user.name}</h3>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-blue-500">{user.role}</p>
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Track the latest orders placed</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.customer?.name || order.customerId}</TableCell>
                  <TableCell>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>{order.totalAmount}</TableCell>
                  <TableCell>{getStatusBadge(order.orderStatus)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
