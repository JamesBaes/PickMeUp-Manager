"use client";

import { useState, useEffect } from "react";
import { useOrders } from "@/context/OrdersContext";
import { adjustOrderWaitTime } from "@/app/(dashboard)/admin/live-orders/action";
import type { Order, OrderStatus } from "@/types";

export default function LiveOrderCard({ order }: { order: Order }) {
  const { updateStatus, refundOrder } = useOrders();
  const total = (order.total_cents / 100).toFixed(2);
  const pickupTime = order.pickup_time
    ? new Date(order.pickup_time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-base font-semibold text-gray-900">{order.customer_name}</p>
          <p className="text-sm text-gray-400">{order.customer_phone}</p>
        </div>
        <StatusBadge status={order.status as OrderStatus} />
      </div>

      <div className="flex flex-col gap-1">
        {order.items.map((item) => (
          <div key={item.name} className="flex justify-between text-sm">
            <span className="text-gray-600">{item.name}</span>
            <span className="text-gray-400">x{item.qty}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-2">
        <span className="font-medium text-gray-700">${total}</span>
      </div>

      {order.pickup_time && (
        <PickupTimeBar pickupTime={order.pickup_time} orderId={order.id} />
      )}

      <ActionButton
        order={order}
        total={total}
        updateStatus={updateStatus}
        refundOrder={refundOrder}
      />
    </div>
  );
}

function PickupTimeBar({ pickupTime, orderId }: { pickupTime: string; orderId: string }) {
  const [adjusting, setAdjusting] = useState(false)
  const [currentPickupTime, setCurrentPickupTime] = useState(pickupTime)
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor((new Date(pickupTime).getTime() - Date.now()) / 1000))
  )

  useEffect(() => {
    setSecondsLeft(Math.max(0, Math.floor((new Date(currentPickupTime).getTime() - Date.now()) / 1000)))
  }, [currentPickupTime])

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const readyAt = new Date(currentPickupTime).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  })

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const isUrgent = secondsLeft < 120

  const handleAdjust = async (deltaMinutes: number) => {
    const updated = new Date(new Date(currentPickupTime).getTime() + deltaMinutes * 60 * 1000).toISOString()
    setCurrentPickupTime(updated)
    await adjustOrderWaitTime(orderId, updated)
    setAdjusting(false)
  }

  return (
    <div className="bg-gray-50 rounded-lg px-3 py-2 flex flex-col gap-1.5 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-semibold ${isUrgent ? 'text-red-500' : 'text-gray-700'}`}>
            {secondsLeft === 0 ? 'Overdue' : `${minutes}:${seconds.toString().padStart(2, '0')}`}
          </span>
          <span className="text-xs text-gray-400">· Pickup at {readyAt}</span>
        </div>
        <button
          onClick={() => setAdjusting(!adjusting)}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Adjust
        </button>
      </div>
      {adjusting && (
        <div className="flex items-center gap-2 mt-1">
          <button onClick={() => handleAdjust(-5)} className="flex-1 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">-5 min</button>
          <button onClick={() => handleAdjust(5)} className="flex-1 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">+5 min</button>
          <button onClick={() => handleAdjust(10)} className="flex-1 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">+10 min</button>
        </div>
      )}
    </div>
  )
}

function ActionButton({
  order,
  total,
  updateStatus,
  refundOrder,
}: {
  order: Order;
  total: string;
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
  refundOrder: (id: string, reason: string, staffName: string) => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [staffName, setStaffName] = useState("");

  const handleRefundClick = () => setConfirming(true);
  const handleCancel = () => {
    setConfirming(false);
    setRefundReason("");
    setStaffName("");
  };
  const handleConfirm = async () => {
    setConfirming(false);
    setRefunding(true);
    await refundOrder(order.id, refundReason, staffName);
    setRefunding(false);
    setRefundReason("");
    setStaffName("");
  };

  if (confirming) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs text-center text-gray-500">
          Issue full refund of <span className="font-semibold text-gray-700">${total}</span>?
        </p>
        <input
          type="text"
          placeholder="Your name"
          value={staffName}
          onChange={(e) => setStaffName(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Reason for refund"
          value={refundReason}
          onChange={(e) => setRefundReason(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 placeholder-gray-400"
        />
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium active:scale-95 transition-all"
          >
            Confirm Refund
          </button>
        </div>
      </div>
    );
  }

  if (order.status === "in_progress") {
    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => updateStatus(order.id, "ready")}
          className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 active:scale-95 text-white text-sm font-medium transition-all"
        >
          Ready
        </button>
        <button
          onClick={handleRefundClick}
          disabled={refunding}
          className="w-full py-2 rounded-lg bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 border border-red-200 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {refunding ? "Refunding..." : "Refund"}
        </button>
      </div>
    );
  }

  if (order.status === "ready") {
    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => updateStatus(order.id, "completed")}
          className="w-full py-2 rounded-lg bg-gray-500 hover:bg-gray-600 active:scale-95 text-white text-sm font-medium transition-all"
        >
          Complete
        </button>
        <button
          onClick={handleRefundClick}
          disabled={refunding}
          className="w-full py-2 rounded-lg bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 border border-red-200 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {refunding ? "Refunding..." : "Refund"}
        </button>
      </div>
    );
  }

  return null;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    paid: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-amber-100 text-amber-700',
    ready: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-500',
    refunded: 'bg-red-100 text-red-600',
  }

  const labels: Record<OrderStatus, string> = {
    paid: 'Paid',
    in_progress: 'In Progress',
    ready: 'Ready',
    completed: 'Completed',
    refunded: 'Refunded',
  }

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}