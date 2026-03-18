'use server';

import { createAdminClient } from "@/utils/server";

export const handleSubmit = async (email: string) => {
  const supabase = await createAdminClient();

  // look for if the email exists or not
  const { data, error } = await supabase
    .from('profiles')
    .select('email')
    .ilike('email', email.trim())
    .single();

  if (error || !data) {
    // Email does not exist
    return { error: { message: "does not exist" } };
  }

  // Proceed with password reset
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  return { error: resetError };
};