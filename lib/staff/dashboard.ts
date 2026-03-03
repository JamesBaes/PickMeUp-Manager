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

// MOCK DATA: Used for UI development until real tables are connected.
const mockStaffDashboardData: StaffDashboardData = {
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
  // MOCK MODE: Keep this active while backend APIs/tables are not finalized.
  return mockStaffDashboardData;

  // REAL DB FETCH (UNCOMMENT WHEN READY):
  // import { createClient } from "@/utils/server";
  //
  // const supabase = await createClient();
  //
  // const { data: incomingOrders, error: incomingOrdersError } = await supabase
  //   .from("orders")
  //   .select("id, created_at, customer_name, total_amount, status")
  //   .order("created_at", { ascending: false })
  //   .limit(5);
  //
  // const { data: topSellingItems, error: topSellingItemsError } = await supabase
  //   .from("menu_items")
  //   .select("name, sold_count")
  //   .order("sold_count", { ascending: false })
  //   .limit(7);
  //
  // if (incomingOrdersError || topSellingItemsError) {
  //   throw new Error("Failed to load dashboard data from the database");
  // }
  //
  // const mappedIncomingOrders: StaffIncomingOrder[] = (incomingOrders ?? []).map((order: any) => ({
  //   id: String(order.id),
  //   created: new Date(order.created_at).toLocaleString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     day: "2-digit",
  //     month: "short",
  //   }),
  //   customer: order.customer_name,
  //   total: `$${Number(order.total_amount).toFixed(2)}`,
  //   status: order.status as StaffOrderStatus,
  // }));
  //
  // const mappedTopSellingItems: TopSellingItem[] = (topSellingItems ?? []).map((item: any, index: number) => ({
  //   rank: index + 1,
  //   name: item.name,
  //   sold: Number(item.sold_count ?? 0),
  // }));
  //
  // const totalOrders = mappedIncomingOrders.length;
  // const acceptedOrders = mappedIncomingOrders.filter((order) => order.status === "Active").length;
  // const acceptedOrdersPercent = totalOrders === 0 ? 0 : Math.round((acceptedOrders / totalOrders) * 100);
  //
  // return {
  //   dateLabel: "Date: Today",
  //   statusLabel: "Status: Active",
  //   searchPlaceholder: "Search",
  //   incomingOrders: mappedIncomingOrders,
  //   topSellingItems: mappedTopSellingItems,
  //   acceptedOrdersPercent,
  // };
}