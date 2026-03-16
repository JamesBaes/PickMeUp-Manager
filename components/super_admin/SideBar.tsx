"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '../LogoutButton'

const superAdminLinks = [
  { page: "Dashboard", route: "/super_admin" },
  { page: "Location Management", route: "/super_admin/staff" },
  { page: "Admin Management", route: "/super_admin/admin" },
]

const SideBar = () => {
  const pathname = usePathname()

  return (
  <nav className='flex w-full flex-col bg-white md:h-screen md:w-64 md:border-r md:border-gray-100 md:shadow-sm'>

    {/* Links */}
    <div className="flex-1 flex flex-wrap gap-1 px-3 py-3 md:flex-col md:py-6">
      {superAdminLinks.map((page, index) => {
        const isActive =
          page.route === '/super_admin'
            ? pathname === '/super_admin'
            : pathname.startsWith(page.route)

        return (
          <Link
            key={index}
            className={`flex items-center font-body px-4 py-2 md:py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-gray-200 text-gray-900 font-semibold'
                : 'text-gray-700 font-normal hover:bg-gray-100 hover:text-gray-900'
            }`}
            href={page.route}
          >
            {page.page}
          </Link>
        )
      })}
    </div>

    {/* Logout */}
    <div className="px-3 py-3 border-t border-gray-100 md:py-6">
      <LogoutButton />
    </div>
  </nav>
)
}

export default SideBar