'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import supabase from '@/utils/client'

type UserRole = 'admin' | 'staff' | 'super_admin' | null

interface RestaurantContextValue {
  restaurantId: number | null
  role: UserRole
  isAdmin: boolean
  loading: boolean
  locationName: string | null
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
  initialRole,
  initialLocationName,
}: {
  children: React.ReactNode
  initialRestaurantId: number | null
  initialRole: UserRole
  initialLocationName: string | null
}) {
  const [restaurantId, setRestaurantId] = useState<number | null>(initialRestaurantId)
  const [role, setRole] = useState<UserRole>(initialRole)
  const [locationName] = useState<string | null>(initialLocationName)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setRestaurantId(null)
        setRole(null)
        return
      }
      if (session?.user) {
        setLoading(true)
        const { data } = await supabase
          .from('profiles')
          .select('restaurant_id, role')
          .eq('id', session.user.id)
          .single()
        setRestaurantId(data?.restaurant_id ?? null)
        setRole(data?.role ?? null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const isAdmin = role === 'admin' || role === 'super_admin'

  return (
    <RestaurantContext.Provider value={{ restaurantId, role, isAdmin, loading, locationName }}>
      {children}
    </RestaurantContext.Provider>
  )
}