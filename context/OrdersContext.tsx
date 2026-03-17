'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import supabase from '@/utils/client'
import { acceptOrder as acceptOrderAction, adjustOrderStatus } from '@/app/(dashboard)/admin/live-orders/action'
import type { Order, OrderStatus } from '@/types'

const ACTIVE_STATUSES: OrderStatus[] = ['paid', 'in_progress', 'ready']

interface OrdersContextValue {
  queue: Order[]
  currentNotification: Order | null
  liveOrders: Order[]
  acceptOrder: (id: string) => Promise<void>
  rejectOrder: (id: string) => Promise<void>
  updateStatus: (id: string, status: OrderStatus) => Promise<void>
  refundOrder: (id: string) => Promise<void>
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}

export function OrdersProvider({
  children,
  initialOrders,
  restaurantId,
}: {
  children: React.ReactNode
  initialOrders: Order[]
  restaurantId: number | null
}) {
  const [queue, setQueue] = useState<Order[]>(
    initialOrders.filter((o) => o.status === 'paid')
  )
  const [liveOrders, setLiveOrders] = useState<Order[]>(
    initialOrders.filter((o) =>
      (['in_progress', 'ready'] as OrderStatus[]).includes(o.status as OrderStatus)
    )
  )
  const queueRef = useRef<Order[]>([])

  useEffect(() => {
    queueRef.current = queue
  }, [queue])

  useEffect(() => {
    if (!restaurantId) return

    const channel = supabase
      .channel(`orders-${restaurantId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const order = payload.new as Order
          if (order.restaurant_id !== restaurantId) return
          if (order.status === 'paid') {
            setQueue((prev) => [...prev, order])
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const order = payload.new as Order
          if (order.restaurant_id !== restaurantId) return

          if (order.status === 'in_progress') {
            setQueue((prev) => prev.filter((o) => o.id !== order.id))
            setLiveOrders((prev) => {
              const exists = prev.find((o) => o.id === order.id)
              if (exists) return prev.map((o) => o.id === order.id ? order : o)
              return [...prev, order]
            })
            return
          }

          if ((['completed', 'rejected', 'refunded'] as OrderStatus[]).includes(order.status as OrderStatus)) {
            setLiveOrders((prev) => prev.filter((o) => o.id !== order.id))
            setQueue((prev) => prev.filter((o) => o.id !== order.id))
            return
          }

          setLiveOrders((prev) =>
            prev.map((o) => (o.id === order.id ? order : o))
          )
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [restaurantId])

  const acceptOrder = useCallback(async (id: string) => {
    setQueue((prev) => prev.filter((o) => o.id !== id))
    const order = queueRef.current.find((o) => o.id === id)
    if (order) setLiveOrders((prev) => [...prev, { ...order, status: 'in_progress' as OrderStatus }])

    const { error } = await acceptOrderAction(id)
    if (error) console.error('Failed to accept order:', JSON.stringify(error))
  }, [])

  const rejectOrder = useCallback(async (id: string) => {
    setQueue((prev) => prev.filter((o) => o.id !== id))

    const { error } = await adjustOrderStatus(id, 'rejected' as OrderStatus)
    if (error) console.error('Failed to reject order:', error)
  }, [])

  const refundOrder = useCallback(async (id: string) => {
    setLiveOrders((prev) => prev.filter((o) => o.id !== id))

    try {
      const res = await fetch('/api/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        console.error('Refund failed:', body.error ?? res.statusText)
      }
    } catch (err) {
      console.error('Refund request threw:', err)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: OrderStatus) => {
    if ((['completed', 'rejected'] as OrderStatus[]).includes(status)) {
      setLiveOrders((prev) => prev.filter((o) => o.id !== id))
    } else {
      setLiveOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      )
    }

    const { error } = await adjustOrderStatus(id, status)
    if (error) console.error('Failed to update order status:', error)
  }, [])

  const currentNotification = queue[0] ?? null

  return (
    <OrdersContext.Provider value={{ queue, currentNotification, liveOrders, acceptOrder, rejectOrder, updateStatus, refundOrder }}>
      {children}
    </OrdersContext.Provider>
  )
}
