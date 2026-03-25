import type { ReactNode } from 'react'

interface ConfirmModalProps {
  title: string
  message: ReactNode
  confirmLabel?: string
  confirming?: boolean
  confirmClassName?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  confirming,
  confirmClassName = 'flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="px-6 py-5 border-b">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-500 mb-4">{message}</p>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              disabled={confirming}
              className="flex-1 border border-gray-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={confirming}
              className={confirmClassName}
            >
              {confirming ? 'Loading...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
