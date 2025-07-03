import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { StatsCards } from "@/src/components/global/StatsCards";
import { PageHeader } from "@/src/components/global/PageHeader";
import { Users } from "lucide-react";
import { HolderRole } from "@prisma/client";
import AssetHoldersTable from "./AssetHoldersTable";

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Holders"
        description="Manage users who can be assigned equipment"
        actionLabel="Add Asset Holder"
        actionHref="/dashboard/asset-holders/new"
      />

      <StatsCards stats={stats} />

      <AssetHoldersTable assetHolders={assetHolders} />
    </div>
  );
}
