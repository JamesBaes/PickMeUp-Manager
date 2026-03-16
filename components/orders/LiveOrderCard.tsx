'use client'

import { useOrders } from '@/context/OrdersContext'
import type { Order } from '@/types'

export default function LiveOrderCard({ order }: { order: Order }) {
  const { updateStatus } = useOrders()
  const total = (order.total_cents / 100).toFixed(2)
  const pickupTime = order.pickup_time
    ? new Date(order.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">

      <div className="flex justify-between items-start">
        <div>
          <p className="text-base font-semibold text-gray-900">{order.customer_name}</p>
          <p className="text-sm text-gray-400">{order.customer_phone}</p>
        </div>
        <StatusBadge status={order.status} />
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
        {pickupTime && <span>Pickup at {pickupTime}</span>}
      </div>

      <ActionButton order={order} updateStatus={updateStatus} />
    </div>
  )
}

function ActionButton({
  order,
  updateStatus,
}: {
  order: Order
  updateStatus: (id: string, status: string) => Promise<void>
}) {
  if (order.status === 'accepted') {
    return (
      <button
        onClick={() => updateStatus(order.id, 'in_progress')}
        className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-sm font-medium transition-all"
      >
        In Progress
      </button>
    )
  }

  if (order.status === 'in_progress') {
    return (
      <button
        onClick={() => updateStatus(order.id, 'ready')}
        className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 active:scale-95 text-white text-sm font-medium transition-all"
      >
        Ready
      </button>
    )
  }

  if (order.status === 'ready') {
    return (
      <button
        onClick={() => updateStatus(order.id, 'completed')}
        className="w-full py-2 rounded-lg bg-gray-500 hover:bg-gray-600 active:scale-95 text-white text-sm font-medium transition-all"
      >
        Complete
      </button>
    )
  }

  return null
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    accepted: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-amber-100 text-amber-700',
    ready: 'bg-green-100 text-green-700',
  }

  const labels: Record<string, string> = {
    accepted: 'Accepted',
    in_progress: 'In Progress',
    ready: 'Ready',
  }

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {labels[status] ?? status}
    </span>
  )
}