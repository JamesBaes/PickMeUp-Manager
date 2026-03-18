import supabase from "@/utils/client";

export const fetchStaff = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role')
    .eq('role', 'staff')

  if (error) {
    console.error('Error fetching staff:', error)
    return [];
  }
  return data;
}

export const addStaff = async (name: string, email: string) => {
  const res = await fetch('/api/staff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    console.error(`Error adding staff [${res.status}]:`, err);
    return null;
  }

  return res.json();
};

export const removeStaff = async (id: string) => {
  const res = await fetch('/api/staff', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    console.error(`Error removing staff [${res.status}]:`, err);
    return false;
  }

  return true;
};