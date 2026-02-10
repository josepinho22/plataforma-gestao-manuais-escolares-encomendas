import { formatEUR } from "@/Components/Orders/Editora/utils";

export default function LivroCard({ livro, onEdit, onToggleActive, onDelete }) {
  const tipoNorm = String(livro.tipo || "").trim().toLowerCase();

  const isManual = tipoNorm === "manual";
  const isCaderno = tipoNorm === "caderno_atividades";
  const tipoLabel = isManual ? "Manual" : isCaderno ? "Caderno de Atividades" : "—";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-gray-900 leading-snug">
              {livro.titulo}
            </h3>

            <div className="mt-2 flex items-center gap-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-gray-200 text-xs font-bold text-gray-700 bg-white">
                {tipoLabel}
              </div>

              {!livro.ativo && (
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-red-200 text-xs font-bold text-red-700 bg-red-50">
                  Inativo
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500 font-bold uppercase">
              Preço
            </div>
            <div className="text-xl font-black text-gray-900">
              {formatEUR(livro.preco)}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Disciplina:</span>
            <span className="font-bold text-gray-900">{livro.disciplina}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ano:</span>
            <span className="font-bold text-gray-900">{livro.ano}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Editora:</span>
            <span className="font-bold text-gray-900">{livro.editora}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">ISBN:</span>
            <span className="font-bold text-gray-900">{livro.isbn}</span>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          Atualizado: {livro.updated_at}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(livro)}
          className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm"
        >
          Editar
        </button>

        <button
          type="button"
          onClick={() => onToggleActive(livro)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm"
          title={livro.ativo ? "Tornar inativo" : "Ativar"}
        >
          {livro.ativo ? "✕" : "✓"}
        </button>

        <button
          type="button"
          onClick={() => onDelete(livro)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm"
          title="Eliminar"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
