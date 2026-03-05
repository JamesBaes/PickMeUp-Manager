"use client";

import { useRouter } from "next/navigation";
import supabase from "@/utils/client";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm font-body font-medium text-red-500 hover:text-red-700 transition"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
        <path
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Logout
    </button>
  );
}