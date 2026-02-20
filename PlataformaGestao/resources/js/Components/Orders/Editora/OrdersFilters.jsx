import React from "react";
import { FaSearch } from "react-icons/fa";

const STATUS_OPTIONS = [
  { value: "ALL", label: "Todos os Status" },
  { value: "SOLICITADO", label: "Solicitado" },
  { value: "ENTREGA_PARCIAL", label: "Entrega Parcial" },
  { value: "ENTREGUE", label: "Entregue" },
];

export default function OrdersFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}) {
  return (
    <div className="card-3d rounded-3xl p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between animate-card-in">
      <div className="relative w-full md:flex-1">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Pesquisar por número ou editora..."
          className="glass-input w-full pl-11 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800"
        />
      </div>

      <div className="w-full md:w-64">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full glass-input rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 appearance-none"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
