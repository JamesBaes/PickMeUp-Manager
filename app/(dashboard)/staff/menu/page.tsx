'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import MenuList from '@/components/menu/menuList'
import { useRestaurant } from '@/context/RestaurantContext'

interface MenuItem {
  item_id: number
  restaurant_id: number
  name: string
  price: number
  popular: boolean
  description: string
  category: string
  bogo: boolean
  image_url: string
  calories: number
  allergy_information: string
}

type SortField = 'name' | 'price'
type SortOrder = 'asc' | 'desc'

const MenuPage = () => {
  const { restaurantId, loading: restaurantLoading } = useRestaurant()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  useEffect(() => {
    const logSession = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      )
      const { data: { session } } = await supabase.auth.getSession()
      console.log('JWT token:', session?.access_token)
    }
    logSession()
  }, [])

  useEffect(() => {
    if (restaurantLoading || restaurantId === null) return

    const fetchMenuItems = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Missing Supabase environment variables')
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data, error } = await supabase
          .from('menu_items_restaurant_locations')
          .select('*')
          .eq('restaurant_id', restaurantId)

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
  }, [restaurantId, restaurantLoading])

  const sortedItems = useMemo(() => {
    return [...menuItems].sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      } else {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price
      }
    })
  }, [menuItems, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  if (restaurantLoading || loading) return <div className="p-4">Loading...</div>
  if (!restaurantId) return <div className="p-4 text-red-500">No restaurant linked to your account.</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menu Items</h1>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <button
            onClick={() => handleSort('name')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              sortField === 'name'
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            Name {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
          </button>
          <button
            onClick={() => handleSort('price')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              sortField === 'price'
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            Price {sortField === 'price' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
          </button>
        </div>
      </div>

      <MenuList menuItems={sortedItems} />
    </div>
  )
}

export default MenuPage
