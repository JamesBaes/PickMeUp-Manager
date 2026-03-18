import React from 'react'
import { getRestaurantInfo } from '@/app/(dashboard)/getRestaurantInfo'
import { getAllOrders } from './actions'
import OrderHistoryTable from '@/components/orders/OrderHistoryTable'

const OrderHistory = async () => {
  const { restaurantId } = await getRestaurantInfo()
  const orders = await getAllOrders(restaurantId)

  console.log('orders passed to component:', orders, 'length:', orders.length)

  return (
    <div className="w-full space-y-6">
      <OrderHistoryTable orders={orders} />
    </div>
  )
}

export default OrderHistory