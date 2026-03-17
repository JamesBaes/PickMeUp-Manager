import React from 'react'

type OrderValue =
  | string
  | number
  | boolean
  | null
  | Record<string, unknown>
  | unknown[]

interface OrderItem {
  [key: string]: OrderValue
}

interface OrderListProps {
  orders: OrderItem[]
}

const formatValue = (value: OrderValue) => {
  if (value === null) return '-'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'string' || typeof value === 'number') return value

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

const toColumnLabel = (column: string) =>
  column
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  const columns = Array.from(new Set(orders.flatMap((order) => Object.keys(order))))

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            {columns.map((column) => (
              <th key={column} className="border border-gray-300 p-2 text-left">
                {toColumnLabel(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-100">
              {columns.map((column) => (
                <td key={`${rowIndex}-${column}`} className="border border-gray-300 p-2">
                  {formatValue(order[column] ?? null)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p className="mt-4 text-gray-500">No orders found.</p>}
    </div>
  )
}

export default OrderList