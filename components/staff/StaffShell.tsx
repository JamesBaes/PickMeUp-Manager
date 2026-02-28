"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface StaffShellProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const topNavItems: NavItem[] = [
  { label: "Dashboard", href: "/staff", icon: <GridIcon /> },
  { label: "Live Orders", href: "/staff/orders", icon: <OrdersIcon /> },
  { label: "Inventory", href: "/staff/menu", icon: <InventoryIcon /> },
];

const sideNavItems: Omit<NavItem, "label">[] = [
  { href: "/staff", icon: <GridIcon /> },
  { href: "/staff/orders", icon: <OrdersIcon /> },
  { href: "/staff/menu", icon: <InventoryIcon /> },
];

export default function StaffShell({ children }: StaffShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-dashboard-page flex">
      <aside className="w-20 bg-white border-r border-dashboard-border flex flex-col items-center py-8">
        <div className="mb-10 h-10 w-10 rounded-full bg-accent flex items-center justify-center text-white font-heading font-semibold">
          P
        </div>

        <nav className="flex flex-col items-center gap-4 mt-6">
          {sideNavItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-dashboard-success-soft text-dashboard-success"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {item.icon}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          className="mt-auto h-10 w-10 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100"
        >
          <LogoutIcon />
        </Link>
      </aside>

      <main className="flex-1 p-5">
        <div className="rounded-xl border border-dashboard-border bg-dashboard-panel p-4">
          <div className="mb-4 flex gap-4">
            {topNavItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`h-14 min-w-44 rounded-xl border px-6 flex items-center gap-3 font-body text-lg ${
                    isActive
                      ? "bg-dashboard-success-soft border-dashboard-success-soft text-slate-700"
                      : "bg-dashboard-card border-dashboard-border text-slate-600"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16" />
      <path d="M7 3h10v4H7z" />
      <rect x="4" y="9" width="16" height="12" rx="2" />
      <path d="M8 13h8" />
    </svg>
  );
}

function InventoryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v18" />
      <path d="M3 8l9-5 9 5-9 5-9-5z" />
      <path d="M3 16l9 5 9-5" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 3h-7v4" />
      <path d="M14 17v4h7V3" />
    </svg>
  );
}