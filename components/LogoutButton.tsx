"use client";

import { LogOut } from "lucide-react";
import logout from "@/app/actions/logout";

export default function LogoutButton() {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center justify-center w-full p-3 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition relative group"
      aria-label="Sign out"
    >
      <LogOut className="w-5 h-5" />
    </button>
  );
}