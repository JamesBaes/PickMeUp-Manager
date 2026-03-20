'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '../LogoutButton'
import Image from 'next/image'
import { LayoutDashboard, Zap, History, UtensilsCrossed, Users } from 'lucide-react'
import { useRestaurant } from '@/context/RestaurantContext'
import { useAuth } from '@/context/AuthContext'

const allPageLinks = [
  { page: "Dashboard", route: "/admin", icon: LayoutDashboard, adminOnly: false },
  { page: "Live Orders", route: "/admin/live-orders", icon: Zap, adminOnly: false },
  { page: "Order History", route: "/admin/order-history", icon: History, adminOnly: false },
  { page: "Menu", route: "/admin/menu", icon: UtensilsCrossed, adminOnly: false },
  { page: "Staff", route: "/admin/staff", icon: Users, adminOnly: true },
]

const SideBar = () => {
  const pathname = usePathname()
  const { isAdmin, role } = useRestaurant()
  const { user } = useAuth()
  const emailUsername = user?.email?.split('@')[0] ?? ''

  const pageLinks = allPageLinks.filter((p) => !p.adminOnly || isAdmin)

  return (
    <nav className='flex flex-col w-full h-screen bg-white border-r border-gray-100 shadow-sm items-center py-4 gap-2'>
      <div className="flex flex-col items-center gap-1 mb-4">
        <div className="relative group w-14 h-14 rounded-full overflow-hidden flex items-center justify-center">
          <Image src="/circle-logo.png" alt="Pick Me Up Logo" width={56} height={56} />
        </div>
        <div className="relative group flex flex-col items-center">
          <span className="text-[10px] font-semibold text-gray-700 truncate max-w-20 text-center leading-tight">
            {emailUsername}
          </span>
          <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wide">
            {role}
          </span>
          {user?.email && (
            <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
              {user.email}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full px-2 items-center pt-2 flex-1">
        {pageLinks.map((page, index) => {
          const isActive = pathname === page.route
          const Icon = page.icon
          return (
            <div key={index} className="relative group w-full">
              <Link
                href={page.route}
                className={`flex items-center justify-center w-full p-3.5 rounded-xl transition
                  ${isActive ? 'bg-green-50' : 'hover:bg-green-50'}`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-green-500'}`} />
              </Link>
              <span className="absolute top-1/2 -translate-y-1/2 left-14 bg-gray-800 text-white font-body text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                {page.page}
              </span>
            </div>
          )
        })}
      </div>

      <div className="w-full px-2 pb-4 pt-6 border-t border-gray-100">
        <LogoutButton />
      </div>
    </nav>
  )
}

export default SideBar