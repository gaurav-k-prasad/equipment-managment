
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package, // For Assets
  Users,   // For Asset Holders
  Truck,   // For Shipments
  Briefcase, // For Assignments (or CheckSquare, ClipboardList)
  Wrench,  // For Maintenances
  Undo2,   // For Return Requests
  ShieldCheck, // For Admin (if still needed, not in new structure image)
  ScanLine // For Scan (if still needed)
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  subItems?: NavItem[];
}

// Updated nav items based on the new structure
const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assets", label: "Assets", icon: Package },
  { href: "/asset-holders", label: "Asset Holders", icon: Users },
  { href: "/shipments", label: "Shipments", icon: Truck },
  { href: "/assignments", label: "Assignments", icon: Briefcase },
  { href: "/maintenances", label: "Maintenances", icon: Wrench },
  { href: "/return-requests", label: "Return Requests", icon: Undo2 },
  // { href: "/scan", label: "Scan Equipment", icon: ScanLine }, // Kept if desired, not in new structure image explicitly as top-level
  // { href: "/admin", label: "Admin Panel", icon: ShieldCheck }, // Kept if desired, not in new structure image
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-2"> {/* Reduced gap and padding for potentially more items */}
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: pathname.startsWith(item.href) ? "default" : "ghost", size: "sm" }),
            "justify-start gap-2 text-sm h-9" // Consistent sizing
          )}
        >
          <item.icon className="h-4 w-4" /> {/* Slightly smaller icons */}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
