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
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

// Mock data based on schema structure
const mockProducts = [
  {
    productId: "prod_001",
    name: "Dell XPS 13 Laptop",
    description:
      "13-inch premium laptop with Intel i7 processor, 16GB RAM, 512GB SSD",
    category: "Laptops",
    price: 1299.99,
    status: "AVAILABLE",
    stockQuantity: 25,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    productId: "prod_002",
    name: 'Samsung 27" 4K Monitor',
    description:
      "27-inch 4K Ultra HD monitor with HDR support and USB-C connectivity",
    category: "Monitors",
    price: 399.99,
    status: "AVAILABLE",
    stockQuantity: 15,
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    productId: "prod_003",
    name: "HP LaserJet Pro Printer",
    description:
      "Professional laser printer with wireless connectivity and duplex printing",
    category: "Printers",
    price: 299.99,
    status: "OUT_OF_STOCK",
    stockQuantity: 0,
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
  {
    productId: "prod_004",
    name: 'iPad Pro 12.9" Tablet',
    description:
      "12.9-inch iPad Pro with M2 chip, 256GB storage, and Apple Pencil support",
    category: "Tablets",
    price: 1099.99,
    status: "AVAILABLE",
    stockQuantity: 8,
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-02-10T10:00:00Z",
  },
  {
    productId: "prod_005",
    name: "iPhone 15 Pro",
    description:
      "Latest iPhone with A17 Pro chip, 128GB storage, and titanium design",
    category: "Phones",
    price: 999.99,
    status: "AVAILABLE",
    stockQuantity: 12,
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-02-15T10:00:00Z",
  },
  {
    productId: "prod_006",
    name: "Cisco Switch 2960",
    description: "24-port managed network switch with PoE support",
    category: "Networking",
    price: 799.99,
    status: "DISCONTINUED",
    stockQuantity: 3,
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Available
        </Badge>
      );
    case "OUT_OF_STOCK":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Out of Stock
        </Badge>
      );
    case "DISCONTINUED":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Discontinued
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getStockBadge = (quantity: number, status: string) => {
  if (status === "DISCONTINUED") {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-800">
        Discontinued
      </Badge>
    );
  }

  if (quantity === 0) {
    return <Badge variant="destructive">Out of Stock</Badge>;
  } else if (quantity <= 5) {
    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
        Low Stock
      </Badge>
    );
  } else if (quantity <= 15) {
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-800">
        In Stock
      </Badge>
    );
  } else {
    return (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Well Stocked
      </Badge>
    );
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage product catalog and inventory
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              All products in catalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockProducts.filter((product) => product.status === "AVAILABLE")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Ready for sale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockProducts.filter(
                  (product) => product.status === "OUT_OF_STOCK"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                mockProducts.reduce(
                  (total, product) =>
                    total + product.price * product.stockQuantity,
                  0
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground">Inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>
            Search and filter products by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, category, or product ID..."
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

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            Complete list of all products in the catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProducts.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell className="font-medium">
                      {product.productId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">
                          {product.stockQuantity}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          units
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(product.status)}
                        {getStockBadge(product.stockQuantity, product.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDate(product.createdAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            href={`/dashboard/products/${product.productId}`}
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
