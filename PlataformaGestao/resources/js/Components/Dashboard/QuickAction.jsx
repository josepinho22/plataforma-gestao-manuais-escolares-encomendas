import React from "react";
import { Link } from "@inertiajs/react";

export default function QuickAction({ icon, label, primary = false, href, onClick }) {
  const baseClass = `
    flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all
    ${primary
      ? "bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg"
      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"}
  `;

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        <span className="mr-2 text-lg">{icon}</span>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClass}>
      <span className="mr-2 text-lg">{icon}</span>
      {label}
    </button>
  );
}