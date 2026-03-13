'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import supabase from '@/utils/client'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?=/reset-password`,
    })

    if (error) {
      console.log('An error occurred sending reset email.', error)
      setError('Failed to send reset email. Please try again.')
    } else {
      setSent(true)
    }

    setLoading(false)
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-gray-100">
      <div className="w-2/7 min-w-100 p-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
        <div className="w-full">
          {/* Logo */}
          <div className="flex justify-center mb-8 flex-col items-center gap-4">
            <Image
              src="/circle-logo.png"
              alt="Circle Logo"
              width={108}
              height={108}
            />
            <h1 className="font-body text-gray-700 font-semibold text-3xl">
              Forgot Password
            </h1>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 mb-4 rounded font-body text-center">
              {error}
            </div>
          )}

          {sent ? (
            <div className="text-center space-y-4">
              <p className="font-body text-gray-600 text-lg">
                Check your email for a reset link!
              </p>
              <Link
                href="/"
                className="block text-sm underline text-[#0074BF] hover:text-[#026cb3] font-body"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div>
                <label htmlFor="email" className="block font-heading font-medium text-xl text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="GladiatorStaff@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-white w-full p-4 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-blue-300 focus:outline-none text-gray font-body transition-colors"
                />
              </div>

              <div className="text-right font-body">
                <Link href="/" className="text-sm underline text-[#0074BF] hover:text-[#026cb3]">
                  Back to Login
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer bg-[#0074BF] hover:bg-[#05609c] disabled:opacity-50 disabled:cursor-not-allowed font-heading text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword