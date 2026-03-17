"use client";
import React, { useState, useEffect } from "react";
import { fetchStaff, removeStaff, addStaff } from "./staffApi";

type Staff = {
  id: string;
  name: string;
  email: string;
  role: "staff";
};

const StaffPage = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  // fetch staff list
  useEffect(() => {
    const loadStaff = async () => {
      const data = await fetchStaff();
      if (data) {
        setStaff(data);
      }
    };
    loadStaff();
  }, []);

  // removing a staff member
  const handleRemoveStaff = async (id: string) => {
    const success = await removeStaff(id);
    if (success) {
      setStaff((prev) => prev.filter((member) => member.id !== id));
    }
  };

  // adding a staff member
  const handleAddStaff = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    const newStaff = await addStaff(form.name, form.email);
    if (newStaff) {
      setStaff((prev) => [...prev, newStaff]);
    }

    setForm({ name: "", email: "" });
    setShowSidebar(false);
  };

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <button
          onClick={() => setShowSidebar(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Staff
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Role</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Email</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm">
                      {member.name[0]}
                    </div>
                    <span className="text-sm font-medium">{member.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{member.role}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{member.email}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleRemoveStaff(member.id)}
                    className="text-xs border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Remove
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
              <h2 className="text-lg font-semibold">Add New Staff Member</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="flex flex-col flex-1 p-6 gap-4">
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
                  Add Staff
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

export default StaffPage;