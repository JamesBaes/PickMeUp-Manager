'use client'

import React, { useState, useEffect } from 'react'
import supabase from '@/utils/client'
import MenuList from '@/components/menu/menuList'

interface MenuItem {
  item_id: number
  name: string
  price: number
  description: string
  category: string
  calories: number
  allergy_information: string
}

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')

        if (error) throw error
        setMenuItems(data || [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menu Items</h1>
      </div>

      <MenuList menuItems={menuItems} />
    </div>
  )
}

export default MenuPage