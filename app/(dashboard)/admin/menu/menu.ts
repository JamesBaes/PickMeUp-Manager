'use server'

import { createClient } from '@/utils/server'

export interface MenuItem {
  item_id: number
  restaurant_id?: number
  name: string
  price: number
  description: string
  category: string
  calories: number
  allergy_information: string
  created_at?: string
  updated_at?: string
}

export interface CreateMenuItemInput {
  name: string
  price: number
  description: string
  category: string
  calories: number
  allergy_information: string
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

// CREATE: Add a new menu item (insert into menu_items, then link to restaurant)
export async function createMenuItem(data: CreateMenuItemInput): Promise<{ success: boolean; data?: MenuItem; error?: string }> {
  const { error: authError, restaurantId, supabase } = await getAdminContext()
  if (authError || !restaurantId || !supabase) return { success: false, error: authError ?? 'Unauthorized' }

  // Step 1: insert into menu_items to get auto-generated item_id
  const { data: newItem, error: insertError } = await supabase
    .from('menu_items')
    .insert({
      name: data.name,
      price: data.price,
      description: data.description,
      category: data.category,
      calories: data.calories,
      allergy_information: data.allergy_information,
    })
    .select()
    .single()

  if (insertError) {
    console.error('createMenuItem insert error:', insertError)
    return { success: false, error: insertError.message }
  }

  // Step 2: link the item to this restaurant with all fields
  const { error: linkError } = await supabase
    .from('menu_items_restaurant_locations')
    .insert({
      item_id: newItem.item_id,
      restaurant_id: restaurantId,
      name: data.name,
      price: data.price,
      description: data.description,
      category: data.category,
      calories: data.calories,
      allergy_information: data.allergy_information,
    })

  if (linkError) {
    console.error('createMenuItem link error:', linkError)
    return { success: false, error: linkError.message }
  }

  return { success: true, data: newItem }
}

// READ: Get all menu items for the current restaurant via join table
export async function getAllMenuItems(): Promise<{ success: boolean; data?: MenuItem[]; error?: string }> {
  const { error: authError, restaurantId, supabase } = await getAdminContext()
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

  return { success: true, data: data ?? [] }
}

// UPDATE: Update a menu item (fields live on menu_items, not the join table)
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

// DELETE: Remove the restaurant link then delete the item
export async function deleteMenuItem(itemId: number): Promise<{ success: boolean; error?: string }> {
  const { error: authError, restaurantId, supabase } = await getAdminContext()
  if (authError || !restaurantId || !supabase) return { success: false, error: authError ?? 'Unauthorized' }

  const { error: unlinkError } = await supabase
    .from('menu_items_restaurant_locations')
    .delete()
    .eq('item_id', itemId)
    .eq('restaurant_id', restaurantId)

  if (unlinkError) {
    console.error('deleteMenuItem unlink error:', unlinkError)
    return { success: false, error: unlinkError.message }
  }

  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('item_id', itemId)

  if (error) {
    console.error('deleteMenuItem error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
