import React from "react";
import ModalShell from "@/Components/Orders/Editora/ModalShell";

function InfoBlock({ label, value }) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
      <div className="text-xs font-bold text-gray-600 uppercase">{label}</div>
      <div className="mt-1 text-base font-black text-gray-900">{value}</div>
    </div>
  );
}

export default function ViewOrderModal({ order, onClose }) {
  if (!order) return null;

  return (
    <ModalShell title="Detalhes da Encomenda" onClose={onClose} size="lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoBlock label="Nº Encomenda" value={order.number} />
        <InfoBlock label="Editora" value={order.publisher_name} />
        <InfoBlock label="Data Pedido" value={order.requested_at} />
      </div>

      {order.notes ? (
        <div className="mt-4">
          <div className="text-xs font-bold text-gray-600 uppercase">
            Observações
          </div>
          <div className="mt-2 text-sm text-gray-800">{order.notes}</div>
        </div>
      ) : null}

      <div className="mt-6">
        <div className="text-lg font-black text-gray-900 mb-3">
          Livros da Encomenda
        </div>

        <div className="rounded-xl border border-gray-100 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 font-bold">Título</th>
                <th className="px-4 py-3 font-bold">ISBN</th>
                <th className="px-4 py-3 font-bold">Pedido</th>
                <th className="px-4 py-3 font-bold">Recebido</th>
                <th className="px-4 py-3 font-bold">Pendente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(order.lines || []).map((l) => {
                const pending = Math.max(
                  0,
                  (l.qty_ordered || 0) - (l.qty_received || 0)
                );

                return (
                  <tr key={l.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {l.title}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{l.isbn}</td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">
                      {l.qty_ordered}
                    </td>
                    <td className="px-4 py-3 text-green-700 font-bold">
                      {l.qty_received}
                    </td>
                    <td className="px-4 py-3 text-orange-600 font-bold">
                      {pending}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ModalShell>
  );
}