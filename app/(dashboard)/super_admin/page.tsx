import React from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/server'

type Profile = {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff'
}

const HomePage = async () => {
  let admins: Profile[] = []
  let locations: Profile[] = []

  try {
    const supabase = await createClient()

    const [adminsResult, locationsResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('role', 'admin'),
      supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('role', 'staff'),
    ])

    admins = (adminsResult.data ?? []) as Profile[]
    locations = (locationsResult.data ?? []) as Profile[]
  } catch {
    admins = []
    locations = []
  }

  return (
    <div className="w-full space-y-6">
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7 md:p-8 min-h-[78vh]">
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-base font-medium">Dashboard</span>
          <Link
            href="/super_admin/staff"
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-base font-medium hover:bg-gray-50 transition"
          >
            Location Management
          </Link>
          <Link
            href="/super_admin/admin"
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-base font-medium hover:bg-gray-50 transition"
          >
            Admin Management
          </Link>
        </div>

        <h1 className="text-4xl sm:text-5xl font-semibold text-gray-800 mb-2">Superadmin Dashboard</h1>
        <p className="text-base text-gray-500 mb-6">Overview of locations and admins.</p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <section className="rounded-2xl border border-gray-200 p-4 sm:p-5 h-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Location Management</h2>
              <Link
                href="/super_admin/staff"
                className="inline-flex items-center justify-center bg-blue-600 text-white text-base font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Manage Locations
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-base font-semibold text-gray-600">Name</th>
                    <th className="py-3 px-4 text-left text-base font-semibold text-gray-600">Role</th>
                    <th className="py-3 px-4 text-left text-base font-semibold text-gray-600">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.length > 0 ? (
                    locations.slice(0, 6).map((location) => (
                      <tr key={location.id} className="border-b border-gray-100 last:border-b-0">
                        <td className="py-3 px-4 text-base font-medium text-gray-900">{location.name}</td>
                        <td className="py-3 px-4 text-base text-gray-600">Location</td>
                        <td className="py-3 px-4 text-base text-gray-600">{location.email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-4 px-4 text-base text-gray-500" colSpan={3}>
                        No location records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 p-4 sm:p-5 h-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Admin Management</h2>
              <Link
                href="/super_admin/admin"
                className="inline-flex items-center justify-center bg-green-600 text-white text-base font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Manage Admins
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-base font-semibold text-gray-600">Name</th>
                    <th className="py-3 px-4 text-left text-base font-semibold text-gray-600">Role</th>
                    <th className="py-3 px-4 text-left text-base font-semibold text-gray-600">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length > 0 ? (
                    admins.slice(0, 6).map((admin) => (
                      <tr key={admin.id} className="border-b border-gray-100 last:border-b-0">
                        <td className="py-3 px-4 text-base font-medium text-gray-900">{admin.name}</td>
                        <td className="py-3 px-4 text-base text-gray-600">Admin</td>
                        <td className="py-3 px-4 text-base text-gray-600">{admin.email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-4 px-4 text-base text-gray-500" colSpan={3}>
                        No admin records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

export default HomePage