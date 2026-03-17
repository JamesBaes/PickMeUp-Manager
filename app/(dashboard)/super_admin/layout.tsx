import React from "react";
import SideBar from "@/components/super_admin/SideBar";

export default function Layout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <div className="min-h-screen bg-lightbg md:flex">
      <aside className="w-full md:w-64 md:shrink-0 bg-white border-b md:border-b-0 md:border-r border-gray-200 shadow-[4px_0_12px_-2px_rgba(0,0,0,0.08)]">
          <SideBar />
      </aside>
      <main className="flex-1 p-4 md:p-10">
        {children}
      </main>
    </div>
  );
}