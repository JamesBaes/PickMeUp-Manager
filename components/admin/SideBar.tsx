"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '../LogoutButton'
import Image from 'next/image'
import { LayoutDashboard, Zap, History, UtensilsCrossed, Package, Users } from 'lucide-react'

const adminPageLinks = [
  { page: "Dashboard", route: "/admin", icon: LayoutDashboard },
  { page: "Live Orders", route: "/admin/live-orders", icon: Zap },
  { page: "Order History", route: "/admin/order-history", icon: History },
  { page: "Menu", route: "/admin/menu", icon: UtensilsCrossed },
  { page: "Inventory", route: "/admin/inventory", icon: Package },
  { page: "Staff", route: "/admin/staff", icon: Users },
]

const SideBar = () => {
  const pathname = usePathname()

  return (
    <nav className='flex flex-col w-full h-screen bg-white border-r border-gray-100 shadow-sm items-center py-4 gap-2'>
      {/* Logo */}
      <div className="relative group flex items-center justify-center mb-4">
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
          <Image src="/circle-logo.png" alt="Pick Me Up Logo" width={40} height={40} />
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-col gap-1 flex-1 w-full px-2 items-center">
        {adminPageLinks.map((page, index) => {
          const isActive = pathname === page.route
          const Icon = page.icon
          return (
            <div key={index} className="relative group w-full">
              <Link
                href={page.route}
                className={`flex items-center justify-center w-full p-3 rounded-xl transition
                  ${isActive 
                    ? 'bg-green-50' 
                    : 'hover:bg-green-50'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-green-500'}`} />
              </Link>
              {/* Tooltip */}
              <span className="absolute top-1/2 -translate-y-1/2 left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                {page.page}
              </span>
            </div>
          )
        })}
      </div>

      {/* Logout */}
      <div className="w-full px-2 pb-2 border-t border-gray-100 pt-2">
        <LogoutButton />
      </div>
    </nav>
  )
}

export default SideBar