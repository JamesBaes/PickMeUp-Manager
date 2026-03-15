import { getStaffDashboardData } from "@/lib/staff/dashboard";
import StaffDashboardContent from "@/components/staff/StaffDashboardContent";

export default async function StaffDashboardPage() {
  const dashboardData = await getStaffDashboardData();

  return <StaffDashboardContent dashboardData={dashboardData} />;
}
import OrderBar from '@/components/staff/OrderBar'
import OrderCard from '@/components/staff/OrderCard'
import React from 'react'



// const HomePage = () => {
//   return (
//     <main>

//       <div className="flex flex-1 gap-4">
//           Staff
//       </div>


//     </main>
//   )
// }

// export default HomePage
