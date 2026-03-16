export const dynamic = 'force-dynamic'

import React from 'react'
import SalesChart from '@/components/charts/SalesChart'
import { getAnalytics, getTodaysOrders, getWeeklySales } from '../analyticsApi';
import OrdersTable from '@/components/admin/OrdersTable';
import PageTabs from '@/components/admin/PageTabs';
import TopItemsChart from '@/components/charts/TopItemsChart';
import VisitorsDonutChart from '@/components/charts/VisitorsDonutChart';

const HomePage = async () => {

  const [analytics, orders, sales] = await Promise.all([getAnalytics(), getTodaysOrders(), getWeeklySales()]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageTabs />

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
        <OrdersTable orders={orders} />
      </div>

      <div className="flex w-full gap-4">
        <div className="flex flex-col flex-1 gap-4 justify-center min-w-0">
          <div className="bg-white h-full rounded-2xl border border-gray-100 shadow-sm px-6 py-3 flex flex-col">
            <h3 className="font-semibold font-heading mb-2 text-left text-gray-800 text-md">Visitors (Today vs Returning)</h3>
            <div className="flex justify-center w-full">
              <VisitorsDonutChart daily={analytics.daily_visitors} weekly={analytics.weekly_visitors} />
            </div>
          </div>
          <div className="bg-white rounded-2xl border h-full border-gray-100 shadow-sm px-6 py-5">
            <TopItemsChart items={analytics.top_items} />
          </div>
        </div>
        <div className="flex-2 min-w-0">
          <div className="bg-white rounded-2xl border border-gray-100 h-full shadow-sm px-6 py-5">
            <SalesChart
              labels={sales.labels}
              data={sales.data}
              title="Weekly Revenue"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage