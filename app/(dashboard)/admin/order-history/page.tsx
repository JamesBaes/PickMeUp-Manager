import React from 'react'
import { getRestaurantInfo } from '../../getRestaurantInfo'
import { getAllOrders } from './actions'
import OrderHistoryTable from '@/components/orders/OrderHistoryTable'

const OrderHistory = async () => {
  const { restaurantId } = await getRestaurantInfo()
  const orders = await getAllOrders(restaurantId!)
  console.log('orders type:', typeof orders, Array.isArray(orders), orders)

  return (
    <div className="w-full space-y-6">
      <OrderHistoryTable orders={orders} />
    </div>
  )
}

export default OrderHistory