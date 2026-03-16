'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import supabase from '@/utils/client'
import type { Order } from '@/types'

const ACTIVE_STATUSES = ['paid', 'accepted', 'in_progress', 'ready']

interface OrdersContextValue {
  queue: Order[]
  currentNotification: Order | null
  liveOrders: Order[]
  acceptOrder: (id: string) => Promise<void>
  rejectOrder: (id: string) => Promise<void>
  updateStatus: (id: string, status: string) => Promise<void>
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
    initialOrders.filter((o) => ['accepted', 'in_progress', 'ready'].includes(o.status))
  )
  const queueRef = useRef<Order[]>([])

  useEffect(() => {
    queueRef.current = queue
  }, [queue])

  // Realtime subscription — re-subscribes if restaurantId changes
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

          if (order.status === 'accepted') {
            setQueue((prev) => prev.filter((o) => o.id !== order.id))
            setLiveOrders((prev) => [...prev, order])
            return
          }

          if (['completed', 'rejected'].includes(order.status)) {
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
    if (order) setLiveOrders((prev) => [...prev, { ...order, status: 'accepted' }])
    await supabase.from('orders').update({ status: 'accepted' }).eq('id', id)
  }, [])

  const rejectOrder = useCallback(async (id: string) => {
    setQueue((prev) => prev.filter((o) => o.id !== id))
    await supabase.from('orders').update({ status: 'rejected' }).eq('id', id)
  }, [])

  const updateStatus = useCallback(async (id: string, status: string) => {
    if (['completed', 'rejected'].includes(status)) {
      setLiveOrders((prev) => prev.filter((o) => o.id !== id))
    } else {
      setLiveOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      )
    }
    await supabase.from('orders').update({ status }).eq('id', id)
  }, [])

  const currentNotification = queue[0] ?? null

  return (
    <OrdersContext.Provider value={{ queue, currentNotification, liveOrders, acceptOrder, rejectOrder, updateStatus }}>
      {children}
    </OrdersContext.Provider>
  )
}