"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";

const dummyUsers = [
  {
    id: "1234",
    name: "Divya Guruvelli",
    email: "divya@example.com",
    role: "USER",
  },
  {
    id: "5678",
    name: "Admin User",
    email: "admin@example.com",
    role: "ADMIN",
  },
  {
    id: "9012",
    name: "Charlie Guest",
    email: "charlie@example.com",
    role: "USER",
  },
];

const getRoleBadge = (role: string) => {
  switch (role.toUpperCase()) {
    case "ADMIN":
      return <Badge className="bg-red-100 text-red-700">Admin</Badge>;
    case "USER":
      return <Badge className="bg-blue-100 text-blue-700">User</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"ALL" | "ADMIN" | "USER">("ALL");

  const filteredUsers = useMemo(() => {
    return dummyUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        filterRole === "ALL" || user.role.toUpperCase() === filterRole;

      return matchesSearch && matchesRole;
    });
  }, [searchTerm, filterRole]);

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Profiles</h1>
        <p className="text-gray-500 mt-1">
          Manage users, roles, and access permissions.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex gap-2">
          <Button
            variant={filterRole === "ALL" ? "default" : "outline"}
            onClick={() => setFilterRole("ALL")}
          >
            All
          </Button>
          <Button
            variant={filterRole === "ADMIN" ? "default" : "outline"}
            onClick={() => setFilterRole("ADMIN")}
          >
            Admin
          </Button>
          <Button
            variant={filterRole === "USER" ? "default" : "outline"}
            onClick={() => setFilterRole("USER")}
          >
            User
          </Button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/users/${user.id}`}
                        className="text-white bg-blue-600 hover:bg-black-700 px-4 py-2 text-xs rounded-md transition"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
