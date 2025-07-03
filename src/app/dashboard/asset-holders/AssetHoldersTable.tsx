"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { DataTable } from "@/src/components/global/DataTable";
import { Badge } from "@/src/components/ui/badge";
import { Users, Mail, MapPin, Calendar } from "lucide-react";
import { HolderRole } from "@prisma/client";

interface AssetHolder {
  holderId: string;
  name: string;
  department: string;
  email: string;
  location: string;
  role: HolderRole;
  registrationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AssetHoldersTableProps {
  assetHolders: AssetHolder[];
}

export default function AssetHoldersTable({ assetHolders }: AssetHoldersTableProps) {
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
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
  ];

  return (
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
  );
} 