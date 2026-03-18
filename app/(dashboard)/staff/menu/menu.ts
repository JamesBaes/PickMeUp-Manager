'use server'

import { createClient } from '@/utils/server'

export interface MenuItem {
  item_id: number
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

// CREATE: Add a new menu item
export async function createMenuItem(data: CreateMenuItemInput): Promise<{ success: boolean; data?: MenuItem; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: newItem, error } = await supabase
      .from('menu_items')
      .insert([
        {
          name: data.name,
          price: data.price,
          description: data.description,
          category: data.category,
          calories: data.calories,
          allergy_information: data.allergy_information
        }
      ])
      .select()
      .single()

    if (error) throw error

    return { success: true, data: newItem }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create menu item'
    return { success: false, error: errorMessage }
  }
}

// READ: Get all menu items
export async function getAllMenuItems(): Promise<{ success: boolean; data?: MenuItem[]; error?: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('item_id', { ascending: true })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch menu items'
    return { success: false, error: errorMessage }
  }
}

// READ: Get a single menu item by ID
export async function getMenuItemById(itemId: number): Promise<{ success: boolean; data?: MenuItem; error?: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('item_id', itemId)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch menu item'
    return { success: false, error: errorMessage }
  }
}

// READ: Get menu items by category
export async function getMenuItemsByCategory(category: string): Promise<{ success: boolean; data?: MenuItem[]; error?: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch menu items by category'
    return { success: false, error: errorMessage }
  }
}

// UPDATE: Update a menu item
export async function updateMenuItem(input: UpdateMenuItemInput): Promise<{ success: boolean; data?: MenuItem; error?: string }> {
  try {
    const supabase = await createClient()
    const { item_id, ...updateData } = input

    const { data, error } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('item_id', item_id)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update menu item'
    return { success: false, error: errorMessage }
  }
}

// DELETE: Delete a menu item
export async function deleteMenuItem(itemId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('item_id', itemId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete menu item'
    return { success: false, error: errorMessage }
  }
}

// BATCH: Delete multiple menu items
export async function deleteMultipleMenuItems(itemIds: number[]): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .in('item_id', itemIds)

    if (error) throw error

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete menu items'
    return { success: false, error: errorMessage }
  }
}

// SEARCH: Search menu items by name or description
export async function searchMenuItems(query: string): Promise<{ success: boolean; data?: MenuItem[]; error?: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name', { ascending: true })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to search menu items'
    return { success: false, error: errorMessage }
  }
}
