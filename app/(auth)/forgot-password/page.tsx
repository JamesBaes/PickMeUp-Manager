'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { handleSubmit } from './action'


const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await handleSubmit(email);
    if (error) {
      
      // Check for Supabase's "email does not exist" error message
      if (
        error.message &&
        error.message.toLowerCase().includes("does not exist")
      ) {
        setError("This email is not registered. Please contact your administrator to create an account.");
        setLoading(false);
        return;
      }
      setError("Failed to send reset email. Please try again.");
      setLoading(false);
      return;
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-gray-100">
      <div className="w-full max-w-lg p-12 rounded-2xl bg-white shadow-lg">
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
            <form onSubmit={onSubmit} className="space-y-6 w-full">
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
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
                disabled={loading || !!(error && error.includes("not registered"))}
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