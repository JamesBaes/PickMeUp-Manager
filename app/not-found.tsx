'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-10 rounded-2xl bg-white shadow-lg flex flex-col items-center gap-6 text-center">
        <Image src="/circle-logo.png" alt="Pick Me Up Logo" width={80} height={80} />
        <div className="space-y-2">
          <h1 className="font-heading font-semibold text-2xl text-gray-800">Page not found</h1>
          <p className="font-body text-sm text-gray-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-medium font-body transition-colors"
        >
          Go back
        </button>
      </div>
    </div>
  )
}
