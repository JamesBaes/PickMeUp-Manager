import LogoutButton from '@/components/LogoutButton'
import React from 'react'



const HomePage = () => {
  return (
    <main className="flex min-h-screen flex-col gap-6 p-6">
      <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Dashboard</h1>
          <p className="text-sm text-slate-600">Use this page as the staff home route and sign out when you are done.</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
          <span className="text-sm font-medium text-slate-600">Sign out</span>
          <div className="w-12">
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-4 rounded-2xl bg-white p-6 shadow-sm">
        Staff 1
      </div>
    </main>
  )
}

export default HomePage