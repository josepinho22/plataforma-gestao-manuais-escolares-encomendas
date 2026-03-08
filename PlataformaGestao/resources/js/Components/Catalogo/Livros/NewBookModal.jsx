import React from "react";
import { useForm } from "@inertiajs/react";
import ModalShell from "@/Components/Orders/Editora/ModalShell";
import { FaPlus, FaLink, FaBook, FaCheck } from "react-icons/fa";
 
const normalizeTipo = (t) => {
  const v = String(t || "manual").trim().toLowerCase();
  if (v === "caderno_atividades" || v === "caderno de atividades" || v === "caderno") return "caderno_atividades";
  return "manual";
};
 
export default function NewBookModal({ open, onClose, filters, onCreated }) {
  // Estado para controlar se estamos a criar um combo
  const [isCombo, setIsCombo] = React.useState(false);
 
  const form = useForm({
    // Dados do Manual
    titulo: "",
    disciplina_id: "",
    ano_escolar_id: "",
    tipo: "manual",
    preco: "",
    editora_id: "",
    isbn: "",
    codigo_interno: "",
    ativo: true,

    // Dados do Caderno (Enviados apenas se isCombo for true)
    vincular_ca: false,
    ca_titulo: "",
    ca_isbn: "",
    ca_preco: "",
    ca_codigo_interno: "",
  });
 
  const [isbnMatch, setIsbnMatch] = React.useState(null);
  const [isbnLoading, setIsbnLoading] = React.useState(false);
  const isbnTimerRef = React.useRef(null);

  const [caIsbnMatch, setCaIsbnMatch] = React.useState(null);
  const [caIsbnLoading, setCaIsbnLoading] = React.useState(false);
  const caIsbnTimerRef = React.useRef(null);

  // Reset ao fechar/abrir
  React.useEffect(() => {
    if (!open) return;
    form.reset();
    setIsCombo(false);
    setIsbnMatch(null);
    setCaIsbnMatch(null);
  }, [open]);

  // Sincroniza o estado do combo com o form data
  React.useEffect(() => {
    form.setData((prev) => ({
      ...prev,
      vincular_ca: isCombo,
      // Quando ativa combo, força tipo para "manual"
      tipo: isCombo ? "manual" : prev.tipo,
    }));
  }, [isCombo]);

  const checkIsbn = async (value) => {
    if (!value || !value.trim()) return;
    setIsbnLoading(true);
    try {
      const res  = await fetch(route("catalogo.livros.checkIsbn") + "?isbn=" + encodeURIComponent(value.trim()));
      const json = await res.json();
      if (json.livro) {
        setIsbnMatch(json.livro);
        // Só preenche os campos se o livro estiver eliminado (vai ser restaurado)
        if (json.livro.deleted) {
          form.setData((prev) => ({
            ...prev,
            titulo:         json.livro.titulo        ?? prev.titulo,
            disciplina_id:  json.livro.disciplina_id ?? prev.disciplina_id,
            ano_escolar_id: json.livro.ano_escolar_id ?? prev.ano_escolar_id,
            editora_id:     json.livro.editora_id    ?? prev.editora_id,
            tipo:           normalizeTipo(json.livro.tipo),
            preco:          json.livro.preco !== undefined ? String(json.livro.preco) : prev.preco,
            ca_titulo:      prev.ca_titulo || `Caderno de Atividades: ${json.livro.titulo ?? ""}`,
          }));
        }
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

  const checkCaIsbn = async (value) => {
    if (!value || !value.trim()) return;
    if (form.data.isbn.trim() && value.trim() === form.data.isbn.trim()) return;
    setCaIsbnLoading(true);
    try {
      const res  = await fetch(route("catalogo.livros.checkIsbn") + "?isbn=" + encodeURIComponent(value.trim()));
      const json = await res.json();
      if (json.livro) {
        setCaIsbnMatch(json.livro);
        // Só pré-preenche se for um CA eliminado (não um manual)
        if (json.livro.deleted && normalizeTipo(json.livro.tipo) === "caderno_atividades") {
          form.setData((prev) => ({
            ...prev,
            ca_titulo: json.livro.titulo ?? prev.ca_titulo,
            ca_preco:  json.livro.preco !== undefined ? String(json.livro.preco) : prev.ca_preco,
          }));
        }
      } else {
        setCaIsbnMatch(null);
      }
    } catch {
      setCaIsbnMatch(null);
    } finally {
      setCaIsbnLoading(false);
    }
  };

  const handleCaIsbnChange = (value) => {
    form.setData("ca_isbn", value);
    setCaIsbnMatch(null);
    clearTimeout(caIsbnTimerRef.current);
    if (!value.trim() || (form.data.isbn.trim() && value.trim() === form.data.isbn.trim())) {
      setCaIsbnLoading(false);
      return;
    }
    setCaIsbnLoading(true);
    caIsbnTimerRef.current = setTimeout(() => checkCaIsbn(value), 500);
  };

  const handleCaIsbnBlur = (value) => {
    clearTimeout(caIsbnTimerRef.current);
    checkCaIsbn(value);
  };
 
  const submit = (e) => {
    e.preventDefault();
    form.post(route("catalogo.livros.store"), {
      preserveScroll: true,
      onSuccess: () => {
        form.reset();
        setIsCombo(false);
        setIsbnMatch(null);
        onCreated?.();
        onClose();
      },
    });
  };

  if (!open) return null;

  return (
    <ModalShell title={isCombo ? "Criar Manual + Caderno" : "Novo Livro"} onClose={onClose} size={isCombo ? "3xl" : "lg"}>
      <form onSubmit={submit} className="space-y-6">
       
        {/* Toggle para Modo Combo */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isCombo ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <FaLink />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">Vincular Caderno de Atividades?</p>
              <p className="text-xs text-gray-500 font-medium">Crie ambos os registos de uma só vez.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCombo(!isCombo)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isCombo ? 'bg-black' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isCombo ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
 
        <div className={`grid grid-cols-1 ${isCombo ? 'lg:grid-cols-2' : ''} gap-8`}>
         
          {/* COLUNA 1: Livro (Manual em modo combo) */}
          <div className="space-y-4">
            {/* Cabeçalho só aparece em modo combo */}
            {isCombo && (
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                <FaBook /> Dados do Manual
              </h3>
            )}
           
            {/* ISBN */}
            <div>
              <label className="block text-xs font-black text-gray-700 mb-1 ml-1">
                {isCombo ? 'ISBN MANUAL *' : 'ISBN *'}
              </label>
              <div className="relative">
                <input
                  required
                  value={form.data.isbn}
                  onChange={(e) => handleIsbnChange(e.target.value)}
                  onBlur={(e) => handleIsbnBlur(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-black outline-none"
                  placeholder={isCombo ? "ISBN do Manual" : "ISBN"}
                />
                {isbnLoading && <span className="absolute right-3 top-3 text-gray-400 animate-spin text-xs">⟳</span>}
              </div>
              {form.errors.isbn && <p className="text-xs text-red-600 mt-1">{form.errors.isbn}</p>}
              {isCombo && form.data.isbn.trim() && form.data.ca_isbn.trim() && form.data.isbn.trim() === form.data.ca_isbn.trim() && (
                <div className="flex items-start gap-2 mt-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <span className="text-red-500 font-black text-sm mt-0.5">!</span>
                  <p className="text-xs text-red-700 font-semibold leading-snug">
                    O ISBN do Manual não pode ser igual ao ISBN do Caderno de Atividades.
                  </p>
                </div>
              )}
              {isbnMatch && !isbnMatch.deleted && (
                <div className="flex items-start gap-2 mt-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <span className="text-red-500 font-black text-sm mt-0.5">!</span>
                  <p className="text-xs text-red-700 font-semibold leading-snug">
                    Este ISBN já está associado ao livro <strong>"{isbnMatch.titulo}"</strong>. Não é possível criar um livro com este ISBN.
                  </p>
                </div>
              )}
              {isbnMatch && isbnMatch.deleted && (
                <div className="flex items-start gap-2 mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-amber-500 font-black text-sm mt-0.5">↺</span>
                  <p className="text-xs text-amber-700 font-semibold leading-snug">
                    O livro <strong>"{isbnMatch.titulo}"</strong> foi anteriormente eliminado e será restaurado com os novos dados.
                  </p>
                </div>
              )}
            </div>
 
            {/* Título */}
            <div>
              <label className="block text-xs font-black text-gray-700 mb-1 ml-1">TÍTULO *</label>
              <input
                required
                value={form.data.titulo}
                onChange={(e) => form.setData("titulo", e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold"
                placeholder="Ex: Português 5 - Manual"
              />
              {form.errors.titulo && <p className="text-xs text-red-600 mt-1">{form.errors.titulo}</p>}
            </div>

            {/* Código Interno da Editora */}
            <div>
              <label className="block text-xs font-black text-gray-700 mb-1 ml-1">
                {isCombo ? 'CÓD. INTERNO EDITORA (MANUAL)' : 'CÓD. INTERNO EDITORA'}
                <span className="ml-1 text-gray-400 font-medium">(opcional)</span>
              </label>
              <input
                value={form.data.codigo_interno}
                onChange={(e) => form.setData("codigo_interno", e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold"
                placeholder="Ex: ED-2025-001"
              />
              {form.errors.codigo_interno && <p className="text-xs text-red-600 mt-1">{form.errors.codigo_interno}</p>}
            </div>
 
            {/* Tipo - só aparece quando NÃO está em modo combo */}
            {!isCombo && (
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1 ml-1">TIPO *</label>
                <select
                  required
                  value={form.data.tipo}
                  onChange={(e) => form.setData("tipo", e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-black outline-none"
                >
                  {(filters?.tipos || [
                    { value: 'manual', label: 'Manual' },
                    { value: 'caderno_atividades', label: 'CA' }
                  ]).map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                {form.errors.tipo && <p className="text-xs text-red-600 mt-1">{form.errors.tipo}</p>}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1 ml-1">
                  {isCombo ? 'PREÇO MANUAL (€) *' : 'PREÇO (€) *'}
                </label>
                <input
                  required
                  type="number" step="0.01"
                  value={form.data.preco}
                  onChange={(e) => form.setData("preco", e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold"
                />
                {form.errors.preco && <p className="text-xs text-red-600 mt-1">{form.errors.preco}</p>}
              </div>
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1 ml-1">EDITORA *</label>
                <select
                  required
                  value={form.data.editora_id}
                  onChange={(e) => form.setData("editora_id", e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold"
                >
                  <option value="">Selecione a editora...</option>
                  {(filters?.editoras || []).map(ed => <option key={ed.id} value={ed.id}>{ed.nome}</option>)}
                </select>
                {form.errors.editora_id && <p className="text-xs text-red-600 mt-1">{form.errors.editora_id}</p>}
              </div>
            </div>
 
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-xs font-black text-gray-700 mb-1 ml-1">DISCIPLINA *</label>
                <select
                  required
                  value={form.data.disciplina_id}
                  onChange={(e) => form.setData("disciplina_id", e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold"
                >
                  <option value="">Selecione a disciplina...</option>
                  {(filters?.disciplinas || []).map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                </select>
                {form.errors.disciplina_id && <p className="text-xs text-red-600 mt-1">{form.errors.disciplina_id}</p>}
              </div>
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1 ml-1">ANO *</label>
                <select
                  required
                  value={form.data.ano_escolar_id}
                  onChange={(e) => form.setData("ano_escolar_id", e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold"
                >
                  <option value="">Selecione o ano...</option>
                  {(filters?.anos || []).map(a => <option key={a.id} value={a.id}>{a.label ?? a.nome}</option>)}
                </select>
                {form.errors.ano_escolar_id && <p className="text-xs text-red-600 mt-1">{form.errors.ano_escolar_id}</p>}
              </div>
            </div>
          </div>
 
          {/* COLUNA 2: CADERNO DE ATIVIDADES (Visível apenas em combo) */}
          {isCombo && (
            <div className="space-y-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-xs font-black text-blue-800 uppercase tracking-widest flex items-center gap-2">
                <FaPlus className="text-blue-500" /> Caderno de Atividades
              </h3>
 
              <div>
                <label className="block text-xs font-black text-blue-900 mb-1 ml-1">ISBN DO CADERNO *</label>
                <div className="relative">
                  <input
                    required={isCombo}
                    value={form.data.ca_isbn}
                    onChange={(e) => handleCaIsbnChange(e.target.value)}
                    onBlur={(e) => handleCaIsbnBlur(e.target.value)}
                    className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="ISBN do Caderno"
                  />
                  {caIsbnLoading && <span className="absolute right-3 top-3 text-gray-400 animate-spin text-xs">⟳</span>}
                </div>
                {form.errors.ca_isbn && <p className="text-xs text-red-600 mt-1">{form.errors.ca_isbn}</p>}
                {form.data.ca_isbn.trim() && form.data.isbn.trim() && form.data.ca_isbn.trim() === form.data.isbn.trim() && (
                  <div className="flex items-start gap-2 mt-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <span className="text-red-500 font-black text-sm mt-0.5">!</span>
                    <p className="text-xs text-red-700 font-semibold leading-snug">
                      O ISBN do Caderno não pode ser igual ao ISBN do Manual.
                    </p>
                  </div>
                )}
                {caIsbnMatch && normalizeTipo(caIsbnMatch.tipo) === "manual" && (
                  <div className="flex items-start gap-2 mt-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <span className="text-red-500 font-black text-sm mt-0.5">!</span>
                    <p className="text-xs text-red-700 font-semibold leading-snug">
                      Este ISBN pertence a um <strong>Manual</strong> ("{caIsbnMatch.titulo}"). Não é possível vinculá-lo como Caderno de Atividades.
                    </p>
                  </div>
                )}
                {caIsbnMatch && normalizeTipo(caIsbnMatch.tipo) === "caderno_atividades" && !caIsbnMatch.deleted && (
                  <div className="flex items-start gap-2 mt-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <span className="text-red-500 font-black text-sm mt-0.5">!</span>
                    <p className="text-xs text-red-700 font-semibold leading-snug">
                      Este ISBN já está associado ao caderno <strong>"{caIsbnMatch.titulo}"</strong>. Não é possível criar um caderno com este ISBN.
                    </p>
                  </div>
                )}
                {caIsbnMatch && normalizeTipo(caIsbnMatch.tipo) === "caderno_atividades" && caIsbnMatch.deleted && (
                  <div className="flex items-start gap-2 mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-amber-500 font-black text-sm mt-0.5">↺</span>
                    <p className="text-xs text-amber-700 font-semibold leading-snug">
                      O caderno <strong>"{caIsbnMatch.titulo}"</strong> foi anteriormente eliminado e será restaurado com os novos dados.
                    </p>
                  </div>
                )}
              </div>
 
              <div>
                <label className="block text-xs font-black text-blue-900 mb-1 ml-1">TÍTULO DO CADERNO *</label>
                <input
                  required={isCombo}
                  value={form.data.ca_titulo}
                  onChange={(e) => form.setData("ca_titulo", e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {form.errors.ca_titulo && <p className="text-xs text-red-600 mt-1">{form.errors.ca_titulo}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-blue-900 mb-1 ml-1">PREÇO DO CADERNO (€) *</label>
                <input
                  required={isCombo}
                  type="number" step="0.01"
                  value={form.data.ca_preco}
                  onChange={(e) => form.setData("ca_preco", e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {form.errors.ca_preco && <p className="text-xs text-red-600 mt-1">{form.errors.ca_preco}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-blue-900 mb-1 ml-1">
                  CÓD. INTERNO EDITORA (CADERNO)
                  <span className="ml-1 text-blue-400 font-medium">(opcional)</span>
                </label>
                <input
                  value={form.data.ca_codigo_interno}
                  onChange={(e) => form.setData("ca_codigo_interno", e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: ED-2025-002"
                />
                {form.errors.ca_codigo_interno && <p className="text-xs text-red-600 mt-1">{form.errors.ca_codigo_interno}</p>}
              </div>

              <div className="p-3 bg-white/60 rounded-xl border border-blue-100 mt-4">
                <p className="text-[10px] text-blue-600 font-bold leading-tight">
                  Nota: A disciplina, o ano e a editora serão herdados automaticamente do manual.
                </p>
              </div>
            </div>
          )}
        </div>
 
        {/* Footer Ações */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-black text-gray-500 hover:bg-gray-100 rounded-xl transition">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={form.processing || (isCombo && form.data.isbn.trim() && form.data.ca_isbn.trim() && form.data.isbn.trim() === form.data.ca_isbn.trim())}
            className="px-8 py-2.5 bg-black text-white text-sm font-black rounded-xl hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
          >
            {form.processing ? "A Guardar..." : (
              <>
                <FaCheck /> {isCombo ? "Guardar Ambos" : "Guardar Livro"}
              </>
            )}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}