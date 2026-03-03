"use client";

import { useMemo, useState } from "react";
import {
  type StaffOrderCard,
  getInitialOrders,
  loadOrdersFromStorage,
  saveOrdersToStorage,
} from "@/lib/staff/orders-mock-store";

// MOCK DATA MODE:
// Completed orders are read from localStorage state updated by /staff/orders interactions.
//
// REAL DB FLOW (UNCOMMENT WHEN READY):
// 1) Fetch orders with status="completed".
// 2) Persist pickup status updates when "Picked Up" is clicked.

export default function StaffCompletedOrdersPage() {
  const [orders, setOrders] = useState<StaffOrderCard[]>(() => {
    if (typeof window === "undefined") {
      return getInitialOrders();
    }

    return loadOrdersFromStorage();
  });

  const completedOrders = useMemo(
    () => orders.filter((order) => order.stage === "completed"),
    [orders]
  );

  const handlePickedUp = (orderId: string) => {
    setOrders((previousOrders) => {
      const updatedOrders: StaffOrderCard[] = previousOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              pickupStatus: "picked-up" as const,
            }
          : order
      );

      saveOrdersToStorage(updatedOrders);
      return updatedOrders;
    });
  };

  return (
    <section className="rounded-xl border border-dashboard-border bg-dashboard-card p-4">
      <h1 className="font-heading text-5xl text-slate-700 mb-3">Completed Orders</h1>

      <div className="space-y-4">
        {completedOrders.length === 0 ? (
          <div className="rounded-xl border border-dashboard-border bg-dashboard-panel p-6 text-slate-500 font-body text-center">
            No completed orders yet. Mark an accepted order as Ready in Live Orders.
          </div>
        ) : (
          completedOrders.map((order) => {
            const isPickedUp = order.pickupStatus === "picked-up";

            return (
              <article
                key={order.id}
                className={`rounded-xl border p-4 ${
                  isPickedUp
                    ? "border-dashboard-success bg-dashboard-success-soft"
                    : "border-dashboard-border bg-dashboard-card"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start">
                  <div>
                    <p className="text-5xl font-heading text-slate-700 leading-none">{order.orderNumber}</p>
                    <p className="text-4xl font-body text-slate-700 mt-1">{order.customer}</p>
                    <p className="text-sm font-body text-slate-600 mt-3">{order.note}</p>

                    <ul className="mt-3 text-slate-600 font-body">
                      {order.items.map((item, index) => (
                        <li key={`${order.id}-completed-item-${index}`} className="leading-7">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-dashboard-border bg-dashboard-panel p-4 min-w-52">
                    <h2 className="text-xl font-heading text-slate-700">Pickup Status</h2>
                    <p className="text-sm text-slate-600 font-body mt-2 mb-4">
                      {isPickedUp ? "Picked Up" : "Awaiting pickup"}
                    </p>

                    <button
                      onClick={() => handlePickedUp(order.id)}
                      disabled={isPickedUp}
                      className={`h-10 w-full rounded-xl font-body text-white ${
                        isPickedUp ? "bg-dashboard-success opacity-80" : "bg-dashboard-success"
                      }`}
                    >
                      Picked Up
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
