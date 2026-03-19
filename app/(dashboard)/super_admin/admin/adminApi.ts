'use server'

import { createClient } from "@/utils/server";

export const fetchAdmins = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role, restaurant_id')
    .eq('role', 'admin')

  if (error) {
    console.error('Error fetching admins:', error)
    return [];
  }
  return data;
}

export const fetchRestaurantLocations = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('restaurant_locations')
    .select('restaurant_id, location_name')
    .order('location_name', { ascending: true })

  if (error) {
    console.error('Error fetching restaurant locations:', error)
    return [];
  }
  return data;
}

export const addAdmin = async (name: string, email: string, restaurant_id: number) => {
  const res = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, restaurant_id }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    console.error(`Error adding admin [${res.status}]:`, err);
    return null;
  }

  return res.json();
};

export const deactivateAdmin = async (id: string) => {
  const res = await fetch('/api/admin', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    console.error(`Error deactivating admin [${res.status}]:`, err);
    return false;
  }

  return true;
};