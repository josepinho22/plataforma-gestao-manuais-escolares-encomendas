import React from "react";
import { FaEye, FaInbox } from "react-icons/fa";
import StatusPill from "@/Components/Orders/Editora/StatusPill";
import { formatEUR } from "@/Components/Orders/Editora/utils";

function EmptyState({ title, desc }) {
  return (
    <div className="text-center py-6">
      <div className="text-base font-black text-gray-900">{title}</div>
      <div className="text-sm text-gray-500 mt-1">{desc}</div>
    </div>
  );
}

export default function OrdersHistoryTable({ orders, onView, onReceive }) {
  return (
    <div>
      <h2 className="text-4xl font-black text-gray-900 leading-tight">
        Histórico de
        <br />
        encomendas
      </h2>

      <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3 font-bold">Nº Encomenda</th>
                <th className="px-4 py-3 font-bold">Editora</th>
                <th className="px-4 py-3 font-bold">Itens</th>
                <th className="px-4 py-3 font-bold">Data Pedido</th>
                <th className="px-4 py-3 font-bold">Entrega Prevista</th>
                <th className="px-4 py-3 font-bold">Total</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {(orders || []).length === 0 ? (
                <tr>
                  <td className="px-4 py-8" colSpan={8}>
                    <EmptyState
                      title="Sem resultados"
                      desc="Tenta ajustar a pesquisa ou o filtro."
                    />
                  </td>
                </tr>
              ) : (
                (orders || []).map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {o.number}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {o.publisher_name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {(o.lines || []).length} livro(s)
                    </td>
                    <td className="px-4 py-3 text-gray-700">{o.requested_at}</td>
                    <td className="px-4 py-3 text-gray-700">{o.expected_at}</td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">
                      {formatEUR(o.total)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onView(o)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs"
                        >
                          <FaEye />
                          Ver
                        </button>

                        {o.status !== "ENTREGUE" && (
                          <button
                            onClick={() => onReceive(o)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black hover:bg-gray-800 text-white font-bold text-xs"
                          >
                            <FaInbox />
                            Receber
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}