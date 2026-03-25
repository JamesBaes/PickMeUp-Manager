import React from 'react'
import SalesChart from '@/components/charts/SalesChart'
import { getAnalytics, getWeeklySales } from '../analyticsApi';
import OrdersTable from '@/components/orders/OrdersTable';
import TopItemsChart from '@/components/charts/TopItemsChart';
import VisitorsDonutChart from '@/components/charts/VisitorsDonutChart';
import { getRestaurantInfo } from '@/app/(dashboard)/getRestaurantInfo';

const HomePage = async () => {

  const { restaurantId, locationName } = await getRestaurantInfo()
  const [analytics, sales] = await Promise.all([getAnalytics(), getWeeklySales(restaurantId)]);

  const formatLocationName = (text: string): string => {
    return text
      .toLowerCase()
      .split(/[\s_]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
}

  return (
    <div className="w-full space-y-4">

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm px-6 py-5">
        <OrdersTable />
      </div>

      <div className="flex w-full gap-4">
        <div className="flex flex-col flex-1 gap-4 justify-center min-w-0">
          <div className="bg-white h-full rounded-lg border border-gray-100 shadow-sm px-6 py-3 flex flex-col">
            <h3 className="font-semibold font-heading mb-2 text-left text-gray-800 text-md">Visitors (Today vs Returning)</h3>
            <div className="flex justify-center w-full">
              <VisitorsDonutChart daily={analytics.daily_visitors} weekly={analytics.weekly_visitors} />
            </div>
          </div>
          <div className="bg-white rounded-lg border h-full border-gray-100 shadow-sm px-6 py-5">
            <TopItemsChart items={analytics.top_items} />
          </div>
        </div>
        <div className="flex-2 min-w-0">
          <div className="bg-white rounded-lg border border-gray-100 h-full shadow-sm px-6 py-5">
            <SalesChart
              labels={sales.labels}
              data={sales.data}
              title={`Weekly Revenue${locationName ? ` (${formatLocationName(locationName)})` : ''}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage