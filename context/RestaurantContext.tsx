'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import supabase from '@/utils/client'

interface RestaurantContextValue {
  restaurantId: number | null
  loading: boolean
}

const RestaurantContext = createContext<RestaurantContextValue | null>(null)

export function useRestaurant() {
  const ctx = useContext(RestaurantContext)
  if (!ctx) throw new Error('useRestaurant must be used within RestaurantProvider')
  return ctx
}

export function RestaurantProvider({ 
  children,
  initialRestaurantId,
}: { 
  children: React.ReactNode
  initialRestaurantId: number | null
}) {
  const [restaurantId, setRestaurantId] = useState<number | null>(initialRestaurantId)
  const [loading, setLoading] = useState(false)

  // Listen for auth changes and re-sync
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setRestaurantId(null)
        return
      }
      if (session?.user) {
        setLoading(true)
        const { data } = await supabase
          .from('profiles')
          .select('restaurant_id')
          .eq('id', session.user.id)
          .single()
        setRestaurantId(data?.restaurant_id ?? null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <RestaurantContext.Provider value={{ restaurantId, loading }}>
      {children}
    </RestaurantContext.Provider>
  )
}