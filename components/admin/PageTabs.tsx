"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, UtensilsCrossed } from "lucide-react";
import { useRestaurant } from "@/context/RestaurantContext";

const allTabs = [
  { label: "Dashboard", route: "/admin", icon: LayoutDashboard, adminOnly: false },
  { label: "Live Orders", route: "/admin/live-orders", icon: Store, adminOnly: false },
  { label: "Menu", route: "/admin/menu", icon: UtensilsCrossed, adminOnly: true },
];

export default function PageTabs() {
  const pathname = usePathname();
  const { isAdmin } = useRestaurant();

  const tabs = allTabs.filter((t) => !t.adminOnly || isAdmin);

  return (
    <div className="flex items-center gap-4">
      {tabs.map(({ label, route, icon: Icon }) => {
        const isActive = pathname === route;
        return (
          <Link
            key={route}
            href={route}
            className={`flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-medium font-body border transition
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