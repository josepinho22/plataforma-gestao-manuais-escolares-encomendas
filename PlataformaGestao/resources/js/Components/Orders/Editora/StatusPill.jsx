import React from "react";

export default function StatusPill({ status }) {
  const map = {
    SOLICITADO: {
      label: "Solicitado",
      className: "border-blue-200 text-blue-700 bg-blue-50",
    },
    ENTREGA_PARCIAL: {
      label: "Entrega Parcial",
      className: "border-orange-200 text-orange-700 bg-orange-50",
    },
    ENTREGUE: {
      label: "Entregue",
      className: "border-green-200 text-green-700 bg-green-50",
    },
  };

  const s = map[status] || {
    label: status ?? "—",
    className: "border-gray-200 text-gray-700 bg-gray-50",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${s.className}`}
    >
      {s.label}
    </span>
  );
}