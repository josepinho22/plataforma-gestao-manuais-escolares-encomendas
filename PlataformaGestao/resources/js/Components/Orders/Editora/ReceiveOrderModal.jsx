import React from "react";
import { useForm } from "@inertiajs/react";
import { FaCheckCircle } from "react-icons/fa";
import ModalShell from "@/Components/Orders/Editora/ModalShell";

export default function ReceiveOrderModal({ order, onClose }) {
  const { data, setData, post, processing, reset } = useForm({
    order_id: order?.id ?? "",
    lines: [],
  });

  React.useEffect(() => {
    if (!order) return;
    setData({
      order_id: order.id,
      lines: (order.lines || []).map((l) => ({
        line_id: l.id,
        receive_now: 0,
      })),
    });
    
  }, [order]);

  if (!order) return null;

  const submit = (e) => {
    e.preventDefault();
    post(route("orders.editora.receive"), {
      onSuccess: () => {
        reset();
        onClose();
      },
      preserveScroll: true,
    });
  };

  const getLine = (lineId) => data.lines.find((x) => x.line_id === lineId);

  const setReceiveNow = (lineId, value, max) => {
    const v = Number.isFinite(value) ? value : 0;
    const normalized = Math.max(0, Math.min(max, v));

    setData(
      "lines",
      data.lines.map((x) =>
        x.line_id === lineId ? { ...x, receive_now: normalized } : x
      )
    );
  };

  const receiveAll = () => {
    setData(
      "lines",
      data.lines.map((x) => {
        const line = (order.lines || []).find((l) => l.id === x.line_id);
        const pending = Math.max(0, (line?.qty_ordered || 0) - (line?.qty_received || 0));
        return { ...x, receive_now: pending };
      })
    );
  };

  return (
    <ModalShell title="Receber Livros da Encomenda" onClose={onClose} size="lg">
      <div className="text-sm text-gray-500">
        <div className="font-bold text-gray-900">
          Encomenda {order.number} - {order.publisher_name}
        </div>
        <div className="mt-1">
          Insira as quantidades recebidas. O stock será atualizado
          automaticamente.
        </div>
      </div>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <div className="rounded-xl border border-gray-100 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 font-bold">Livro</th>
                <th className="px-4 py-3 font-bold">Pedido</th>
                <th className="px-4 py-3 font-bold">Já Recebido</th>
                <th className="px-4 py-3 font-bold">Pendente</th>
                <th className="px-4 py-3 font-bold">Receber Agora</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {(order.lines || []).map((l) => {
                const pending = Math.max(
                  0,
                  (l.qty_ordered || 0) - (l.qty_received || 0)
                );

                const current = getLine(l.id)?.receive_now ?? 0;

                return (
                  <tr key={l.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">
                        {l.title}
                      </div>
                      <div className="text-xs text-gray-500">{l.isbn}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {l.qty_ordered}
                    </td>
                    <td className="px-4 py-3 text-green-700 font-bold">
                      {l.qty_received}
                    </td>
                    <td className="px-4 py-3 text-orange-600 font-bold">
                      {pending}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        max={pending}
                        value={current}
                        onChange={(e) =>
                          setReceiveNow(
                            l.id,
                            parseInt(e.target.value || "0", 10),
                            pending
                          )
                        }
                        className="w-28 py-2 px-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        máx: {pending}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={receiveAll}
            className="px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm"
          >
            Receber Tudo
          </button>
          <button
            type="submit"
            disabled={processing}
            className="px-4 py-2.5 rounded-xl border border-gray-900 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm inline-flex items-center gap-2"
          >
            <FaCheckCircle />
            Confirmar Recebimento
          </button>
        </div>
      </form>
    </ModalShell>
  );
}