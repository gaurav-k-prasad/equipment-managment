
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  LayoutDashboard,
  Truck,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
// useAuth is no longer needed as all items are visible
// import { useAuth } from "@/context/AuthContext"; 

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean; // This flag is no longer used for filtering
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/shipping", label: "Shipping Tracking", icon: Truck },
  { href: "/scan", label: "Scan Equipment", icon: ScanLine },
  { href: "/admin", label: "Admin Panel", icon: ShieldCheck, adminOnly: true }, // No longer functionally adminOnly
];

export function SidebarNav() {
  const pathname = usePathname();
  // const { isAdmin } = useAuth(); // No longer needed

  // All items are visible now
  // const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <nav className="flex flex-col gap-2 p-4 overflow-y-auto">
      {navItems.map((item) => ( // Iterate over navItems directly
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: pathname.startsWith(item.href) ? "default" : "ghost" }),
            "justify-start gap-2"
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
