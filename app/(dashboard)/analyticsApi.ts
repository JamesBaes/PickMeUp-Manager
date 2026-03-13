import { createClient } from '@/utils/server'

export async function getAnalytics() {
  const res = await fetch(`${process.env.CLIENT_APP_URL}/api/analytics`, {
    headers: { "x-admin-api-key": process.env.ANALYTICS_API_KEY! },
    next : { revalidate: 60 }, // cache for 60 seconds
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getTodaysOrders() {
  const supabase = await createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("orders")
    .select("id, created_at, customer_name, total_cents, status")
    .gte("created_at", today.toISOString())
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getAllOrders() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("id, created_at, customer_name, total_cents, status")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getWeeklySales() {
  const supabase = await createClient();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("orders")
    .select("created_at, total_cents")
    .in("status", ["paid", "picked_up"])
    .gte("created_at", sevenDaysAgo.toISOString()); 
    
  // Group by day
  const dayMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { weekday: "short" });
    dayMap[key] = 0;
  }

  for (const order of data ?? []) {
    const key = new Date(order.created_at).toLocaleDateString("en-US", { weekday: "short" });
    if (key in dayMap) dayMap[key] += order.total_cents / 100;
  }

  return {
    labels: Object.keys(dayMap),
    data: Object.values(dayMap),
  };
}




