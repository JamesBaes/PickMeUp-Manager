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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // State for confirmation modal
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

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
  // Handles actual deletion after confirmation
  const handleRemoveStaff = async (id: string) => {
    setDeletingId(id);
    const success = await removeStaff(id);
    if (success) {
      setStaff((prev) => prev.filter((member) => member.id !== id));
    }
    setDeletingId(null);
    setStaffToDelete(null);
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
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Location Management</h1>
        <button
          onClick={() => setShowSidebar(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition w-full sm:w-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Location
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
            {staff.map((member) => (
              <tr key={member.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
                <td className="py-4 px-4 md:px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-base shrink-0">
                      {member.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm md:text-base font-semibold">{member.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 md:px-6 text-sm md:text-base text-gray-600">{member.role}</td>
                <td className="py-4 px-4 md:px-6 text-sm md:text-base text-gray-600">{member.email}</td>
                <td className="py-4 px-4 md:px-6 text-right">
                  <button
                    onClick={() => setStaffToDelete(member)}
                    disabled={deletingId === member.id}
                    className="text-xs md:text-sm border border-red-500 text-red-500 px-3 md:px-4 py-1.5 rounded-md hover:bg-red-50 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === member.id ? 'Deleting...' : 'Delete Location'}
                  </button>
                      {/* Confirmation Modal for Deleting Location/Staff */}
                      {staffToDelete && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
                            <div className="px-6 py-5 border-b text-center">
                              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                            </div>
                            <div className="px-6 py-4 text-center">
                              <p className="mb-4">Are you sure you want to delete <span className="font-bold">{staffToDelete.name}</span>?</p>
                              <div className="flex justify-center gap-3">
                                <button
                                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  onClick={() => setStaffToDelete(null)}
                                  disabled={deletingId === staffToDelete.id}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                  onClick={() => handleRemoveStaff(staffToDelete.id)}
                                  disabled={deletingId === staffToDelete.id}
                                >
                                  {deletingId === staffToDelete.id ? 'Deleting...' : 'Confirm'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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