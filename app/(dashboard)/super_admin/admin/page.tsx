"use client";
import React, { useState, useEffect } from "react";
import { fetchAdmins, fetchRestaurantLocations, deactivateAdmin, addAdmin } from "./adminApi";

type Admin = {
  id: string;
  name: string;
  email: string;
  role: "admin";
  restaurant_id: number | null;
};

type RestaurantLocation = {
  restaurant_id: number;
  location_name: string;
};

const AdminPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [locations, setLocations] = useState<RestaurantLocation[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", restaurant_id: "" });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const [adminData, locationData] = await Promise.all([
        fetchAdmins(),
        fetchRestaurantLocations(),
      ]);
      if (adminData) setAdmins(adminData);
      if (locationData) setLocations(locationData);
    };
    load();
  }, []);

  const handleDeactivateAdmin = async (id: string) => {
    setDeletingId(id);
    const success = await deactivateAdmin(id);
    if (success) {
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    }
    setDeletingId(null);
  };

  const handleAddAdmin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.restaurant_id) return;

    const newAdmin = await addAdmin(form.name, form.email, Number(form.restaurant_id));
    if (newAdmin) {
      setAdmins((prev) => [...prev, newAdmin]);
    }

    setForm({ name: "", email: "", restaurant_id: "" });
    setShowSidebar(false);
  };

  const getLocationName = (id: number | null) => {
    if (!id) return '—'
    return locations.find((l) => l.restaurant_id === id)?.location_name ?? '—'
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Admin Management</h1>
        <button
          onClick={() => setShowSidebar(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition w-full sm:w-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Admin
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-4 md:px-6 text-left text-sm md:text-base font-semibold text-gray-500">Name</th>
              <th className="py-4 px-4 md:px-6 text-left text-sm md:text-base font-semibold text-gray-500">Role</th>
              <th className="py-4 px-4 md:px-6 text-left text-sm md:text-base font-semibold text-gray-500">Email</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
                <td className="py-4 px-4 md:px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-base shrink-0">
                      {admin.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm md:text-base font-semibold">{admin.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 md:px-6 text-sm md:text-base text-gray-600">{admin.role}</td>
                <td className="py-4 px-4 md:px-6 text-sm md:text-base text-gray-600">{admin.email}</td>
                <td className="py-4 px-4 md:px-6 text-right">
                  <button
                    onClick={() => handleDeactivateAdmin(admin.id)}
                    disabled={deletingId === admin.id}
                    className="text-xs md:text-sm border border-red-500 text-red-500 px-3 md:px-4 py-1.5 rounded-md hover:bg-red-50 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === admin.id ? 'Deleting...' : 'Delete Admin'}
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
              <div>
                <label className="block text-sm font-medium mb-1">Restaurant Location</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.restaurant_id}
                  onChange={(e) => setForm((f) => ({ ...f, restaurant_id: e.target.value }))}
                  required
                >
                  <option value="">Select a location</option>
                  {locations.map((loc) => (
                    <option key={loc.restaurant_id} value={loc.restaurant_id}>
                      {loc.location_name}
                    </option>
                  ))}
                </select>
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