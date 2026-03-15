"use client"

import React from 'react'
import Link from 'next/link'
import LogoutButton from '../LogoutButton'

const superAdminLinks = [
  { page: "Dashboard", route: "/super_admin" },
  { page: "Staff Management", route: "/super_admin/staff" },
  { page: "Admin Management", route: "/super_admin/admin" },
]

const SideBar = () => (
  <nav className='flex flex-col w-64 h-screen bg-white border-r border-gray-100 shadow-sm'>

    {/* Links */}
    <div className="flex-1 flex flex-col py-6 gap-1 px-3">
      {superAdminLinks.map((page, index) => (
        <Link
          key={index}
          className='flex items-center  text-gray-700 font-body font-normal px-4 py-3 rounded-lg hover:bg-red-50 hover:text-accent transition'
          href={page.route}
        >
          {page.page}
        </Link>
      ))}
    </div>

    {/* Logout */}
    <div className="px-3 py-6 border-t border-gray-100">
      <LogoutButton />
    </div>
  </nav>
)

export default SideBar