'use server'

import { createAdminClient, createClient } from "@/utils/server";

const checkSuperAdmin = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'super_admin') return { error: 'Forbidden' }

  return { error: null }
}

export const fetchAdmins = async () => {
  const admin = await createAdminClient()
  const { data, error } = await admin
    .from('profiles')
    .select('id, name, email, role, restaurant_id')
    .eq('role', 'admin')

  if (error) {
    console.error('Error fetching admins:', error)
    return []
  }
  return data
}

export const fetchRestaurantLocations = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('restaurant_locations')
    .select('restaurant_id, location_name')
    .order('location_name', { ascending: true })

  if (error) {
    console.error('Error fetching restaurant locations:', error)
    return []
  }
  return data
}

export const addAdmin = async (name: string, email: string, restaurant_id: number) => {
  const { error } = await checkSuperAdmin()
  if (error) {
    console.error('Auth error:', error)
    return null
  }

  if (!restaurant_id) {
    console.error('restaurant_id is required')
    return null
  }

  const admin = await createAdminClient()

  const { data: authData, error: authError } = await admin.auth.admin.inviteUserByEmail(email)
  if (authError) {
    console.error('Invite error:', authError)
    return null
  }

  const { data, error: upsertError } = await admin
    .from('profiles')
    .upsert({ id: authData.user.id, name, email, role: 'admin', restaurant_id })
    .select()
    .single()

  if (upsertError) {
    console.error('Profile upsert error:', upsertError)
    return null
  }

  return data
}

export const deactivateAdmin = async (id: string) => {
  const { error } = await checkSuperAdmin()
  if (error) {
    console.error('Auth error:', error)
    return false
  }

  const admin = await createAdminClient()

  const { error: deleteError } = await admin.auth.admin.deleteUser(id)
  if (deleteError) {
    console.error('Delete user error:', deleteError)
    return false
  }

  return true
}
