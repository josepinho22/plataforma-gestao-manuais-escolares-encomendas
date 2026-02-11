import React from "react";
import { useForm } from "@inertiajs/react";
import ModalShell from "@/Components/Orders/Editora/ModalShell";

export default function EditSchoolModal({ open, onClose, school, concelhos = [], onUpdated }) {
  const form = useForm({
    concelho_id: "",
    nome: "",
    codigo: "",
    isAtivo: true,
  });

  React.useEffect(() => {
    if (!open || !school) return;

    form.setData({
      concelho_id: school.concelho_id ?? "",
      nome: school.nome ?? "",
      codigo: school.codigo ?? "",
      isAtivo: !!school.isAtivo,
    });

  }, [open, school?.id]);

  if (!open || !school) return null;

  const submit = (e) => {
    e.preventDefault();

    form.put(route("escolas.update", school.id), {
      preserveScroll: true,
      onSuccess: () => {
        onClose();
        onUpdated?.();
      },
    });
  };

  return (
    <ModalShell title="Editar Escola" onClose={onClose} size="lg">
      <form onSubmit={submit} className="space-y-5">
        {/* Nome */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            Nome <span className="text-red-600">*</span>
          </label>
          <input
            value={form.data.nome}
            onChange={(e) => form.setData("nome", e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
            placeholder="Ex: Escola Básica ..."
          />
          {form.errors.nome && (
            <p className="text-xs text-red-600 mt-1">{form.errors.nome}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Código */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2">
              Código <span className="text-red-600">*</span>
            </label>
            <input
              value={form.data.codigo}
              onChange={(e) => form.setData("codigo", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
              placeholder="Ex: EB-001"
            />
            {form.errors.codigo && (
              <p className="text-xs text-red-600 mt-1">{form.errors.codigo}</p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2">
              Estado <span className="text-red-600">*</span>
            </label>
            <select
              value={form.data.isAtivo ? "1" : "0"}
              onChange={(e) => form.setData("isAtivo", e.target.value === "1")}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
            >
              <option value="1">Ativa</option>
              <option value="0">Inativa</option>
            </select>
            {form.errors.isAtivo && (
              <p className="text-xs text-red-600 mt-1">{form.errors.isAtivo}</p>
            )}
          </div>
        </div>

        {/* Concelho */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            Concelho
          </label>
          <select
            value={form.data.concelho_id}
            onChange={(e) => form.setData("concelho_id", e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">(Sem concelho)</option>
            {(concelhos || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
          {form.errors.concelho_id && (
            <p className="text-xs text-red-600 mt-1">{form.errors.concelho_id}</p>
          )}
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-black"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={form.processing}
            className="px-5 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-black"
          >
            Atualizar
          </button>
        </div>
      </form>
    </ModalShell>
  );
}