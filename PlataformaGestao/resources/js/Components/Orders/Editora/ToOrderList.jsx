import React from "react";
import { FaPlus, FaTruck } from "react-icons/fa";
import { formatEUR } from "@/Components/Orders/Editora/utils";

function EmptyState({ title, desc }) {
  return (
    <div className="text-center py-8">
      <div className="text-base font-black text-gray-900">{title}</div>
      <div className="text-sm text-gray-500 mt-1">{desc}</div>
    </div>
  );
}

function PublisherNeedCard({ group, onCreate }) {
  return (
    <div className="card-3d rounded-2xl overflow-hidden animate-card-in">
      <div className="flex items-center justify-between p-4 border-b border-white/40">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
            Editora
          </div>
          <div className="text-lg font-black text-gray-900">
            {group.publisher.name}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
            Total estimado
          </div>
          <div className="text-lg font-black text-gray-900">
            {formatEUR(group.total ?? 0)}
          </div>
        </div>
      </div>

      <div className="p-4 overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">
            <tr>
              <th className="py-2 pr-3">Título</th>
              <th className="py-2 pr-3">ISBN</th>
              <th className="py-2 pr-3">Necessário</th>
              <th className="py-2 pr-3">Preço</th>
              <th className="py-2 pr-3">Subtotal</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100/60">
            {group.items.map((it) => (
              <tr key={it.id} className="hover:bg-indigo-50/10">
                <td className="py-3 pr-3 font-semibold text-gray-900">
                  {it.title}
                </td>
                <td className="py-3 pr-3 text-gray-600">{it.isbn}</td>
                <td className="py-3 pr-3 text-gray-900 font-semibold">
                  {it.qty_needed}
                </td>
                <td className="py-3 pr-3 text-gray-600">
                  {formatEUR(it.unit_price)}
                </td>
                <td className="py-3 pr-3 text-gray-900 font-semibold">
                  {formatEUR((it.unit_price || 0) * (it.qty_needed || 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => onCreate?.(group)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 active:scale-[0.97]"
          >
            Criar encomenda desta editora <FaTruck />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ToOrderList({ groups, onNewOrder, onCreateForPublisher }) {
  return (
    <div className="space-y-4">

      <div className="card-3d rounded-3xl overflow-hidden animate-card-in">
        <div className="px-5 py-4 border-b border-white/40">
          <p className="text-xs text-gray-400 font-medium">
            Lista de livros necessários, agrupada por editora.
          </p>
        </div>

        <div className="p-5 space-y-6">
          {(groups || []).length === 0 ? (
            <EmptyState
              title="Nada para encomendar"
              desc="Quando existirem necessidades por editora, aparecem aqui."
            />
          ) : (
            (groups || []).map((group) => (
              <PublisherNeedCard
                key={group.publisher.id}
                group={group}
                onCreate={onCreateForPublisher}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}