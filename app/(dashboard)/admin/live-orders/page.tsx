'use client'

import { useOrders } from '@/context/OrdersContext'
import LiveOrderCard from '@/components/orders/LiveOrderCard'
import Toast from '@/components/ui/Toast'

export default function LiveOrdersPage() {
  const { liveOrders } = useOrders()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Live Orders</h1>

      {liveOrders.length === 0 ? (
        <p className="text-sm text-gray-400">No orders being prepared right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveOrders.map((order) => (
            <LiveOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      <Toast />
    </div>
  )
}
