import React from "react";
import SideBar from "@/components/super_admin/SideBar";

export default function Layout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <div className="min-h-screen bg-lightbg md:flex">
      <aside className="w-full bg-white shadow-md border-b border-gray-200 md:w-64 md:border-b-0 md:border-r md:shadow-r-lg">
        <div className="h-full md:shadow-[4px_0_12px_-2px_rgba(0,0,0,0.08)]">
          <SideBar />
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}