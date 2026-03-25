import React from 'react'
import type { LogItem } from '@/app/(dashboard)/super_admin/activity/page'

interface ActivityLogListProps {
  logs: LogItem[]
  loading: boolean
}

const OPERATION_STYLES: Record<string, string> = {
  INSERT: 'bg-green-100 text-green-700',
  UPDATE: 'bg-yellow-100 text-yellow-700',
  DELETE: 'bg-red-100 text-red-600',
}

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

const truncate = (value: unknown, length = 8) => {
  if (value === null || value === undefined) return '—'
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value)
  return str.length > length ? `${str.slice(0, length)}…` : str
}

const ActivityLogList: React.FC<ActivityLogListProps> = ({ logs, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400 text-sm">
        Loading...
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400 text-sm">
        No logs found.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">ID</th>
            <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">Changed At</th>
            <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">Operation</th>
            <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">Record PK</th>
            <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">Changed By</th>
            <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">TXID</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
              <td className="py-4 px-4 md:px-6 text-sm text-gray-500 font-mono" title={log.id}>
                {truncate(log.id)}
              </td>
              <td className="py-4 px-4 md:px-6 text-sm text-gray-600 whitespace-nowrap">
                {formatDate(log.changed_at)}
              </td>
              <td className="py-4 px-4 md:px-6">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${OPERATION_STYLES[log.operation] ?? 'bg-gray-100 text-gray-600'}`}>
                  {log.operation}
                </span>
              </td>
              <td className="py-4 px-4 md:px-6 text-sm text-gray-600 font-mono" title={log.record_pk}>
                {truncate(log.record_pk, 12)}
              </td>
              <td className="py-4 px-4 md:px-6 text-sm text-gray-600" title={log.changed_by}>
                {truncate(log.changed_by, 20)}
              </td>
              <td className="py-4 px-4 md:px-6 text-sm text-gray-500">
                {log.txid != null ? String(log.txid) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ActivityLogList
