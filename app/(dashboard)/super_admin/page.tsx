"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchAdmins } from './admin/adminApi'
import { fetchLocations } from './locations/locationApi'
import type { Location } from './locations/locationApi'

type Admin = {
  id: string
  name: string
  email: string
  role: string
  restaurant_id: number | null
}

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [locations, setLocations] = useState<Location[]>([])

  useEffect(() => {
    const load = async () => {
      const [adminData, locationData] = await Promise.all([fetchAdmins(), fetchLocations()])
      if (adminData) setAdmins(adminData)
      if (locationData) setLocations(locationData)
    }
    load()
  }, [])

  return (
    <div>
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Superadmin Dashboard</h1>
      <p className="text-gray-400 text-sm md:text-base mb-8 md:mb-10">Overview of admins and locations.</p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

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
            <table className="w-full min-w-[20rem]">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-3 md:px-4 text-left text-xs md:text-base font-semibold text-gray-500">Name</th>
                  <th className="py-3 px-3 md:px-4 text-left text-xs md:text-base font-semibold text-gray-500">Email</th>
                  <th className="py-3 px-3 md:px-4 text-left text-xs md:text-base font-semibold text-gray-500">Location</th>
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
                    <td className="py-3 px-3 md:px-4 text-sm md:text-base text-gray-400 whitespace-nowrap">{admin.email}</td>
                    <td className="py-3 px-3 md:px-4 text-sm md:text-base text-gray-600 whitespace-nowrap">
                      {locations.find((l) => l.restaurant_id === admin.restaurant_id)?.location_name ?? <span className="text-gray-300">—</span>}
                    </td>
                  </tr>
                ))}
                {admins.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-6 px-4 text-sm text-gray-400 text-center">No admins found.</td>

                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Location Management Card */}
        <div className="bg-white rounded-xl shadow p-4 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold">Location Management</h2>
            <Link
              href="/super_admin/locations"
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 md:px-5 py-2.5 rounded-lg transition w-full sm:w-auto text-center"
            >
              Manage Locations
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[20rem]">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-3 md:px-4 text-left text-xs md:text-base font-semibold text-gray-500">Location</th>
                  <th className="py-3 px-3 md:px-4 text-left text-xs md:text-base font-semibold text-gray-500">ID</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc) => (
                  <tr key={loc.restaurant_id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                    <td className="py-3 px-3 md:px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm shrink-0">
                          {loc.location_name[0].toUpperCase()}
                        </div>
                        <span className="text-sm md:text-base font-semibold whitespace-nowrap">{loc.location_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 md:px-4 text-sm md:text-base text-gray-400">{loc.restaurant_id}</td>
                  </tr>
                ))}
                {locations.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-6 px-4 text-sm text-gray-400 text-center">No locations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SuperAdminDashboard
