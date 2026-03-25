'use server'

import { createClient } from '@/utils/server'

const checkSuperAdmin = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized', supabase: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'super_admin') return { error: 'Forbidden', supabase: null }

  return { error: null, supabase }
}

export type Location = {
  restaurant_id: number
  location_name: string
}

export const fetchLocations = async (): Promise<Location[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('restaurant_locations')
    .select('restaurant_id, location_name')
    .order('location_name', { ascending: true })

  if (error) {
    console.error('Error fetching locations:', error)
    return []
  }
  return data
}

export const addLocation = async (location_name: string): Promise<Location | null> => {
  const { error, supabase } = await checkSuperAdmin()
  if (error || !supabase) return null

  const { data, error: insertError } = await supabase
    .from('restaurant_locations')
    .insert({ location_name })
    .select()
    .single()

  if (insertError) {
    console.error('Error adding location:', insertError)
    return null
  }
  return data
}

export const updateLocation = async (restaurant_id: number, location_name: string): Promise<boolean> => {
  const { error, supabase } = await checkSuperAdmin()
  if (error || !supabase) return false

  const { error: updateError } = await supabase
    .from('restaurant_locations')
    .update({ location_name })
    .eq('restaurant_id', restaurant_id)

  if (updateError) {
    console.error('Error updating location:', updateError)
    return false
  }
  return true
}

export const deleteLocation = async (restaurant_id: number): Promise<boolean> => {
  const { error, supabase } = await checkSuperAdmin()
  if (error || !supabase) return false

  const { error: deleteError } = await supabase
    .from('restaurant_locations')
    .delete()
    .eq('restaurant_id', restaurant_id)

  if (deleteError) {
    console.error('Error deleting location:', deleteError)
    return false
  }
  return true
}
