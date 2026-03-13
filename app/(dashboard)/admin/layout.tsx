import React from "react";
import SideBar from "@/components/admin/SideBar";

export default function Layout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <div className="flex min-h-screen bg-lightbg">
      <aside className="sticky top-0 h-screen min-w-28 max-w-28 bg-white border-r border-gray-200 shadow-[4px_0_12px_-2px_rgba(0,0,0,0.08)]">
        <div className="h-full shadow-[4px_0_12px_-2px_rgba(0,0,0,0.08)]">
          <SideBar />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-10">
        {children}
      </main>
    </div>
  );
}