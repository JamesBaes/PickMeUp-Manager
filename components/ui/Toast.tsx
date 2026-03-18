'use client'

import { useEffect } from 'react'
import { useOrders } from '@/context/OrdersContext'

export default function Toast() {
  const { toast, clearToast } = useOrders()

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(clearToast, 3000)
    return () => clearTimeout(t)
  }, [toast, clearToast])

  if (!toast) return null

  const styles = toast.type === 'success'
    ? 'bg-green-600 text-white'
    : 'bg-red-600 text-white'

  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${styles}`}>
      {toast.message}
    </div>
  )
}
