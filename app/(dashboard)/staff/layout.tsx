import StaffShell from "@/components/staff/StaffShell";
import { RestaurantProvider } from "@/context/RestaurantContext";
import { createAdminClient } from "@/utils/server";

export default async function StaffLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('restaurant_id')
    .eq('id', user?.id)
    .single()

  const restaurantId = profile?.restaurant_id ?? null

  return (
    <RestaurantProvider initialRestaurantId={restaurantId}>
      <StaffShell>{children}</StaffShell>
    </RestaurantProvider>
  )
}
