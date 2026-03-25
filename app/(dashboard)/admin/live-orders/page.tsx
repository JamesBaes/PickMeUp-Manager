'use client'

import { useState } from 'react'
import { useOrders } from '@/context/OrdersContext'
import LiveOrderCard from '@/components/orders/LiveOrderCard'

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Ready', value: 'ready' },
]

export default function LiveOrdersPage() {
  const { liveOrders } = useOrders()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? liveOrders : liveOrders.filter(o => o.status === filter)

  return (
    <div className="flex flex-col gap-4">
      {/* Header card */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Live Orders</h1>
          <p className="text-sm text-gray-400">{liveOrders.length} active {liveOrders.length === 1 ? 'order' : 'orders'}</p>
        </div>
        <div className="flex gap-2">
          {STATUS_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition
                ${filter === value
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 px-1">No orders currently.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => (
            <LiveOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
