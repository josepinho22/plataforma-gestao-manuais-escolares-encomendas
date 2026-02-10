import React from "react";
import { FaCheckCircle, FaTruck, FaClipboardList, FaBoxOpen } from "react-icons/fa";

function StatCard({ label, value, icon, badgeColor }) {
  return (
    <div className="p-5 rounded-2xl shadow-sm border border-gray-100 bg-white flex items-center justify-between">
      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-gray-500">
          {label}
        </div>
        <div className="mt-2 text-3xl font-black text-gray-900">
          {value ?? 0}
        </div>
      </div>

      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${badgeColor}`}>
        {icon}
      </div>
    </div>
  );
}

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total de Encomendas"
        value={stats?.total}
        icon={<FaClipboardList />}
        badgeColor="bg-indigo-50 text-indigo-700"
      />
      <StatCard
        label="Solicitadas"
        value={stats?.requested}
        icon={<FaTruck />}
        badgeColor="bg-blue-50 text-blue-700"
      />
      <StatCard
        label="Entrega Parcial"
        value={stats?.partial}
        icon={<FaBoxOpen />}
        badgeColor="bg-orange-50 text-orange-700"
      />
      <StatCard
        label="Entregues"
        value={stats?.delivered}
        icon={<FaCheckCircle />}
        badgeColor="bg-green-50 text-green-700"
      />
    </div>
  );
}