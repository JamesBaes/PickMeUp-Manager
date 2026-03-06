import React from "react";
import SideBar from "@/components/admin/SideBar";

export default function Layout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <div className="flex min-h-screen bg-lightbg">
      <aside className="w-28 bg-white shadow-md border-r border-gray-200 shadow-r-lg">
        <div className="h-full shadow-[4px_0_12px_-2px_rgba(0,0,0,0.08)]">
          <SideBar />
        </div>
      </aside>
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}