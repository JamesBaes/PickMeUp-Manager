'use server'

import { createClient } from '@/utils/server'

export interface MenuItem {
  item_id: number
  restaurant_id?: number
  name: string
  price: number
  description: string | null
  category: string
  calories: number
  allergy_information: string | null
  image_url?: string
  is_hidden?: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateMenuItemInput {
  name: string
  price: number
  description: string | null
  category: string
  calories: number
  allergy_information: string | null
  image_url?: string
}

export interface UpdateMenuItemInput extends Partial<CreateMenuItemInput> {
  item_id: number
}

const getAdminContext = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized', restaurantId: null, supabase: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, restaurant_id')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return { error: 'Forbidden', restaurantId: null, supabase: null }
  }

  return { error: null, restaurantId: profile.restaurant_id as number, supabase }
}

const getMenuReadContext = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized', restaurantId: null, supabase: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, restaurant_id')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'super_admin', 'staff'].includes(profile.role)) {
    return { error: 'Forbidden', restaurantId: null, supabase: null }
  }

  return { error: null, restaurantId: profile.restaurant_id as number, supabase }
}

export async function createMenuItem(data: CreateMenuItemInput): Promise<{ success: boolean; data?: MenuItem; error?: string }> {
  const { error: authError, restaurantId, supabase } = await getAdminContext()
  if (authError || !restaurantId || !supabase) return { success: false, error: authError ?? 'Unauthorized' }

  const { data: newItem, error } = await supabase
    .from('menu_items_restaurant_locations')
    .insert({
      restaurant_id: restaurantId,
      name: data.name,
      price: data.price,
      description: data.description,
      category: data.category,
      calories: data.calories,
      allergy_information: data.allergy_information,
      image_url: data.image_url ?? null,
    })
    .select()
    .single()

  if (error) {
    console.error('createMenuItem error:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data: newItem }
}

export async function getAllMenuItems(): Promise<{ success: boolean; data?: MenuItem[]; error?: string }> {
  const { error: authError, restaurantId, supabase } = await getMenuReadContext()
  if (authError || !restaurantId || !supabase) return { success: false, error: authError ?? 'Unauthorized' }

  const { data, error } = await supabase
    .from('menu_items_restaurant_locations')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('item_id', { ascending: true })

  if (error) {
    console.error('getAllMenuItems error:', error)
    return { success: false, error: error.message }
  }

  const unique = Array.from(new Map((data ?? []).map((i) => [i.item_id, i])).values())
  return { success: true, data: unique }
}

export async function updateMenuItem(input: UpdateMenuItemInput): Promise<{ success: boolean; data?: MenuItem; error?: string }> {
  const { error: authError, restaurantId, supabase } = await getAdminContext()
  if (authError || !restaurantId || !supabase) return { success: false, error: authError ?? 'Unauthorized' }

  const { item_id, ...updateData } = input

  const { data, error } = await supabase
    .from('menu_items_restaurant_locations')
    .update(updateData)
    .eq('item_id', item_id)
    .eq('restaurant_id', restaurantId)
    .select()
    .single()

  if (error) {
    console.error('updateMenuItem error:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function toggleMenuItemVisibility(itemId: number, isHidden: boolean): Promise<{ success: boolean; error?: string }> {
  const { error: authError, restaurantId, supabase } = await getAdminContext()
  if (authError || !restaurantId || !supabase) return { success: false, error: authError ?? 'Unauthorized' }

  const { error } = await supabase
    .from('menu_items_restaurant_locations')
    .update({ is_hidden: isHidden })
    .eq('item_id', itemId)
    .eq('restaurant_id', restaurantId)

  if (error) {
    console.error('toggleMenuItemVisibility error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteMenuItem(itemId: number): Promise<{ success: boolean; error?: string }> {
  const { error: authError, restaurantId, supabase } = await getAdminContext()
  if (authError || !restaurantId || !supabase) return { success: false, error: authError ?? 'Unauthorized' }

  const { error } = await supabase
    .from('menu_items_restaurant_locations')
    .delete()
    .eq('item_id', itemId)
    .eq('restaurant_id', restaurantId)

  if (error) {
    console.error('deleteMenuItem error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
