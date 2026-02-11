import React from "react";
import { useForm } from "@inertiajs/react";
import ModalShell from "@/Components/Orders/Editora/ModalShell";
import { formatEUR } from "@/Components/Orders/Editora/utils";

export default function NewOrderModal({ open, onClose, preset }) {
  const form = useForm({
    publisher_id: "",
    notes: "",
    lines: [], 
  });

  React.useEffect(() => {
    if (!open) return;

    
    if (preset?.publisherId) {
      form.setData({
        publisher_id: preset.publisherId,
        notes: "",
        lines: (preset.items || []).map((it) => ({
          livro_id: it.id,
          title: it.title,
          isbn: it.isbn,
          unit_price: it.unit_price,
          qty: it.qty_needed, 
        })),
      });
    } else {
      
      form.setData({
        publisher_id: "",
        notes: "",
        lines: [],
      });
    }
    
  }, [open, preset?.publisherId]);

  if (!open) return null;

  const updateQty = (livroId, qty) => {
    const v = Math.max(0, parseInt(qty || "0", 10));
    form.setData(
      "lines",
      form.data.lines.map((l) =>
        l.livro_id === livroId ? { ...l, qty: v } : l
      )
    );
  };

  const total = (form.data.lines || []).reduce(
    (acc, l) => acc + (Number(l.unit_price || 0) * Number(l.qty || 0)),
    0
  );

  const submit = (e) => {
    e.preventDefault();

    
    const payload = {
      publisher_id: form.data.publisher_id,
      notes: form.data.notes,
      lines: (form.data.lines || [])
        .filter((l) => Number(l.qty) > 0)
        .map((l) => ({ livro_id: l.livro_id, qty: Number(l.qty) })),
    };

    form.post(route("orders.editora.store"), {
      data: payload,
      onSuccess: () => onClose(),
      preserveScroll: true,
    });
  };

  return (
    <ModalShell
      title={
        preset?.publisherName
          ? `Nova Encomenda - ${preset.publisherName}`
          : "Nova Encomenda à Editora"
      }
      onClose={onClose}
      size="lg"
    >
      <form onSubmit={submit} className="space-y-4">
        {!preset?.publisherId && (
          <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-sm text-yellow-900">
            Para carregar automaticamente os livros em falta, cria a encomenda a
            partir da secção <b>“Para encomendar”</b> (por editora).
          </div>
        )}

        <div className="rounded-xl border border-gray-100 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 font-bold">Livro</th>
                <th className="px-4 py-3 font-bold">ISBN</th>
                <th className="px-4 py-3 font-bold">Preço</th>
                <th className="px-4 py-3 font-bold">Qtd</th>
                <th className="px-4 py-3 font-bold">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(form.data.lines || []).length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={5}>
                    Sem linhas para encomendar.
                  </td>
                </tr>
              ) : (
                form.data.lines.map((l) => (
                  <tr key={l.livro_id}>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {l.title}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{l.isbn}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatEUR(l.unit_price)}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        value={l.qty}
                        onChange={(e) => updateQty(l.livro_id, e.target.value)}
                        className="w-24 py-2 px-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {formatEUR(Number(l.unit_price || 0) * Number(l.qty || 0))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Total: <b className="text-gray-900">{formatEUR(total)}</b>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={form.processing || !form.data.publisher_id}
              className="px-4 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-sm"
            >
              Criar encomenda
            </button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}