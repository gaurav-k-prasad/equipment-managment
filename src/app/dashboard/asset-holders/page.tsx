import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Users, Mail, Phone, MapPin, Calendar, Package } from "lucide-react";
import { PageHeader } from "@/src/components/global/PageHeader";
import { DataTable } from "@/src/components/global/DataTable";
import { StatsCards } from "@/src/components/global/StatsCards";
import { HolderRole } from "@prisma/client";

// This would be your actual data fetching function
async function getAssetHolders() {
  // In a real app, you would use Prisma here
  // const assetHolders = await prisma.assetHolder.findMany();

  // Mock data for demonstration
  return [
    {
      holderId: "HOL001",
      name: "John Doe",
      department: "IT",
      email: "john.doe@company.com",
      location: "New York",
      role: HolderRole.EMPLOYEE,
      registrationDate: new Date("2023-01-15"),
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-12-01"),
    },
    {
      holderId: "HOL002",
      name: "Jane Smith",
      department: "HR",
      email: "jane.smith@company.com",
      location: "Los Angeles",
      role: HolderRole.MANAGER,
      registrationDate: new Date("2023-02-20"),
      createdAt: new Date("2023-02-20"),
      updatedAt: new Date("2023-12-01"),
    },
    {
      holderId: "HOL003",
      name: "Bob Johnson",
      department: "Operations",
      email: "bob.johnson@company.com",
      location: "Chicago",
      role: HolderRole.EMPLOYEE,
      registrationDate: new Date("2023-03-10"),
      createdAt: new Date("2023-03-10"),
      updatedAt: new Date("2023-12-01"),
    },
  ];
}

export default async function AssetHoldersPage() {
  const assetHolders = await getAssetHolders();

  const stats = [
    {
      title: "Total Holders",
      value: assetHolders.length,
      icon: Users,
    },
    {
      title: "IT Department",
      value: assetHolders.filter((h) => h.department === "IT").length,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "HR Department",
      value: assetHolders.filter((h) => h.department === "HR").length,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Operations",
      value: assetHolders.filter((h) => h.department === "Operations").length,
      icon: Users,
      color: "text-orange-600",
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (value: string) => (
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3 text-muted-foreground" />
          {value}
        </div>
      ),
    },
    {
      key: "department",
      label: "Department",
      render: (value: string) => {
        const departmentColors = {
          IT: "bg-blue-100 text-blue-800",
          HR: "bg-green-100 text-green-800",
          Finance: "bg-purple-100 text-purple-800",
          Operations: "bg-orange-100 text-orange-800",
          Sales: "bg-red-100 text-red-800",
          Marketing: "bg-pink-100 text-pink-800",
        };
        return (
          <Badge
            className={
              departmentColors[value as keyof typeof departmentColors] ||
              "bg-gray-100 text-gray-800"
            }
          >
            {value}
          </Badge>
        );
      },
    },
    {
      key: "location",
      label: "Location",
      render: (value: string) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          {value || "Not specified"}
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (value: HolderRole) => {
        const roleConfig = {
          [HolderRole.EMPLOYEE]: {
            color: "bg-gray-100 text-gray-800",
            label: "Employee",
          },
          [HolderRole.MANAGER]: {
            color: "bg-blue-100 text-blue-800",
            label: "Manager",
          },
          [HolderRole.ADMIN]: {
            color: "bg-red-100 text-red-800",
            label: "Admin",
          },
          [HolderRole.DEPARTMENT]: {
            color: "bg-green-100 text-green-800",
            label: "Department",
          },
        };
        const config = roleConfig[value];
        return <Badge className={config.color}>{config.label}</Badge>;
      },
    },
    {
      key: "registrationDate",
      label: "Registration Date",
      render: (value: Date) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          {value.toLocaleDateString()}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Holders"
        description="Manage users who can be assigned equipment"
        actionLabel="Add Asset Holder"
        actionHref="/dashboard/asset-holders/new"
      />

      <StatsCards stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle>Asset Holders ({assetHolders.length})</CardTitle>
          <CardDescription>
            Complete list of all registered asset holders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={assetHolders}
            onView={(holder) => {
              // This would navigate to the holder detail page
              console.log("View holder:", holder);
            }}
            onEdit={(holder) => {
              // This would navigate to the edit page
              console.log("Edit holder:", holder);
            }}
            onDelete={(holder) => {
              // This would show a confirmation dialog
              console.log("Delete holder:", holder);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
