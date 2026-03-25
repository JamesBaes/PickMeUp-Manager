'use client'

import { useCallback, useState, useRef } from 'react'
import { acceptOrder as acceptOrderAction, adjustOrderStatus } from '@/app/(dashboard)/admin/live-orders/action'
import type { Order, OrderStatus } from '@/types'

interface ToastMessage {
  message: string
  type: 'success' | 'error'
}

export function useOrderActions(
  setQueue: React.Dispatch<React.SetStateAction<Order[]>>,
  setLiveOrders: React.Dispatch<React.SetStateAction<Order[]>>
) {
  const queueRef = useRef<Order[]>([])
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const clearToast = useCallback(() => setToast(null), [])

  const syncQueueRef = (queue: Order[]) => { queueRef.current = queue }

  const acceptOrder = useCallback(async (id: string, pickupTime?: string) => {
    setQueue((prev) => prev.filter((o) => o.id !== id))
    const order = queueRef.current.find((o) => o.id === id)
    if (order) setLiveOrders((prev) => [...prev, { ...order, status: 'in_progress' as OrderStatus }])
    const { error } = await acceptOrderAction(id, pickupTime)
    if (error) console.error('Failed to accept order:', error)
  }, [setQueue, setLiveOrders])

  const rejectOrder = useCallback(async (id: string) => {
    setQueue((prev) => prev.filter((o) => o.id !== id))
    const { error } = await adjustOrderStatus(id, 'rejected' as OrderStatus)
    if (error) console.error('Failed to reject order:', error)
  }, [setQueue])

  const updateStatus = useCallback(async (id: string, status: OrderStatus) => {
    const done = (['completed', 'rejected'] as OrderStatus[]).includes(status)
    setLiveOrders((prev) =>
      done ? prev.filter((o) => o.id !== id) : prev.map((o) => (o.id === id ? { ...o, status } : o))
    )
    const { error } = await adjustOrderStatus(id, status)
    if (error) console.error('Failed to update order status:', error)
  }, [setLiveOrders])


  // fetches from /api/refund endpoint, 
  const refundOrder = useCallback(async (id: string, reason: string, staffName: string) => {
    try {
      const res = await fetch('/api/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id, reason, staffName }),
      })
      if (res.ok) {
        setLiveOrders((prev) => prev.filter((o) => o.id !== id))
        setToast({ message: 'Refund issued successfully', type: 'success' })
      } else {
        const body = await res.json().catch(() => ({}))
        setToast({ message: body.error ?? 'Refund failed', type: 'error' })
      }
    } catch {
      setToast({ message: 'Refund failed — network error', type: 'error' })
    }
  }, [setLiveOrders])

  return { acceptOrder, rejectOrder, updateStatus, refundOrder, toast, clearToast, syncQueueRef }
}
