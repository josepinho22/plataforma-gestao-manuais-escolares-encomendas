import React from "react";
import { useForm } from "@inertiajs/react";
import ModalShell from "@/Components/Orders/Editora/ModalShell";
import { FaSave, FaSchool } from "react-icons/fa";

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-black text-gray-900 mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

export default function NewSchoolModal({ open, onClose, concelhos = [], onCreated }) {
  const form = useForm({
    concelho_id: "",
    nome: "",
    codigo: "",
    isAtivo: true,
  });

  React.useEffect(() => {
    if (!open) return;
    form.clearErrors();
    form.setData({ concelho_id: "", nome: "", codigo: "", isAtivo: true });
  }, [open]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    form.post(route("escolas.store"), {
      preserveScroll: true,
      onSuccess: () => {
        onClose();
        onCreated?.();
      },
    });
  };

  return (
    <ModalShell title="Nova Escola" onClose={onClose} size="lg">
      <form onSubmit={submit} className="space-y-5">
        <div className="flex items-center gap-2 text-gray-900">
          <FaSchool />
          <div className="text-sm font-bold">Adicionar escola ao sistema</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome" required error={form.errors.nome}>
            <input
              value={form.data.nome}
              onChange={(e) => form.setData("nome", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
              placeholder="Ex: Escola Básica ..."
            />
          </Field>

          <Field label="Código" required error={form.errors.codigo}>
            <input
              value={form.data.codigo}
              onChange={(e) => form.setData("codigo", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
              placeholder="Ex: EB-001"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Concelho" required error={form.errors.concelho_id}>
            <select
              value={form.data.concelho_id}
              onChange={(e) => form.setData("concelho_id", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">(Sem concelho)</option>
              {concelhos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Estado" required error={form.errors.isAtivo}>
            <select
              value={form.data.isAtivo ? "1" : "0"}
              onChange={(e) => form.setData("isAtivo", e.target.value === "1")}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
            >
              <option value="1">Ativa</option>
              <option value="0">Inativa</option>
            </select>
          </Field>
        </div>

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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-black disabled:opacity-60"
          >
            <FaSave />
            Guardar
          </button>
        </div>
      </form>
    </ModalShell>
  );
}