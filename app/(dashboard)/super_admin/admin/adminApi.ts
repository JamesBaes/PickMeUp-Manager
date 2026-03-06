'use server'
import { createClient } from "@/utils/server";

export const fetchAdmins = async () => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role')
    .eq('role', 'admin')

  if (error) {
    console.error('Error fetching admins:', error)
    return [];
  }
  return data;
}

export const addAdmin = async (name: string, email: string) => {
  const res = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
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