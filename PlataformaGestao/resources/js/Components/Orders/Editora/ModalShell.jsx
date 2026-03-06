import React from "react";
import { FaTimes } from "react-icons/fa";

export default function ModalShell({ title, children, onClose, size = "md" }) {
  const sizeClass =
    size === "3xl" ? "max-w-6xl" :
    size === "lg" ? "max-w-4xl" :
    size === "sm" ? "max-w-lg" :
    "max-w-2xl";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${sizeClass} bg-white rounded-2xl shadow-xl border border-gray-100 max-h-[90vh] flex flex-col`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <div className="text-lg font-black text-gray-900">{title}</div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
            aria-label="Fechar"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
