import { getStaffDashboardData } from "@/lib/staff/dashboard";
import StaffDashboardContent from "@/components/staff/StaffDashboardContent";

export default async function StaffDashboardPage() {
  const dashboardData = await getStaffDashboardData();

  return <StaffDashboardContent dashboardData={dashboardData} />;
}
