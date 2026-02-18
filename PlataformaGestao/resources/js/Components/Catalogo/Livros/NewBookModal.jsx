import React from "react";
import { useForm } from "@inertiajs/react";
import ModalShell from "@/Components/Orders/Editora/ModalShell";

export default function NewBookModal({ open, onClose, filters }) {
  const form = useForm({
    titulo: "",
    disciplina_id: "",
    ano_escolar_id: "",
    tipo: "manual",
    preco: "",
    editora_id: "",
    isbn: "",
    ativo: true,
  });

  React.useEffect(() => {
    if (!open) return;

    form.reset();
    form.clearErrors();
    form.setData({
      titulo: "",
      disciplina_id: "",
      ano_escolar_id: "",
      tipo: "manual",
      preco: "",
      editora_id: "",
      isbn: "",
      ativo: true,
    });
  }, [open]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();

    form.post(route("catalogo.livros.store"), {
      preserveScroll: true,
      onSuccess: () => onClose(),
      onError: () => {
 
      },
    });
  };

  return (
    <ModalShell title="Novo Livro" onClose={onClose} size="lg">
      <form onSubmit={submit} className="space-y-5">
        {/* Título */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            Título <span className="text-red-600">*</span>
          </label>
          <input
            required
            value={form.data.titulo}
            onChange={(e) => form.setData("titulo", e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
            placeholder="Ex: Português 5 - Manual"
          />
          {form.errors.titulo && (
            <p className="text-xs text-red-600 mt-1">{form.errors.titulo}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Disciplina */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2">
              Disciplina <span className="text-red-600">*</span>
            </label>
            <select
              required
              value={form.data.disciplina_id}
              onChange={(e) => form.setData("disciplina_id", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Selecionar...</option>
              {(filters?.disciplinas || []).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </select>
            {form.errors.disciplina_id && (
              <p className="text-xs text-red-600 mt-1">
                {form.errors.disciplina_id}
              </p>
            )}
          </div>

          {/* Ano Escolar */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2">
              Ano Escolar <span className="text-red-600">*</span>
            </label>
            <select
              required
              value={form.data.ano_escolar_id}
              onChange={(e) => form.setData("ano_escolar_id", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Selecionar...</option>
              {(filters?.anos || []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label ?? a.nome ?? a.ano ?? a.id}
                </option>
              ))}
            </select>
            {form.errors.ano_escolar_id && (
              <p className="text-xs text-red-600 mt-1">
                {form.errors.ano_escolar_id}
              </p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2">
              Tipo <span className="text-red-600">*</span>
            </label>
            <select
              required
              value={form.data.tipo}
              onChange={(e) => form.setData("tipo", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
            >
              <option value="manual">Manual</option>
              <option value="caderno_atividades">Caderno de Atividades</option>
            </select>
            {form.errors.tipo && (
              <p className="text-xs text-red-600 mt-1">{form.errors.tipo}</p>
            )}
          </div>

          {/* Preço */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2">
              Preço (€) <span className="text-red-600">*</span>
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.data.preco}
              onChange={(e) => form.setData("preco", e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
            />
            {form.errors.preco && (
              <p className="text-xs text-red-600 mt-1">{form.errors.preco}</p>
            )}
          </div>
        </div>

        {/* Editora */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            Editora <span className="text-red-600">*</span>
          </label>
          <select
            required
            value={form.data.editora_id}
            onChange={(e) => form.setData("editora_id", e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Selecionar...</option>
            {(filters?.editoras || []).map((ed) => (
              <option key={ed.id} value={ed.id}>
                {ed.nome}
              </option>
            ))} 
          </select>
          {form.errors.editora_id && (
            <p className="text-xs text-red-600 mt-1">{form.errors.editora_id}</p>
          )}
        </div>

        {/* ISBN */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            ISBN <span className="text-red-600">*</span>
          </label>
          <input
            required
            value={form.data.isbn}
            onChange={(e) => form.setData("isbn", e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
            placeholder="Ex: 978-..."
          />
          {form.errors.isbn && (
            <p className="text-xs text-red-600 mt-1">{form.errors.isbn}</p>
          )}
        </div>

        {/* Ativo */}
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <input
            type="checkbox"
            checked={!!form.data.ativo}
            onChange={(e) => form.setData("ativo", e.target.checked)}
            className="rounded border-gray-300"
          />
          Livro ativo
        </label>

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
            className={`px-5 py-2.5 rounded-xl text-white font-black ${
              form.processing ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
            }`}
          >
            {form.processing ? "A criar..." : "Criar"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
} 