import SideBar from '@/components/super_admin/SideBar'
import React from 'react'

const HomePage = () => {
  return (
    <div className="flex min-h-screen bg-lightbg">
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Superadmin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Staff Management</h2>
            <p className="text-gray-600 mb-4">Add, edit, or remove staff members.</p>
            <a
              href="/super_admin/staff"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Manage Staff
            </a>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Admin Management</h2>
            <p className="text-gray-600 mb-4">Add, edit, or remove admin members.</p>
            <a
              href="/super_admin/admin"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Manage Admins
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage