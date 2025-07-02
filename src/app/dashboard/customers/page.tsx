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
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";

// Mock data based on schema structure
const mockCustomers = [
  {
    customerId: "customer_001",
    name: "Tech Solutions Inc",
    email: "support@techsolutions.com",
    phone: "+1-555-0123",
    address: "123 Tech Street, San Francisco, CA 94105",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    orders: [
      {
        orderId: "order_001",
        orderDate: "2024-03-10T10:00:00Z",
        totalAmount: 1299.99,
      },
    ],
    returnRequests: [
      {
        returnId: "return_002",
        requestDate: "2024-03-18T10:00:00Z",
        returnStatus: "PENDING",
      },
    ],
  },
  {
    customerId: "customer_002",
    name: "Digital Innovations LLC",
    email: "orders@digitalinnovations.com",
    phone: "+1-555-0456",
    address: "456 Innovation Ave, Austin, TX 73301",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
    orders: [
      {
        orderId: "order_002",
        orderDate: "2024-03-15T10:00:00Z",
        totalAmount: 899.99,
      },
    ],
    returnRequests: [
      {
        returnId: "return_004",
        requestDate: "2024-03-22T10:00:00Z",
        returnStatus: "REJECTED",
      },
    ],
  },
  {
    customerId: "customer_003",
    name: "Global Systems Corp",
    email: "procurement@globalsystems.com",
    phone: "+1-555-0789",
    address: "789 Corporate Blvd, New York, NY 10001",
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-02-15T10:00:00Z",
    orders: [
      {
        orderId: "order_003",
        orderDate: "2024-03-20T10:00:00Z",
        totalAmount: 2499.99,
      },
      {
        orderId: "order_004",
        orderDate: "2024-03-25T10:00:00Z",
        totalAmount: 1599.99,
      },
    ],
    returnRequests: [],
  },
  {
    customerId: "customer_004",
    name: "Startup Ventures Ltd",
    email: "hello@startupventures.com",
    phone: "+1-555-0321",
    address: "321 Startup Lane, Seattle, WA 98101",
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
    orders: [],
    returnRequests: [],
  },
  {
    customerId: "customer_005",
    name: "Enterprise Solutions Group",
    email: "sales@enterprisesolutions.com",
    phone: "+1-555-0654",
    address: "654 Enterprise Way, Chicago, IL 60601",
    createdAt: "2024-03-10T10:00:00Z",
    updatedAt: "2024-03-10T10:00:00Z",
    orders: [
      {
        orderId: "order_005",
        orderDate: "2024-03-28T10:00:00Z",
        totalAmount: 3499.99,
      },
    ],
    returnRequests: [],
  },
];

const getTotalOrders = (orders: any[]) => {
  return orders.length;
};

const getTotalSpent = (orders: any[]) => {
  return orders.reduce(
    (total, order) => total + parseFloat(order.totalAmount),
    0
  );
};

const getActiveReturns = (returnRequests: any[]) => {
  return returnRequests.filter(
    (req) => req.returnStatus === "PENDING" || req.returnStatus === "APPROVED"
  ).length;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage customer information and relationships
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/customers/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCustomers.length}</div>
            <p className="text-xs text-muted-foreground">
              All registered customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCustomers.reduce(
                (total, customer) => total + getTotalOrders(customer.orders),
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                mockCustomers.reduce(
                  (total, customer) => total + getTotalSpent(customer.orders),
                  0
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Returns
            </CardTitle>
            <ArrowUpDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCustomers.reduce(
                (total, customer) =>
                  total + getActiveReturns(customer.returnRequests),
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Pending returns</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>
            Search and filter customers by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or company..."
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

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>
            Complete list of all customers in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Active Returns</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCustomers.map((customer) => (
                  <TableRow key={customer.customerId}>
                    <TableCell className="font-medium">
                      {customer.customerId}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{customer.name}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {customer.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 max-w-xs">
                        <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate">
                          {customer.address}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">
                          {getTotalOrders(customer.orders)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatCurrency(getTotalSpent(customer.orders))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">
                          {getActiveReturns(customer.returnRequests)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDate(customer.createdAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            href={`/dashboard/customers/${customer.customerId}`}
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
