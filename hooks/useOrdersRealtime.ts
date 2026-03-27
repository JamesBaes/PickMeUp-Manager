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

    let cancelled = false
    let channel: ReturnType<typeof supabase.channel> | null = null

    async function subscribe() {
      // Wait for the session to be ready before subscribing.
      // In production, the subscription can be created before the auth token
      // is available, causing realtime events to be blocked. getSession()
      // ensures the JWT is on the socket when the channel joins.
      const { data: { session } } = await supabase.auth.getSession()

      if (cancelled || !session) return

      channel = supabase
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
    }

    subscribe()

    return () => {
      cancelled = true
      if (channel) supabase.removeChannel(channel)
    }
  }, [restaurantId, setQueue, setLiveOrders])
}
