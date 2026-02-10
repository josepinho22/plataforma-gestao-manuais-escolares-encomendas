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
    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Editora
          </div>
          <div className="text-lg font-black text-gray-900">
            {group.publisher.name}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Total estimado
          </div>
          <div className="text-lg font-black text-gray-900">
            {formatEUR(group.total ?? 0)}
          </div>
        </div>
      </div>

      <div className="p-4 overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-600">
            <tr>
              <th className="py-2 pr-3 font-bold">Título</th>
              <th className="py-2 pr-3 font-bold">ISBN</th>
              <th className="py-2 pr-3 font-bold">Necessário</th>
              <th className="py-2 pr-3 font-bold">Preço</th>
              <th className="py-2 pr-3 font-bold">Subtotal</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {group.items.map((it) => (
              <tr key={it.id}>
                <td className="py-3 pr-3 font-semibold text-gray-900">
                  {it.title}
                </td>
                <td className="py-3 pr-3 text-gray-700">{it.isbn}</td>
                <td className="py-3 pr-3 text-gray-900 font-semibold">
                  {it.qty_needed}
                </td>
                <td className="py-3 pr-3 text-gray-700">
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
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 font-bold text-sm"
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


      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <p className="text-sm text-gray-500">
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