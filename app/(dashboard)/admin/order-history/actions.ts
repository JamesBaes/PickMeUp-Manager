'use server'
import { createClient } from "@/utils/server"

export const getAllOrders = async (restaurantId: number) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch orders:', error)
    return []
  }

  return data ?? []

}