"use client";

import { useMemo, useState } from "react";
import {
  type StaffOrderAction,
  type StaffOrderCard,
  getInitialOrders,
  loadOrdersFromStorage,
  saveOrdersToStorage,
} from "@/lib/staff/orders-mock-store";

// MOCK DATA MODE:
// This page uses localStorage + mock data for UI/interaction testing.
//
// REAL DB FLOW (UNCOMMENT WHEN READY):
// 1) Fetch incoming/accepted orders from DB in a server action.
// 2) On "Accept", update the order status to accepted.
// 3) On "Complete Order" or "In Progress", persist prep state in DB.
// 4) On "Ready", set order status to completed and render it on /staff/completed.

export default function StaffLiveOrdersPage() {
  const [orders, setOrders] = useState<StaffOrderCard[]>(() => {
    if (typeof window === "undefined") {
      return getInitialOrders();
    }

    return loadOrdersFromStorage();
  });

  const incomingOrders = useMemo(
    () => orders.filter((order) => order.stage === "incoming"),
    [orders]
  );

  const acceptedOrders = useMemo(
    () => orders.filter((order) => order.stage === "accepted"),
    [orders]
  );

  const updateOrders = (updater: (previousOrders: StaffOrderCard[]) => StaffOrderCard[]) => {
    setOrders((previousOrders) => {
      const updatedOrders = updater(previousOrders);
      saveOrdersToStorage(updatedOrders);
      return updatedOrders;
    });
  };

  const handleAccept = (orderId: string) => {
    updateOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              stage: "accepted",
            }
          : order
      )
    );
  };

  const handleActionSelect = (orderId: string, action: StaffOrderAction) => {
    updateOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              action,
            }
          : order
      )
    );
  };

  const handleReady = (orderId: string) => {
    updateOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              stage: "completed",
              action: "none",
              pickupStatus: "pending",
            }
          : order
      )
    );
  };

  return (
    <section className="rounded-xl border border-dashboard-border bg-dashboard-card p-4">
      <h1 className="font-heading text-5xl text-slate-700 mb-3">Live Orders</h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl border border-dashboard-border p-3">
          <h2 className="font-body text-4xl text-slate-700 mb-2">Incoming</h2>
          <div className="space-y-3">
            {incomingOrders.length === 0 ? (
              <EmptyState label="No incoming orders" />
            ) : (
              incomingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  actionArea={
                    <div className="flex items-end justify-between gap-3 mt-4">
                      <OrderTypeBadge label={order.orderType} />
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-body text-accent">Auto-Reject in {order.autoRejectAt}</span>
                        <button
                          onClick={() => handleAccept(order.id)}
                          className="h-10 min-w-28 px-5 rounded-xl bg-dashboard-ring text-white font-body"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  }
                />
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-dashboard-border p-3">
          <h2 className="font-body text-4xl text-slate-700 mb-2">Accepted</h2>
          <div className="space-y-3">
            {acceptedOrders.length === 0 ? (
              <EmptyState label="No accepted orders" />
            ) : (
              acceptedOrders.map((order) => {
                const canMarkReady = order.action !== "none";

                return (
                  <OrderCard
                    key={order.id}
                    order={order}
                    actionArea={
                      <div className="flex items-end justify-between gap-3 mt-4">
                        <OrderTypeBadge label={order.orderType} />

                        <div className="flex items-center gap-3 flex-wrap justify-end">
                          <button
                            onClick={() => handleActionSelect(order.id, "complete-order")}
                            className={`h-10 min-w-32 px-4 rounded-xl font-body text-white ${
                              order.action === "complete-order" ? "bg-dashboard-ring" : "bg-slate-400"
                            }`}
                          >
                            Complete Order
                          </button>

                          <button
                            onClick={() => handleActionSelect(order.id, "in-progress")}
                            className={`h-10 min-w-28 px-4 rounded-xl font-body text-white ${
                              order.action === "in-progress" ? "bg-accent" : "bg-slate-400"
                            }`}
                          >
                            In Progress
                          </button>

                          {canMarkReady && (
                            <button
                              onClick={() => handleReady(order.id)}
                              className="h-10 min-w-24 px-4 rounded-xl font-body text-white bg-dashboard-success"
                            >
                              Ready
                            </button>
                          )}
                        </div>
                      </div>
                    }
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function OrderCard({
  order,
  actionArea,
}: {
  order: StaffOrderCard;
  actionArea: React.ReactNode;
}) {
  return (
    <article className="rounded-xl border border-dashboard-border bg-dashboard-card p-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
        <div>
          <p className="text-5xl font-heading text-slate-700 leading-none">{order.orderNumber}</p>
          <p className="text-4xl font-body text-slate-700 mt-1">{order.customer}</p>
          <p className="text-sm font-body text-slate-600 mt-3">{order.note}</p>
        </div>

        <ul className="text-slate-600 font-body min-w-40">
          {order.items.map((item, index) => (
            <li key={`${order.id}-item-${index}`} className="leading-8">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {actionArea}
    </article>
  );
}

function OrderTypeBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center h-10 px-4 rounded-xl bg-dashboard-panel text-amber-700 font-body">
      {label}
    </span>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashboard-border bg-dashboard-panel p-6 text-slate-500 font-body text-center">
      {label}
    </div>
  );
}
