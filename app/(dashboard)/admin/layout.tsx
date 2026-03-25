import React from 'react'
import SideBar from '@/components/admin/SideBar'
import PageTabs from '@/components/admin/PageTabs'
import NotificationModal from '@/components/orders/NotificationModal'
import { OrdersProvider } from '@/context/OrdersContext'
import { RestaurantProvider } from '@/context/RestaurantContext'
import { createClient } from '@/utils/server'
import { getRestaurantInfo } from '@/app/(dashboard)/getRestaurantInfo'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { restaurantId, role, locationName } = await getRestaurantInfo()

  const supabase = await createClient()

  // fetch initial orders for this restaurant
  const { data: initialOrders } = await supabase
    .from('orders')
    .select('*')
    .in('status', ['paid', 'in_progress', 'ready'])
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: true })

  return (
    <RestaurantProvider initialRestaurantId={restaurantId} initialRole={role} initialLocationName={locationName}>
      <OrdersProvider initialOrders={initialOrders ?? []} restaurantId={restaurantId}>
        <div className="flex min-h-screen bg-lightbg">
          <aside className="sticky top-0 h-screen min-w-24 max-w-24 bg-white border-r border-gray-200 shadow-[4px_0_12px_-2px_rgba(0,0,0,0.08)]">
            <div className="h-full shadow-[4px_0_12px_-2px_rgba(0,0,0,0.08)]">
              <SideBar />
            </div>
          </aside>

          <main className="flex-1 overflow-y-scroll py-10 px-4 space-y-4">
            <PageTabs />
            {children}
          </main>

          <NotificationModal />
        </div>
      </OrdersProvider>
    </RestaurantProvider>
  )
}