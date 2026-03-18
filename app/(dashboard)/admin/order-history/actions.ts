'use server'
import { createClient } from "@/utils/server"

export const getAllOrders = async (restaurantId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch orders:', error)
    return []
  }

  return data ?? []

}