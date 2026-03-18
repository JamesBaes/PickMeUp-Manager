import React from 'react'

type LogValue = string | number | boolean | null | Record<string, unknown> | unknown[]

interface LogItem {
  id: LogValue
  changed_at: LogValue
  operation: LogValue
  record_pk: LogValue
  changed_by: LogValue
  txid: LogValue
}

interface ActivityLogListProps {
  logs: LogItem[]
}

const formatLogValue = (value: LogValue) => {
  if (value === null) return '-'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'string' || typeof value === 'number') return value

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

const formatDateValue = (value: LogValue) => {
  if (typeof value !== 'string') return formatLogValue(value)
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

const ActivityLogList: React.FC<ActivityLogListProps> = ({ logs }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2 text-left">ID</th>
            <th className="border border-gray-300 p-2 text-left">Changed At</th>
            <th className="border border-gray-300 p-2 text-left">Operation</th>
            <th className="border border-gray-300 p-2 text-left">Record PK</th>
            <th className="border border-gray-300 p-2 text-left">Changed By</th>
            <th className="border border-gray-300 p-2 text-left">TXID</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr
              key={typeof log.id === 'string' || typeof log.id === 'number' ? String(log.id) : `log-${index}`}
              className="hover:bg-gray-100"
            >
              <td className="border border-gray-300 p-2">{formatLogValue(log.id)}</td>
              <td className="border border-gray-300 p-2">{formatDateValue(log.changed_at)}</td>
              <td className="border border-gray-300 p-2">{formatLogValue(log.operation)}</td>
              <td className="border border-gray-300 p-2">{formatLogValue(log.record_pk)}</td>
              <td className="border border-gray-300 p-2">{formatLogValue(log.changed_by)}</td>
              <td className="border border-gray-300 p-2">{formatLogValue(log.txid)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {logs.length === 0 && <p className="mt-4 text-gray-500">No logs found.</p>}
    </div>
  )
}

export default ActivityLogList
