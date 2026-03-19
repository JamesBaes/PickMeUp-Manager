'use server'

import { createAdminClient, createClient } from "@/utils/server";

const getAdminContext = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized', restaurantId: null, role: null, supabase: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, restaurant_id')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return { error: 'Forbidden', restaurantId: null, role: null, supabase: null }
  }

  return { error: null, restaurantId: profile.restaurant_id, role: profile.role, supabase }
}

export const fetchStaff = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role, restaurant_id')
    .eq('role', 'staff')

  if (error) {
    console.error('Error fetching staff:', error)
    return []
  }
  return data
}

export const addStaff = async (name: string, email: string) => {
  const { error, restaurantId, supabase } = await getAdminContext()
  if (error || !restaurantId || !supabase) {
    console.error('Auth error:', error)
    return null
  }

  const { data: authData, error: authError } = await createAdminClient().auth.admin.inviteUserByEmail(email)
  if (authError) {
    console.error('Invite error:', authError)
    return null
  }

  const { data, error: upsertError } = await supabase
    .from('profiles')
    .upsert({ id: authData.user.id, name, email, role: 'staff', restaurant_id: restaurantId })
    .select()
    .single()

  if (upsertError) {
    console.error('Profile upsert error:', upsertError)
    return null
  }

  return data
}

export const deactivateStaff = async (id: string) => {
  const { error, restaurantId, role, supabase } = await getAdminContext()
  if (error || !restaurantId || !supabase) {
    console.error('Auth error:', error)
    return false
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('restaurant_id')
    .eq('id', id)
    .single()

  if (!profile) {
    console.error('Staff member not found')
    return false
  }

  if (profile.restaurant_id !== restaurantId && role !== 'super_admin') {
    console.error('Forbidden')
    return false
  }

  const { error: deleteError } = await createAdminClient().auth.admin.deleteUser(id)
  if (deleteError) {
    console.error('Delete user error:', deleteError)
    return false
  }

  return true
}
