"use client";
import React, { useState, useEffect } from "react";
import { fetchAdmins, deactivateAdmin, addAdmin } from "./adminApi";

type Admin = {
  id: string;
  name: string;
  email: string;
  role: "admin";
};

const AdminPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  // fetch admins list
  useEffect(() => {
    const loadAdmins = async () => {
      const data = await fetchAdmins();
      if (data) {
        setAdmins(data);
      }
    };
    loadAdmins();
  }, []);

  // deactivating an admin account
  const handleDeactivateAdmin = async (id: string) => {
    const success = await deactivateAdmin(id);

    if (success) {
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    }
  };

  // adding an admin account
  const handleAddAdmin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    const newAdmin = await addAdmin(form.name, form.email);
    if (newAdmin) {
      setAdmins((prev) => [...prev, newAdmin]);
    }

    setForm({ name: "", email: "" });
    setShowSidebar(false);
  };

  return (
    <div className="relative w-full min-h-[78vh] bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">Admin Management</h1>
        <button
          onClick={() => setShowSidebar(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold px-4 py-2 rounded-lg transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Admin
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto min-h-[58vh]">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-left text-base font-semibold text-gray-500">Name</th>
              <th className="py-3 px-4 text-left text-base font-semibold text-gray-500">Role</th>
              <th className="py-3 px-4 text-left text-base font-semibold text-gray-500">Email</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm">
                      {admin.name[0]}
                    </div>
                    <span className="text-base font-medium">{admin.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-base text-gray-600">{admin.role}</td>
                <td className="py-3 px-4 text-base text-gray-600">{admin.email}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleDeactivateAdmin(admin.id)}
                    className="text-sm border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sidebar Drawer */}
      {showSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setShowSidebar(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Add New Admin</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddAdmin} className="flex flex-col flex-1 p-6 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="mt-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSidebar(false)}
                  className="flex-1 border text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  Add Admin
                </button>
              </div>
            </form>
          </div>
          <style>{`
            @keyframes slide-in {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            .animate-slide-in {
              animation: slide-in 0.25s ease-out;
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default AdminPage;