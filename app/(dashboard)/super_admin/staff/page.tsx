'use client'

import React, { useState } from "react";

const initialStaff = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Manager",
    email: "alice@company.com",
    active: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    role: "Barista",
    email: "bob@company.com",
    active: true,
  },
  {
    id: 3,
    name: "Carol Lee",
    role: "Cashier",
    email: "carol@company.com",
    active: true,
  },
];

function AddIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function BlockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 7l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function StaffPage() {
  const [staff, setStaff] = useState(initialStaff);

  const handleDeactivate = (id: any) => {
    setStaff((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, active: false } : member
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Staff Members</h1>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow transition">
          <AddIcon />
          Add Staff
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left font-semibold bg-gray-50">Avatar</th>
              <th className="py-3 px-4 text-left font-semibold bg-gray-50">Name</th>
              <th className="py-3 px-4 text-left font-semibold bg-gray-50">Role</th>
              <th className="py-3 px-4 text-left font-semibold bg-gray-50">Email</th>
              <th className="py-3 px-4 text-left font-semibold bg-gray-50">Status</th>
              <th className="py-3 px-4 text-right font-semibold bg-gray-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id} className="border-b last:border-b-0">
                <td className="py-3 px-4">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-lg">
                    {member.name[0]}
                  </div>
                </td>
                <td className="py-3 px-4">{member.name}</td>
                <td className="py-3 px-4">{member.role}</td>
                <td className="py-3 px-4">{member.email}</td>
                <td className="py-3 px-4">
                  <span className={member.active ? "text-green-600 font-semibold" : "text-gray-400 font-semibold"}>
                    {member.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    className={`flex items-center gap-1 border border-red-600 text-red-600 px-3 py-1.5 rounded-md font-medium text-sm transition hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={!member.active}
                    onClick={() => handleDeactivate(member.id)}
                  >
                    <BlockIcon />
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}