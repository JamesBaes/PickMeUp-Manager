"use client";

import { useMemo, useState } from "react";
import type { StaffDashboardData } from "@/lib/staff/dashboard";

export default function StaffDashboardContent({
  dashboardData,
}: {
  dashboardData: StaffDashboardData;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIncomingOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return dashboardData.incomingOrders;
    }

    return dashboardData.incomingOrders.filter((order) => {
      const searchableValue = `${order.id} ${order.created} ${order.customer} ${order.total} ${order.status}`.toLowerCase();
      return searchableValue.includes(normalizedSearch);
    });
  }, [dashboardData.incomingOrders, searchTerm]);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-dashboard-border bg-dashboard-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
          <h1 className="font-heading text-3xl sm:text-5xl text-slate-700 leading-tight">Incoming Orders</h1>

          <div className="grid grid-cols-1 sm:flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <PillButton label={dashboardData.dateLabel} className="w-full sm:w-auto" />
            <PillButton label={dashboardData.statusLabel} className="w-full sm:w-auto" />

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={dashboardData.searchPlaceholder}
              className="h-9 rounded-xl border border-dashboard-border bg-dashboard-card text-slate-500 font-body px-4 text-sm w-full sm:w-40"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-120 overflow-y-auto rounded-lg">
          <table className="w-full min-w-170 text-slate-600 text-sm sm:text-base">
            <thead>
              <tr className="border-b border-dashboard-border sticky top-0 bg-dashboard-card z-10">
                <th className="py-3 text-left font-body font-semibold">Order Id</th>
                <th className="py-3 text-left font-body font-semibold">Created</th>
                <th className="py-3 text-left font-body font-semibold">Customer</th>
                <th className="py-3 text-left font-body font-semibold">Total</th>
                <th className="py-3 text-left font-body font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncomingOrders.map((order, index) => (
                <tr key={`${order.id}-${index}`} className="border-b border-dashboard-border">
                  <td className="py-3 font-body whitespace-nowrap">{order.id}</td>
                  <td className="py-3 font-body whitespace-nowrap">{order.created}</td>
                  <td className="py-3 font-body whitespace-nowrap">{order.customer}</td>
                  <td className="py-3 font-body whitespace-nowrap">{order.total}</td>
                  <td className="py-3">
                    <div className="h-9 w-28 sm:w-32 rounded-xl bg-dashboard-success-soft text-dashboard-success flex items-center justify-center px-4 font-body whitespace-nowrap">
                      <span>{order.status}</span>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredIncomingOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500 font-body">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-dashboard-border bg-dashboard-card p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-72">
        <div>
          <div className="flex items-center justify-between sm:justify-start gap-3 mb-4">
            <h2 className="font-heading text-3xl sm:text-5xl text-slate-700 leading-tight">Top Selling</h2>
            <PillButton label="7 Days" compact />
          </div>

          <ul className="space-y-2">
            {dashboardData.topSellingItems.map((item) => (
              <li key={item.rank} className="grid grid-cols-[2rem_1fr_auto] sm:grid-cols-[2rem_12rem_4rem] text-slate-600 font-body text-lg sm:text-2xl">
                <span>{item.rank}</span>
                <span>{item.name}</span>
                <span>{item.sold}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center lg:items-start">
          <h2 className="font-heading text-3xl sm:text-5xl text-slate-700 leading-tight mb-4">Daily Accepted Orders</h2>
          <div
            className="h-36 w-36 sm:h-44 sm:w-44 rounded-full grid place-items-center"
            style={{
              background: `conic-gradient(var(--color-dashboard-ring) ${dashboardData.acceptedOrdersPercent}%, var(--color-dashboard-ring-track) 0)`,
            }}
          >
            <div className="h-24 w-24 sm:h-30 sm:w-30 rounded-full bg-dashboard-card grid place-items-center border border-dashboard-border font-heading text-xl text-slate-700">
              {dashboardData.acceptedOrdersPercent}%
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PillButton({
  label,
  className = "",
  compact = false,
}: {
  label: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <button
      className={`rounded-xl border border-dashboard-border bg-dashboard-card text-slate-400 font-body ${
        compact ? "h-8 px-4 text-sm" : "h-9 px-6 text-sm"
      } ${className}`}
    >
      {label}
    </button>
  );
}
