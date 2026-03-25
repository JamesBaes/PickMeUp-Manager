"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";
import logout from "@/app/actions/logout";

export default function LogoutButton() {
  const [showModal, setShowModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleConfirm = async () => {
    setLoggingOut(true);
    await logout();
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center cursor-pointer justify-center w-full p-3 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition relative group"
      >
        <LogOut className="w-5 h-5" />
      </button>

      {showModal && createPortal(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Log out?</h3>
              <p className="text-sm text-gray-500 mt-1">Are you sure you want to log out?</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                disabled={loggingOut}
                className="flex-1 border border-gray-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loggingOut}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Yes, log out"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
