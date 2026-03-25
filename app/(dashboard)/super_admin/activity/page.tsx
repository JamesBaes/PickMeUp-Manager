'use client'

import React, { useEffect, useState, useCallback } from 'react'
import supabase from '@/utils/client'
import ActivityLogList from '../../../../components/super_admin/ActivityLogList'

export interface LogItem {
  id: string
  changed_at: string
  operation: string
  record_pk: string
  changed_by: string
  txid: number
}

const PAGE_SIZE = 50

const ActivityPage = () => {
  const [logs, setLogs] = useState<LogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const [operationFilter, setOperationFilter] = useState<string>('ALL')

  // Reset to page 0 when filter changes
  useEffect(() => {
    setCurrentPage(0)
  }, [operationFilter])

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('logs')
        .select('id, changed_at, operation, record_pk, changed_by, txid', { count: 'exact' })
        .order('changed_at', { ascending: false })
        .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1)

      if (operationFilter !== 'ALL') {
        query = query.eq('operation', operationFilter)
      }

      const { data, error, count } = await query

      // PGRST103 = "Range Not Satisfiable" — treat as empty result set
      if (error) {
        if (error.code === 'PGRST103') {
          setLogs([])
          setTotalCount(0)
          setCurrentPage(0)
        } else {
          throw error
        }
      } else {
        setLogs((data as LogItem[]) || [])
        setTotalCount(count ?? 0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [currentPage, operationFilter])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Activity Logs</h1>
        <span className="text-sm text-gray-500">
          {totalCount.toLocaleString()} total record{totalCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <select
          value={operationFilter}
          onChange={(e) => setOperationFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-44"
        >
          <option value="ALL">All Operations</option>
          <option value="INSERT">INSERT</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      {/* Table */}
      {error ? (
        <div className="bg-white rounded-xl shadow p-6 text-red-500">Error: {error}</div>
      ) : (
        <ActivityLogList logs={logs} loading={loading} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Page {currentPage + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0 || loading}
              className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1 || loading}
              className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivityPage
