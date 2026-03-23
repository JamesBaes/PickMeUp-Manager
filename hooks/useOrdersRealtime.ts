'use client'

import { useEffect } from 'react'
import supabase from '@/utils/client'
import type { Order, OrderStatus } from '@/types'

const DONE_STATUSES: OrderStatus[] = ['completed', 'refunded']

export function useOrdersRealtime(
  restaurantId: number | null,
  setQueue: React.Dispatch<React.SetStateAction<Order[]>>,
  setLiveOrders: React.Dispatch<React.SetStateAction<Order[]>>
) {
  useEffect(() => {
    if (!restaurantId) return

    const channel = supabase
      .channel(`orders-${restaurantId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const order = payload.new as Order
        if (order.restaurant_id !== restaurantId) return
        if (order.status === 'paid') setQueue((prev) => [...prev, order])
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        const order = payload.new as Order
        if (order.restaurant_id !== restaurantId) return

        if (order.status === 'in_progress') {
          setQueue((prev) => prev.filter((o) => o.id !== order.id))
          setLiveOrders((prev) => {
            const exists = prev.find((o) => o.id === order.id)
            return exists ? prev.map((o) => (o.id === order.id ? order : o)) : [...prev, order]
          })
          return
        }

        if (DONE_STATUSES.includes(order.status as OrderStatus)) {
          setQueue((prev) => prev.filter((o) => o.id !== order.id))
          setLiveOrders((prev) => prev.filter((o) => o.id !== order.id))
          return
        }

        setLiveOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [restaurantId, setQueue, setLiveOrders])
}
