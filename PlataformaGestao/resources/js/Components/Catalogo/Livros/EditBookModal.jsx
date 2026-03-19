import React from "react";
import { useForm, router } from "@inertiajs/react";
import ModalShell from "@/Components/Orders/Editora/ModalShell";

const normalizeTipo = (t) => {
  const v = String(t || "manual").trim().toLowerCase();

  if (v === "manual") return "manual";
  if (v === "caderno_atividades") return "caderno_atividades";
  if (v === "caderno de atividades") return "caderno_atividades";
  if (v === "caderno") return "caderno_atividades";

  return "manual";
};

export default function EditBookModal({
  open,
  onClose,
  book,
  filters,
  onUpdated,
}) {
  const form = useForm({
    titulo: "",
    disciplina_id: "",
    ano_escolar_id: "",
    tipo: "manual",
    preco: "",
    editora_id: "",
    isbn: "",
    codigo_interno: "",
  });

  const [isbnMatch, setIsbnMatch] = React.useState(null);
  const [isbnLoading, setIsbnLoading] = React.useState(false);
  const isbnTimerRef = React.useRef(null);

  React.useEffect(() => {
    if (!open || !book) return;

    form.setData({
      titulo: book.titulo || "",
      disciplina_id: book.disciplina_id || "",
      ano_escolar_id: book.ano_escolar_id || "",
      tipo: normalizeTipo(book.tipo),
      preco: book.preco ?? "",
      editora_id: book.editora_id || "",
      isbn: book.isbn || "",
      codigo_interno: book.codigo_interno || "",
    });
    setIsbnMatch(null);
  }, [open, book?.id]);

  const checkIsbn = async (value) => {
    if (!value || !value.trim()) return;
    setIsbnLoading(true);
    try {
      const res  = await fetch(route("catalogo.livros.checkIsbn") + "?isbn=" + encodeURIComponent(value.trim()));
      const json = await res.json();
      if (json.livro && json.livro.id !== book?.id) {
        setIsbnMatch(json.livro);
      } else {
        setIsbnMatch(null);
      }
    } catch {
      setIsbnMatch(null);
    } finally {
      setIsbnLoading(false);
    }
  };

  const handleIsbnChange = (value) => {
    form.setData("isbn", value);
    setIsbnMatch(null);
    clearTimeout(isbnTimerRef.current);
    if (!value.trim()) {
      setIsbnLoading(false);
      return;
    }
    setIsbnLoading(true);
    isbnTimerRef.current = setTimeout(() => checkIsbn(value), 500);
  };

  const handleIsbnBlur = (value) => {
    clearTimeout(isbnTimerRef.current);
    checkIsbn(value);
  };

  if (!open || !book) return null;

  const submit = (e) => {
    e.preventDefault();

    form.put(route("catalogo.livros.update", book.id), {
      preserveScroll: true,
      onSuccess: () => {
        onClose();
        onUpdated?.();
        router.reload({ only: ["livros", "stats"] });
      },
    });
  };

  return (
    <ModalShell title="Editar Livro" onClose={onClose} size="lg">
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
              onChange={(e) =>
                form.setData("disciplina_id", e.target.value)
              }
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
              onChange={(e) =>
                form.setData("ano_escolar_id", e.target.value)
              }
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
              <option value="caderno_atividades">CA</option>
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
            <p className="text-xs text-red-600 mt-1">
              {form.errors.editora_id}
            </p>
          )}
        </div>

        {/* ISBN OBRIGATÓRIO */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            ISBN <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              required
              value={form.data.isbn}
              onChange={(e) => handleIsbnChange(e.target.value)}
              onBlur={(e) => handleIsbnBlur(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
            />
            {isbnLoading && <span className="absolute right-3 top-3.5 text-gray-400 animate-spin text-xs">⟳</span>}
          </div>
          {form.errors.isbn && (
            <p className="text-xs text-red-600 mt-1">{form.errors.isbn}</p>
          )}
          {isbnMatch && !isbnMatch.deleted && (
            <div className="flex items-start gap-2 mt-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <span className="text-red-500 font-black text-sm mt-0.5">!</span>
              <p className="text-xs text-red-700 font-semibold leading-snug">
                Este ISBN já está associado ao livro <strong>"{isbnMatch.titulo}"</strong>. Não é possível usar este ISBN.
              </p>
            </div>
          )}
          {isbnMatch && isbnMatch.deleted && (
            <div className="flex items-start gap-2 mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-amber-500 font-black text-sm mt-0.5">↺</span>
              <p className="text-xs text-amber-700 font-semibold leading-snug">
                O livro <strong>"{isbnMatch.titulo}"</strong> foi anteriormente eliminado. Usar este ISBN irá restaurá-lo.
              </p>
            </div>
          )}
        </div>

        {/* Código Interno da Editora */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            Cód. Interno Editora <span className="text-gray-400 font-medium text-xs">(opcional)</span>
          </label>
          <input
            value={form.data.codigo_interno}
            onChange={(e) => form.setData("codigo_interno", e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
            placeholder="Ex: ED-2025-001"
          />
          {form.errors.codigo_interno && (
            <p className="text-xs text-red-600 mt-1">{form.errors.codigo_interno}</p>
          )}
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
            disabled={form.processing || (isbnMatch && !isbnMatch.deleted)}
            className="px-5 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-black"
          >
            Atualizar
          </button>
        </div>
      </form>
    </ModalShell>
  );
}