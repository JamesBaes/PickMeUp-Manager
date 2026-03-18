'use client'

import { useState } from 'react'
import type { Order, OrderStatus } from '@/types'

const STATUS_STYLES: Record<OrderStatus, string> = {
  paid:        'bg-white text-gray-600 border border-gray-200',
  in_progress: 'bg-white text-gray-600 border border-gray-200',
  ready:       'bg-white text-gray-600 border border-gray-200',
  completed:   'bg-white text-gray-600 border border-gray-200',
  refunded:    'bg-white text-gray-600 border border-gray-200',
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  paid:        'Paid',
  in_progress: 'In Progress',
  ready:       'Ready',
  completed:   'Completed',
  refunded:    'Refunded',
}

const ALL_STATUSES: OrderStatus[] = ['paid', 'in_progress', 'ready', 'completed', 'refunded']
const PAGE_SIZE = 10

export default function OrderHistoryTable({ orders }: { orders: Order[] }) {
  const safeOrders = Array.isArray(orders) ? orders : []
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)

  const filtered = safeOrders.filter((o) => {
    const matchesSearch =
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.includes(search) ||
      (o.customer_email?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const paginated = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = filtered.length > paginated.length

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const shortId = (id: string) => id.replace(/-/g, '').slice(0, 8).toUpperCase()

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) +
      ' ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg font-semibold text-gray-900">
          Order History
          <span className="ml-2 text-sm font-normal text-gray-400">{safeOrders.length} orders</span>
        </h2>
        <div className="flex items-center gap-2">
          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as OrderStatus | 'all'); setPage(1) }}
              className="appearance-none text-sm border border-gray-200 rounded-lg px-3 py-1.5 pr-7 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white cursor-pointer"
            >
              <option value="all">Status: All</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
          </div>
          {/* Search */}
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-100 w-36"
          />
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="pb-3 w-8" />
            <th className="pb-3 text-left text-xs font-semibold text-gray-400">Order ID</th>
            <th className="pb-3 text-left text-xs font-semibold text-gray-400">Created</th>
            <th className="pb-3 text-left text-xs font-semibold text-gray-400">Customer</th>
            <th className="pb-3 text-left text-xs font-semibold text-gray-400">Total</th>
            <th className="pb-3 text-left text-xs font-semibold text-gray-400">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
                No orders found
              </td>
            </tr>
          ) : (
            paginated.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 pr-3">
                  <input
                    type="checkbox"
                    checked={selected.has(order.id)}
                    onChange={() => toggleSelect(order.id)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-200 cursor-pointer"
                  />
                </td>
                <td className="py-3 pr-6">
                  <span className="text-sm font-mono text-gray-700">{shortId(order.id)}</span>
                </td>
                <td className="py-3 pr-6">
                  <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
                </td>
                <td className="py-3 pr-6">
                  <span className="text-sm text-gray-700">{order.customer_name}</span>
                </td>
                <td className="py-3 pr-6">
                  <span className="text-sm text-gray-700">${(order.total_cents / 100).toFixed(2)}</span>
                </td>
                <td className="py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status as OrderStatus]}`}>
                    {STATUS_LABELS[order.status as OrderStatus] ?? order.status}
                    <span className="text-gray-400">›</span>
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* More button */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-5 py-1.5 hover:bg-gray-50 transition-colors"
          >
            More...
          </button>
        </div>
      )}
    </div>
  )
}