"use server"

import { createClient } from "@/utils/server";
import { redirect } from "next/navigation";

// logout done on server side rather than client
const logout = async () => {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/");
};

export default logout;