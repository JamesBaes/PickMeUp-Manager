'use server'

import { createClient, hasSupabaseServerConfig } from "@/utils/server";

export async function login(email: string, password: string) {

  if (!hasSupabaseServerConfig) {
    // MOCK MODE: Allow dashboard access during local UI development without Supabase.
    return { success: true, redirectTo: "/staff" };
  }

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email" };
  }

  if (!password || password.length < 1) {
    return { error: "Please enter your password" };
  }

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

  if (role === "staff") {
    return { success: true, redirectTo: "/staff" };
  }

  if (role === "admin") {
    return { success: true, redirectTo: "/admin" };
  }

  if (role === "super_admin") {
    return { success: true, redirectTo: "/super_admin" };
  }

  return { error: "An error occurred. Please try again." };
}