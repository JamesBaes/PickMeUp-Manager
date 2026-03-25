"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '../LogoutButton'

const superAdminLinks = [
  { page: "Dashboard", route: "/super_admin" },
  { page: "Admin Management", route: "/super_admin/admin" },
  { page: "Location Management", route: "/super_admin/locations" },
  { page: "Log Activity", route: "/super_admin/activity" },
]

const SideBar = () => {
  const pathname = usePathname()

  return (
    <nav className='flex w-full bg-white md:flex-col md:h-screen'>

      {/* Links */}
      <div className="flex w-full gap-2 overflow-x-auto px-3 py-3 md:flex-1 md:flex-col md:gap-1 md:px-4 md:py-8 md:overflow-visible">
        {superAdminLinks.map((page, index) => (
          <Link
            key={index}
            className={`flex items-center whitespace-nowrap font-body px-4 py-2.5 md:py-4 rounded-lg transition text-sm md:text-lg ${
              pathname === page.route
                ? 'font-bold text-gray-900 bg-gray-100'
                : 'font-semibold text-gray-700 hover:bg-red-50 hover:text-accent'
            }`}
            href={page.route}
          >
            {page.page}
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="hidden md:block px-3 py-6 border-t border-gray-100">
        <LogoutButton />
      </div>
    </nav>
  )
}

export default SideBar