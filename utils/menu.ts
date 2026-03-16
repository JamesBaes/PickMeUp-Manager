import supabase from '@/utils/client'

interface MenuItemInput {
  name: string
  price: number
  description: string
  category: string
  calories: number
  allergy_information: string
}

interface MenuItem extends MenuItemInput {
  item_id: number
}

interface CreateMenuItemResult {
  success: boolean
  data?: MenuItem
  error?: string
}

export async function createMenuItem(item: MenuItemInput): Promise<CreateMenuItemResult> {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
    }
  }

  const { data, error } = await supabase
    .from('menu_items')
    .insert([item])
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as MenuItem }
}
