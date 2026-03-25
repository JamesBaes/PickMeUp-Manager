"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { fetchAdmins } from './admin/adminApi'

type Admin = {
  id: string
  name: string
  email: string
  role: string
  restaurant_id: number | null
}

const tabs = [
  { label: 'Dashboard', href: '/super_admin' },
  { label: 'Admin Management', href: '/super_admin/admin' },
]

const SuperAdminDashboard = () => {
  const pathname = usePathname()
  const [admins, setAdmins] = useState<Admin[]>([])

  useEffect(() => {
    const load = async () => {
      const [adminData] = await Promise.all([
        fetchAdmins(),
      ])
      if (adminData) setAdmins(adminData)
    }
    load()
  }, [])

  return (
    <div>
      {/* Tabs */}
      <div className="hidden md:flex gap-2 mb-8 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 md:px-5 py-2 rounded-full text-sm md:text-base font-medium transition whitespace-nowrap ${
              pathname === tab.href
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Superadmin Dashboard</h1>
      <p className="text-gray-400 text-sm md:text-base mb-8 md:mb-10">Overview of admins.</p>
    
        {/* Admin Management Card */}
        <div className="bg-white rounded-xl shadow p-4 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold">Admin Management</h2>
            <Link
              href="/super_admin/admin"
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 md:px-5 py-2.5 rounded-lg transition w-full sm:w-auto text-center"
            >
              Manage Admins
            </Link>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full min-w-120 md:min-w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-3 md:px-4 text-left text-xs md:text-base font-semibold text-gray-500">Name</th>
                <th className="py-3 px-3 md:px-4 text-left text-xs md:text-base font-semibold text-gray-500">Role</th>
                <th className="py-3 px-3 md:px-4 text-left text-xs md:text-base font-semibold text-gray-500">Email</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                  <td className="py-3 px-3 md:px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm shrink-0">
                        {admin.name[0].toUpperCase()}
                      </div>
                      <span className="text-sm md:text-base font-semibold whitespace-nowrap">{admin.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 md:px-4 text-sm md:text-base text-gray-600 whitespace-nowrap">Admin</td>
                  <td className="py-3 px-3 md:px-4 text-sm md:text-base text-gray-400 whitespace-nowrap">{admin.email}</td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 px-4 text-sm md:text-base text-gray-400 text-center">No admins found.</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>

      </div>
  )
}

export default SuperAdminDashboard