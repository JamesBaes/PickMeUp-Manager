"use client";
import React, { useState, useEffect } from "react";
import { fetchStaff, deactivateStaff, addStaff } from "./staffApi";

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
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  useEffect(() => {
    if (!pendingSubmit) return
    const t = setTimeout(() => setPendingSubmit(false), 3000)
    return () => clearTimeout(t)
  }, [pendingSubmit])

  useEffect(() => {
    const loadStaff = async () => {
      const data = await fetchStaff();
      if (data) setStaff(data);
    };
    loadStaff();
  }, []);

  const handleRemoveStaff = async (id: string) => {
    setDeletingId(id);
    const success = await deactivateStaff(id);
    if (success) {
      setStaff((prev) => prev.filter((member) => member.id !== id));
    }
    setDeletingId(null);
  };

  const handleAddStaff = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    // restaurant_id is automatically scoped server-side to the admin's restaurant
    const result = await addStaff(form.name, form.email);
    if (result) {
      setStaff((prev) => [...prev, result]);
    }

    setForm({ name: "", email: "" });
    setShowSidebar(false);
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 py-4 px-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Staff Management</h1>
          <p className="text-sm text-gray-400">{staff.length} {staff.length === 1 ? 'member' : 'members'}</p>
        </div>
        <button
          onClick={() => setShowSidebar(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition w-full sm:w-auto"
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
            <tr className="border-b border-gray-100">
              <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">Name</th>
              <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">Role</th>
              <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">Email</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-sm text-gray-400">
                  No staff members yet
                </td>
              </tr>
            ) : (
              staff.map((member) => (
                <tr key={member.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
                  <td className="py-4 px-4 md:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-base shrink-0">
                        {member.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <span className="text-sm font-semibold">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 md:px-6 text-sm text-gray-600">{member.role}</td>
                  <td className="py-4 px-4 md:px-6 text-sm text-gray-600">{member.email}</td>
                  <td className="py-4 px-4 md:px-6 text-right">
                    <button
                      onClick={() => setConfirmRemoveId(member.id)}
                      disabled={deletingId === member.id}
                      className="text-xs border border-red-500 text-red-500 px-3 py-1.5 rounded-md hover:bg-red-50 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === member.id ? 'Removing...' : 'Remove'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Remove Confirmation Modal */}
      {confirmRemoveId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Remove staff member?</h3>
              <p className="text-sm text-gray-500 mt-1">This will revoke their access immediately. This action cannot be undone.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmRemoveId(null)}
                className="flex-1 border border-gray-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => { await handleRemoveStaff(confirmRemoveId); setConfirmRemoveId(null) }}
                disabled={deletingId === confirmRemoveId}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {deletingId === confirmRemoveId ? 'Removing...' : 'Yes, remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Drawer */}
      {showSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
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
                  type="button"
                  onClick={(e) => {
                    if (!pendingSubmit) { setPendingSubmit(true); return }
                    setPendingSubmit(false)
                    handleAddStaff(e)
                  }}
                  className={`flex-1 text-white text-sm font-medium px-4 py-2 rounded-lg transition ${
                    pendingSubmit ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {pendingSubmit ? 'Confirm?' : 'Add Staff'}
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