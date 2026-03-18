import { createAdminClient } from '@/utils/server'

export async function getRestaurantInfo() {
  const supabase = await createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('restaurant_id')
    .eq('id', user?.id)
    .single()

  const restaurantId = profile?.restaurant_id ?? null

  if (!restaurantId) return { restaurantId: null, locationName: null }

  const { data: location } = await supabase
    .from('restaurant_locations')
    .select('location_name')
    .eq('restaurant_id', restaurantId)
    .single()

  return { restaurantId, locationName: location?.location_name ?? null }
}