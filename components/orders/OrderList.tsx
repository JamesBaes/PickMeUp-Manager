import React from 'react'

interface OrderItem {
  id: string
  created_at: string
  customer_name: string | null
  customer_phone: string | null
  items: Record<string, unknown> | unknown[] | null
  total_cents: number | null
  customer_email: string | null
  customer_id: string | null
}

interface OrderListProps {
  orders: OrderItem[]
}

const formatItems = (items: OrderItem['items']) => {
  if (items === null) return '-'
  try {
    return JSON.stringify(items)
  } catch {
    return String(items)
  }
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2 text-left">ID</th>
            <th className="border border-gray-300 p-2 text-left">Created At</th>
            <th className="border border-gray-300 p-2 text-left">Customer Name</th>
            <th className="border border-gray-300 p-2 text-left">Customer Phone</th>
            <th className="border border-gray-300 p-2 text-left">Items</th>
            <th className="border border-gray-300 p-2 text-left">Total</th>
            <th className="border border-gray-300 p-2 text-left">Customer Email</th>
            <th className="border border-gray-300 p-2 text-left">Customer ID</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2">{order.id}</td>
              <td className="border border-gray-300 p-2">
                {new Date(order.created_at).toLocaleString()}
              </td>
              <td className="border border-gray-300 p-2">{order.customer_name ?? '-'}</td>
              <td className="border border-gray-300 p-2">{order.customer_phone ?? '-'}</td>
              <td className="border border-gray-300 p-2">{formatItems(order.items)}</td>
              <td className="border border-gray-300 p-2">
                {order.total_cents === null ? '-' : `$${(order.total_cents / 100).toFixed(2)}`}
              </td>
              <td className="border border-gray-300 p-2">{order.customer_email ?? '-'}</td>
              <td className="border border-gray-300 p-2">{order.customer_id ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p className="mt-4 text-gray-500">No orders found.</p>}
    </div>
  )
}

export default OrderList