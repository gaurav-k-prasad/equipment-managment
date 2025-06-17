import { Package } from "lucide-react";
import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const textSizeClass = size === "sm" ? "text-xl" : size === "md" ? "text-2xl" : "text-3xl";
  const iconSize = size === "sm" ? 20 : size === "md" ? 24 : 32;

  return (
    <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
      <Package size={iconSize} className="text-primary" />
      <h1 className={`font-headline font-bold ${textSizeClass}`}>EquipTrack</h1>
    </Link>
  );
}