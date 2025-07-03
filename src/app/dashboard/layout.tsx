"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Package,
  Users,
  Wrench,
  Truck,
  ArrowUpDown,
  ShoppingCart,
  Activity,
  Home,
  LogOut,
  User,
  ClipboardList,
  UserCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Assets", href: "/dashboard/assets", icon: Package },
  { name: "Asset Holders", href: "/dashboard/asset-holders", icon: Users },
  { name: "Assignments", href: "/dashboard/assignment", icon: Users },
  { name: "Maintenance", href: "/dashboard/maintenances", icon: Wrench },
  { name: "Shipments", href: "/dashboard/shipment", icon: Truck },
  { name: "Return Requests", href: "/dashboard/returnrequest", icon: ArrowUpDown },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Products", href: "/dashboard/products", icon: ShoppingCart },
  { name: "Orders", href: "/dashboard/orders", icon: ClipboardList },
  { name: "User Profiles", href: "/dashboard/users", icon: UserCircle },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-800 tracking-tight">
              Equipment Manager
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-1 text-gray-500" />
              <span>{session?.user?.name || "User"}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSignOut}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-md p-4 hidden md:block">
          <nav className="space-y-2 mt-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white px-6 py-8 rounded-tl-3xl shadow-inner min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
