'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-10 rounded-2xl bg-white shadow-lg flex flex-col items-center gap-6 text-center">
        <Image src="/circle-logo.png" alt="Pick Me Up Logo" width={80} height={80} />
        <div className="space-y-2">
          <h1 className="font-heading font-semibold text-2xl text-gray-800">Something went wrong</h1>
          <p className="font-body text-sm text-gray-500">
            An unexpected error occurred. You can try again or return to the dashboard.
          </p>
          {error.digest && (
            <p className="font-body text-xs text-gray-300 mt-1">Error ID: {error.digest}</p>
          )}
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={reset}
            className="flex-1 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-medium font-body transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => router.back()}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium font-body transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}
