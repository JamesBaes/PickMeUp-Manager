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

  if (role === "admin" || "staff") {
    return { success: true, redirectTo: "/admin" };
  }

  if (role === "super_admin") {
    return { success: true, redirectTo: "/super_admin" };
  }

  return { error: "An error occurred. Please try again." };
}