"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, UtensilsCrossed } from "lucide-react";

const tabs = [
  { label: "Dashboard", route: "/admin", icon: LayoutDashboard },
  { label: "Live Orders", route: "/admin/live-orders", icon: Store },
  { label: "Menu", route: "/admin/menu", icon: UtensilsCrossed },
];

export default function PageTabs() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-3">
      {tabs.map(({ label, route, icon: Icon }) => {
        const isActive = pathname === route;
        return (
          <Link
            key={route}
            href={route}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium font-body border transition
              ${isActive
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </div>
  );
}