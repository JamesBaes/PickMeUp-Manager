"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";
import logout from "@/app/actions/logout";
import ConfirmModal from "@/components/ui/ConfirmModal";

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
        <ConfirmModal
          title="Log out?"
          message="Are you sure you want to log out?"
          confirmLabel={loggingOut ? "Logging out..." : "Yes, log out"}
          confirming={loggingOut}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />,
        document.body
      )}
    </>
  );
}
