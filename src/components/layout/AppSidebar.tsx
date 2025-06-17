
"use client";

import { Logo } from "@/components/ui/Logo";
import { SidebarNav } from "./SidebarNav";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AppSidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-card fixed h-full">
      <div className="flex items-center h-16 px-6 border-b">
        <Logo />
      </div>
      {/* Wrap ScrollArea in a div that handles flex sizing */}
      <div className="flex-1 relative">
        <ScrollArea className="absolute inset-0">
          <SidebarNav />
        </ScrollArea>
      </div>
      <div className="p-4 mt-auto border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 EquipTrack</p>
      </div>
    </aside>
  );
}
