'use client'

import { useEffect, useState, useCallback } from 'react'
import supabase from '@/utils/client'
import { adjustOrderStatus } from '@/app/(dashboard)/admin/live-orders/action'
import type { Order, OrderStatus } from '@/types'

const ACTIVE_STATUSES: OrderStatus[] = ['paid', 'in_progress', 'ready',]
const DONE_STATUSES: OrderStatus[] = ['completed', 'refunded']

interface UseLiveOrdersOptions {
  restaurantId?: number
}

export function useLiveOrders({ restaurantId }: UseLiveOrdersOptions = {}) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      let query = supabase
        .from('orders')
        .select('*')
        .in('status', ACTIVE_STATUSES)
        .order('created_at', { ascending: true })

      if (restaurantId) {
        query = query.eq('restaurant_id', restaurantId)
      }

      const { data, error } = await query
      console.log('[useLiveOrders] fetch result:', { data, error, restaurantId })
      if (!error && data) setOrders(data)
      setLoading(false)
    }

    fetchOrders()
  }, [restaurantId])

  useEffect(() => {
    const filter = restaurantId
      ? `restaurant_id=eq.${restaurantId}`
      : undefined

    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          ...(filter ? { filter } : {}),
        },
        (payload) => {
          console.log('[useLiveOrders] realtime payload:', payload)
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as Order
            if (ACTIVE_STATUSES.includes(newOrder.status as OrderStatus)) {
              setOrders((prev) => [...prev, newOrder])
            }
          }

          if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Order
            if (DONE_STATUSES.includes(updated.status as OrderStatus)) {
              setOrders((prev) => prev.filter((o) => o.id !== updated.id))
            } else {
              setOrders((prev) =>
                prev.map((o) => (o.id === updated.id ? updated : o))
              )
            }
          }

          if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id))
          }
        }
      )
      .subscribe((status) => {
        console.log('[useLiveOrders] subscription status:', status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [restaurantId])

  const updateStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      // Optimistic update
      setOrders((prev) => {
        if (DONE_STATUSES.includes(status)) {
          return prev.filter((o) => o.id !== id)
        }
        return prev.map((o) => (o.id === id ? { ...o, status } : o))
      })

      const { error } = await adjustOrderStatus(id, status)

      if (error) {
        console.error('Failed to update order status:', error)
        // Revert optimistic update on failure
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single()
        if (data) {
          setOrders((prev) => prev.map((o) => (o.id === id ? data : o)))
        }
      }
    },
    []
  )

  const incoming = orders.filter((o) => o.status === 'paid')
  const accepted = orders.filter((o) =>
    (['in_progress', 'ready'] as OrderStatus[]).includes(o.status as OrderStatus)
  )

  return { incoming, accepted, loading, updateStatus }
}