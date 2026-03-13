import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { getCurrentAppRole, getDefaultRouteForRole } from "@/utils/auth";
import { createClient } from "@/utils/server";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const role = await getCurrentAppRole(supabase, user);

    if (role) {
      redirect(getDefaultRouteForRole(role));
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100 overflow-hidden">
      <div className="w-2/7 min-w-100 p-12 rounded-xl bg-white shadow-lg flex items-center justify-center">
        <LoginForm forgotPasswordLink="/forgot-password" />
      </div>
    </div>
  );
}