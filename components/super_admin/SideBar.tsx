"use client"

import React from 'react'
import Link from 'next/link'

const superAdminLinks = [
  { page: "Dashboard", route: "/super_admin" },
  { page: "Staff Management", route: "/super_admin/staff" },
  { page: "Admin Management", route: "/super_admin/admin" },
]

const SideBar = () => (
  <nav className='flex flex-col w-full pt-20 h-screen bg-white'>
    {superAdminLinks.map((page, index) => (
      <Link
        key={index}
        className='text-center text-xl text-black font-body font-normal py-4 hover:bg-accent-dark transition'
        href={page.route}
      >
        {page.page}
      </Link>
    ))}
  </nav>
)

export default SideBar