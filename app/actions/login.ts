'use server'

import { getCurrentAppRole, getDefaultRouteForRole } from "@/utils/auth";
import { createClient } from "@/utils/server";

export async function login(email: string, password: string) {

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

  const role = await getCurrentAppRole(supabase, user);

  if (role) {
    return { success: true, redirectTo: getDefaultRouteForRole(role) };
  }

  return { error: "No valid app_role claim was found for this account." };
}