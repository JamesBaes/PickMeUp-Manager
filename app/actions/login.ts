'use server'

import { createClient } from "@/utils/server";

export async function login(email: string, password: string) {

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Invalid email or password" };
  }
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Unable to retrieve user information" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  
  const role = profile?.role;

  if (role === "super_admin") {
    return { success: true, redirectTo: "/super_admin" };
  }

  if (role === "admin") {
    return { success: true, redirectTo: "/admin" };
  }

  if (role === "staff") {
    return { success: true, redirectTo: "/admin" };
  }

  // Customer or unknown role — not allowed here
  await supabase.auth.signOut();
  return { error: "Access denied. This portal is for restaurant staff only." };
}