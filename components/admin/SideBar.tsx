"use client"

import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const staffPageLinks = [
  {
    page: "Home",
    route: "/staff"
  },
  {
    page: "Orders",
    route: "/staff/orders"
  },
  {
    page: "Menu",
    route: "/staff/menu"
  }
]

const SideBar = () => {

  const router = useRouter();


  return (
    <nav className='flex flex-col w-full pt-20 h-screen bg-accent'>


    {
      staffPageLinks.map((page, index) => (
        <Link 
          key={index}
          className='text-center text-xl text-black font-body font-normal'
          href={page.route}
        >
          {page.page}
        </Link>
      ))
    }
    </nav>  
  )
}

export default SideBar