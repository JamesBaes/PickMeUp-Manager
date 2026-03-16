"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const statusStyles: Record<string, string> = {
  pending:   "bg-yellow-50 text-yellow-600 border-yellow-200",
  paid:      "bg-blue-50 text-blue-600 border-blue-200",
  preparing: "bg-orange-50 text-orange-600 border-orange-200",
  ready:     "bg-green-50 text-green-600 border-green-200",
  picked_up: "bg-gray-100 text-gray-500 border-gray-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
};

const ALL_STATUSES = ["pending", "paid", "preparing", "ready", "picked_up", "cancelled"];
const PAGE_SIZE = 5;

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  total_cents: number;
  status: string;
}

interface OrdersTableProps {
  orders: Order[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <h2 className="text-2xl font-heading text-gray-800 font-semibold mr-2">Incoming Orders</h2>
        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setVisibleCount(PAGE_SIZE); }}
            className="text-xs font-body border border-gray-200 rounded-lg px-3 py-1.5 text-gray-500 outline-none appearance-none pr-6 bg-white cursor-pointer"
          >
            <option value="all">Status: All</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {/* Search */}
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
          className="text-xs font-body border border-gray-200 rounded-lg px-3 py-1.5 text-gray-500 outline-none focus:border-gray-300 w-32"
        />
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-400 border-b border-gray-100">
            <th className="pb-2 w-8"></th>
            <th className="pb-2 font-body text-left font-medium">Order ID</th>
            <th className="pb-2 font-body text-left font-medium">Created</th>
            <th className="pb-2 font-body text-left font-medium">Customer</th>
            <th className="pb-2 font-body text-left font-medium">Total</th>
            <th className="pb-2 font-body text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 text-center text-sm font-body text-gray-400">No orders found</td>
            </tr>
          ) : (
            visible.map((order) => (
              <tr key={order.id} className="border-b font-body border-gray-50 hover:bg-gray-50 transition">
                <td className="py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(order.id)}
                    onChange={() => toggleSelect(order.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="py-3 font-body text-gray-500 text-xs">{order.id.slice(0, 8).toUpperCase()}</td>
                <td className="py-3 font-body text-gray-400 text-xs">
                  {new Date(order.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  {" "}
                  {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </td>
                <td className="py-3 font-body text-gray-600">{order.customer_name}</td>
                <td className="py-3 font-body text-gray-600">${(order.total_cents / 100).toFixed(2)}</td>
                <td className="py-3 ">
                  <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-body font-medium capitalize border ${statusStyles[order.status] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
                    {order.status?.replace("_", " ")}
                    <ChevronDown size={10} />
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* More button */}
      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="text-xs border border-gray-200 font-body rounded-lg px-6 py-1.5 text-gray-500 hover:bg-gray-50 transition"
          >
            More...
          </button>
        </div>
      )}
    </div>
  );
}