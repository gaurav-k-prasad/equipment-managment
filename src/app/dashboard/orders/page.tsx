"use client";

import { useEffect, useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";

const mockOrders = [
  {
    id: "ORD-001",
    customer: "Alice Johnson",
    date: "2025-06-19",
    total: "$1200",
    status: "Shipped",
  },
  {
    id: "ORD-002",
    customer: "Bob Smith",
    date: "2025-06-18",
    total: "$890",
    status: "Pending",
  },
  {
    id: "ORD-003",
    customer: "Charlie Lee",
    date: "2025-06-17",
    total: "$450",
    status: "Processing",
  },
  {
    id: "ORD-004",
    customer: "Sarah Connor",
    date: "2025-06-16",
    total: "$670",
    status: "Cancelled",
  },
];

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "shipped":
      return <Badge className="bg-green-100 text-green-800">Shipped</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case "processing":
      return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    return mockOrders.filter(
      (order) =>
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-primary" />
            Orders
          </h1>
          <p className="text-muted-foreground">
            View and manage all equipment orders.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <Input
          type="text"
          placeholder="Search by customer or order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-auto border">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">{order.total}</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-6 text-center text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
