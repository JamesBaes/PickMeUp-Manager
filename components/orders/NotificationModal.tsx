"use client";

import { useRouter } from "next/navigation";
import { useOrders } from "@/context/OrdersContext";

export default function NotificationModal() {
  const router = useRouter();
  const { currentNotification, queue, acceptOrder, rejectOrder } = useOrders();

  if (!currentNotification) return null;

  const order = currentNotification;
  const total = (order.total_cents / 100).toFixed(2);
  const pickupTime = order.pickup_time
    ? new Date(order.pickup_time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
  const queuedBehind = queue.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 px-5 py-4">
          <p className="text-blue-100 text-xs font-medium uppercase tracking-wide">
            New Order
          </p>
          <p className="text-white text-xl font-semibold mt-0.5">
            {order.customer_name}
          </p>
          <p className="text-blue-200 text-sm">{order.customer_phone}</p>
        </div>

        {/* Items */}
        <div className="px-5 py-4 border-b border-gray-100">
          {order.items.map((item) => (
            <div
              key={item.name}
              className="flex justify-between items-center py-1"
            >
              <span className="text-sm text-gray-700">{item.name}</span>
              <span className="text-sm font-medium text-gray-900">
                x{item.qty}
              </span>
            </div>
          ))}
        </div>

        {/* Meta */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-900">${total}</span>
          {pickupTime && (
            <span className="text-xs text-gray-400">
              Pickup at {pickupTime}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 py-4 flex gap-3">
          {/* <button
            onClick={() => rejectOrder(order.id)}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
          >
            Reject
          </button> */}
          <button
            onClick={() => {
              acceptOrder(order.id);
              router.refresh();
            }}
            className="flex-2 grow py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium active:scale-95 transition-all"
          >
            Accept
          </button>
        </div>

        {/* Queue indicator */}
        {queuedBehind > 0 && (
          <div className="px-5 pb-4 text-center">
            <span className="text-xs text-gray-400">
              {queuedBehind} more order{queuedBehind > 1 ? "s" : ""} waiting
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
 