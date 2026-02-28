export type StaffOrderStatus = "Active" | "Preparing" | "Completed";

export interface StaffIncomingOrder {
  id: string;
  created: string;
  customer: string;
  total: string;
  status: StaffOrderStatus;
}

export interface TopSellingItem {
  rank: number;
  name: string;
  sold: number;
}

export interface StaffDashboardData {
  dateLabel: string;
  statusLabel: string;
  searchPlaceholder: string;
  incomingOrders: StaffIncomingOrder[];
  topSellingItems: TopSellingItem[];
  acceptedOrdersPercent: number;
}

const dummyDashboardData: StaffDashboardData = {
  dateLabel: "Date: Today",
  statusLabel: "Status: Active",
  searchPlaceholder: "Search",
  incomingOrders: [
    { id: "88088", created: "18:02 Feb 24", customer: "John Doe", total: "$42.67", status: "Active" },
    { id: "88088", created: "18:02 Feb 24", customer: "John Doe", total: "$42.67", status: "Active" },
    { id: "88068", created: "18:02 Feb 24", customer: "John Doe", total: "$42.67", status: "Active" },
    { id: "88088", created: "18:02 Feb 24", customer: "John Doe", total: "$42.67", status: "Active" },
    { id: "88088", created: "18:02 Feb 24", customer: "John Doe", total: "$42.87", status: "Active" },
  ],
  topSellingItems: [
    { rank: 1, name: "Warrior", sold: 300 },
    { rank: 2, name: "Gladiator", sold: 250 },
    { rank: 3, name: "Undefeated", sold: 240 },
    { rank: 4, name: "Liberator", sold: 215 },
    { rank: 5, name: "Chicken Shield", sold: 198 },
    { rank: 6, name: "My Lady", sold: 100 },
    { rank: 7, name: "The Arena", sold: 88 },
  ],
  acceptedOrdersPercent: 98,
};

export async function getStaffDashboardData(): Promise<StaffDashboardData> {
  // Keep UI development independent from backend.
  // Replace this return with Supabase fetch once tables are ready.
  return dummyDashboardData;

  // Example future flow:
  // const supabase = await createClient();
  // const { data: incomingOrders } = await supabase.from("orders").select("...");
  // const { data: topSellingItems } = await supabase.from("menu_items").select("...");
  // return {
  //   dateLabel: "Date: Today",
  //   statusLabel: "Status: Active",
  //   searchPlaceholder: "Search",
  //   incomingOrders: mapOrders(incomingOrders),
  //   topSellingItems: mapTopSelling(topSellingItems),
  //   acceptedOrdersPercent: calculateAcceptedOrders(incomingOrders),
  // };
}