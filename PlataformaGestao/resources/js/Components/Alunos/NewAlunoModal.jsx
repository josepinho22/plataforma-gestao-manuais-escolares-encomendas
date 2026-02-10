import React from "react";
import { useForm } from "@inertiajs/react";
import ModalShell from "@/Components/Orders/Editora/ModalShell";

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

export default function NewAlunoModal({ open, onClose }) {
  const form = useForm({
    nome: "",
    nif: "",
    telefone: "",
    email: "",
    id_mega: "",
    numero_cliente: "",
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset();
    form.clearErrors();
  }, [open]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    form.post(route("alunos.store"), {
      preserveScroll: true,
      onSuccess: () => onClose(),
    });
  };

  return (
    <ModalShell title="Novo Aluno" onClose={onClose} size="lg">
      <form onSubmit={submit} className="space-y-5">
        <Field label="Nome" required error={form.errors.nome}>
          <input
            value={form.data.nome}
            onChange={(e) => form.setData("nome", e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
            placeholder="Ex: João Silva"
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="NIF" required error={form.errors.nif}>
            <input
              value={form.data.nif}
              onChange={(e) => form.setData("nif", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
              placeholder="Ex: 123456789"
            />
          </Field>

          <Field label="Telefone" error={form.errors.telefone}>
            <input
              value={form.data.telefone}
              onChange={(e) => form.setData("telefone", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
              placeholder="Ex: 912345678"
            />
          </Field>

          <Field label="Email" error={form.errors.email}>
            <input
              type="email"
              value={form.data.email}
              onChange={(e) => form.setData("email", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
              placeholder="Ex: aluno@email.com"
            />
          </Field>

          <Field label="ID Mega" error={form.errors.id_mega}>
            <input
              value={form.data.id_mega}
              onChange={(e) => form.setData("id_mega", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
              placeholder="Ex: MEGA-001"
            />
          </Field>

          <Field label="Nº Cliente" error={form.errors.numero_cliente}>
            <input
              value={form.data.numero_cliente}
              onChange={(e) => form.setData("numero_cliente", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
              placeholder="Ex: C-000123"
            />
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
            className="px-5 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-black"
          >
            Criar Aluno
          </button>
        </div>
      </form>
    </ModalShell>
  );
}