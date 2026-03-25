'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'
import { useOrdersRealtime } from '@/hooks/useOrdersRealtime'
import { useOrderActions } from '@/hooks/useOrderActions'
import type { Order, OrderStatus } from '@/types'

interface ToastMessage {
  message: string
  type: 'success' | 'error'
}

interface OrdersContextValue {
  queue: Order[]
  currentNotification: Order | null
  liveOrders: Order[]
  acceptOrder: (id: string, pickupTime?: string) => Promise<void>
  updateStatus: (id: string, status: OrderStatus) => Promise<void>
  refundOrder: (id: string, reason: string, staffName: string) => Promise<void>
  toast: ToastMessage | null
  clearToast: () => void
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

  const { acceptOrder, updateStatus, refundOrder, toast, clearToast, syncQueueRef }
   = useOrderActions(setQueue, setLiveOrders)

  useEffect(() => { syncQueueRef(queue) }, [queue, syncQueueRef])

  const notificationSound = useRef(new Howl({ src: ['/notification.mp3'], loop: true }))

  // tracks how many orders were in the queue last render
  const prevQueueLength = useRef(queue.length)

  // plays a looping sound when a new order arrives, stops when the queue is cleared
  useEffect(() => {
    const newOrderArrived = queue.length > prevQueueLength.current
    if (newOrderArrived) {
      notificationSound.current.play()
    }

    const queueCleared = queue.length === 0
    if (queueCleared) {
      notificationSound.current.stop()
    }

    prevQueueLength.current = queue.length
  }, [queue.length])

  useOrdersRealtime(restaurantId, setQueue, setLiveOrders)

  return (
    <OrdersContext.Provider value={{
      queue,
      currentNotification: queue[0] ?? null,
      liveOrders,
      acceptOrder,
      updateStatus,
      refundOrder,
      toast,
      clearToast,
    }}>
      {children}
    </OrdersContext.Provider>
  )
}
