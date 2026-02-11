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
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
      <div className="relative w-full md:flex-1">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Pesquisar por número ou editora..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
        />
      </div>

      <div className="w-full md:w-64">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full py-3 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
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