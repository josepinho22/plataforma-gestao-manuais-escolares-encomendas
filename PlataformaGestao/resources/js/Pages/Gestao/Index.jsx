import React, { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { FaPlus, FaPen, FaTrash, FaMapMarkerAlt, FaBuilding, FaGraduationCap, FaCalendarAlt, FaLock } from "react-icons/fa";
import ModalShell from "@/Components/Orders/Editora/ModalShell";

const fmtDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d)) return v;
  return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
};

function TabButton({ active, children, onClick, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 " +
        (active
          ? "bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 border-transparent"
          : "card-3d text-gray-700 hover:shadow-md border border-white/40")
      }
    >
      {icon}
      {children}
    </button>
  );
}

function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={onEdit}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white/60 hover:bg-white text-gray-800 font-bold text-xs transition-colors"
      >
        <FaPen />
        Editar
      </button>

      <button
        onClick={onDelete}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white/60 hover:bg-white text-gray-800 font-bold text-xs transition-colors"
      >
        <FaTrash />
        Eliminar
      </button>
    </div>
  );
}

// ---------- MODAIS ----------
function NameModal({ open, onClose, title, initialName = "", onSubmit, loading }) {
  const [nome, setNome] = useState(initialName);

  React.useEffect(() => {
    if (!open) return;
    setNome(initialName || "");
  }, [open, initialName]);

  if (!open) return null;

  return (
    <ModalShell title={title} onClose={onClose} size="md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ nome });
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            Nome <span className="text-red-600">*</span>
          </label>
          <input
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="glass-input w-full rounded-xl px-4 py-3 text-sm font-semibold text-gray-800"
            placeholder="Ex: Lisboa"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-black text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function AnoLetivoModal({ open, onClose, title, initial = null, onSubmit }) {
  const [nome, setNome] = useState(initial?.nome || "");
  const [dataInicio, setDataInicio] = useState(initial?.data_inicio || "");
  const [dataFim, setDataFim] = useState(initial?.data_fim || "");

  React.useEffect(() => {
    if (!open) return;
    setNome(initial?.nome || "");
    setDataInicio(initial?.data_inicio || "");
    setDataFim(initial?.data_fim || "");
  }, [open, initial]);

  if (!open) return null;

  return (
    <ModalShell title={title} onClose={onClose} size="md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ nome, data_inicio: dataInicio, data_fim: dataFim });
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            Nome <span className="text-red-600">*</span>
          </label>
          <input
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="glass-input w-full rounded-xl px-4 py-3 text-sm font-semibold text-gray-800"
            placeholder="Ex: 2025/2026"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2">
              Data Início <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              required
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="glass-input w-full rounded-xl px-4 py-3 text-sm font-semibold text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2">
              Data Fim <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              required
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="glass-input w-full rounded-xl px-4 py-3 text-sm font-semibold text-gray-800"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-black text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all"
          >
            Guardar
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function NovoAnoLetivoModal({ open, onClose, nextNome, error, onSubmit, loading }) {
  const [password, setPassword] = useState("");

  React.useEffect(() => {
    if (!open) return;
    setPassword("");
  }, [open]);

  if (!open) return null;

  return (
    <ModalShell title="Novo Ano Letivo" onClose={onClose} size="md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ password });
        }}
        className="space-y-4"
      >
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
            Ano letivo a criar
          </p>
          <p className="text-2xl font-extrabold text-indigo-900">
            {nextNome || "—"}
          </p>
          {nextNome && (
            <p className="text-xs text-indigo-500 mt-1">
              As datas serão calculadas automaticamente com base no ano atual.
            </p>
          )}
          {!nextNome && (
            <p className="text-xs text-red-500 mt-1">
              Não existe nenhum ano letivo registado para avançar.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            <span className="inline-flex items-center gap-1.5">
              <FaLock className="text-gray-500" />
              Confirmar com palavra-passe <span className="text-red-600">*</span>
            </span>
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-input w-full rounded-xl px-4 py-3 text-sm font-semibold text-gray-800"
            placeholder="Introduza a sua palavra-passe"
          />
          {error && (
            <p className="mt-1.5 text-xs text-red-600 font-semibold">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-black text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !nextNome}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
          >
            <FaPlus />
            Criar Ano Letivo
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function ConfirmDeleteModal({ open, onClose, title, subtitle, onConfirm, loading }) {
  if (!open) return null;

  return (
    <ModalShell title={title} onClose={onClose} size="md">
      <div className="space-y-4">
        <p className="text-sm text-gray-700">{subtitle}</p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-black text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm"
          >
            Apagar
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

export default function Index({ auth, concelhos, editoras, disciplinas, anosLetivos, initial }) {
  const { flash } = usePage().props;

  const [tab, setTab] = useState("CONCELHOS");

  const [searchConcelhos, setSearchConcelhos] = useState(initial?.concelhos_search || "");
  const [searchEditoras, setSearchEditoras] = useState(initial?.editoras_search || "");
  const [searchDisciplinas, setSearchDisciplinas] = useState(initial?.disciplinas_search || "");
  const [searchAnosLetivos, setSearchAnosLetivos] = useState(initial?.anos_letivos_search || "");

  const [newConcelhoOpen, setNewConcelhoOpen] = useState(false);
  const [editConcelho, setEditConcelho] = useState(null);
  const [deleteConcelho, setDeleteConcelho] = useState(null);

  const [newEditoraOpen, setNewEditoraOpen] = useState(false);
  const [editEditora, setEditEditora] = useState(null);
  const [deleteEditora, setDeleteEditora] = useState(null);

  const [newDisciplinaOpen, setNewDisciplinaOpen] = useState(false);
  const [editDisciplina, setEditDisciplina] = useState(null);
  const [deleteDisciplina, setDeleteDisciplina] = useState(null);

  const [newAnoLetivoOpen, setNewAnoLetivoOpen] = useState(false);
  const [anoLetivoError, setAnoLetivoError] = useState("");
  const [editAnoLetivo, setEditAnoLetivo] = useState(null);
  const [deleteAnoLetivo, setDeleteAnoLetivo] = useState(null);

  React.useEffect(() => {
    const t = setTimeout(() => {
      router.get(
        route("concelhos.index"),
        {
          search: searchConcelhos || undefined,
          editoras_search: searchEditoras || undefined,
          disciplinas_search: searchDisciplinas || undefined,
          anos_letivos_search: searchAnosLetivos || undefined,
        },
        { preserveState: true, replace: true, preserveScroll: true }
      );
    }, 250);

    return () => clearTimeout(t);
  }, [searchConcelhos, searchEditoras, searchDisciplinas, searchAnosLetivos]);

  const concelhosList   = useMemo(() => concelhos || [], [concelhos]);
  const editorasList    = useMemo(() => editoras || [], [editoras]);
  const disciplinasList = useMemo(() => disciplinas || [], [disciplinas]);
  const anosLetivosList = useMemo(() => anosLetivos || [], [anosLetivos]);

  const nextAnoLetivoNome = useMemo(() => {
    if (anosLetivosList.length === 0) return null;
    const latest = [...anosLetivosList].sort((a, b) => new Date(b.data_fim) - new Date(a.data_fim))[0];
    const match = latest.nome.match(/^(\d{4})\/(\d{4})$/);
    if (!match) return null;
    return `${parseInt(match[1]) + 1}/${parseInt(match[2]) + 1}`;
  }, [anosLetivosList]);

  const postConcelho = (payload) => {
    router.post(route("concelhos.store"), payload, {
      preserveScroll: true,
      onSuccess: () => setNewConcelhoOpen(false),
    });
  };

  const putConcelho = (id, payload) => {
    router.put(route("concelhos.update", id), payload, {
      preserveScroll: true,
      onSuccess: () => setEditConcelho(null),
    });
  };

  const delConcelho = (id) => {
    router.delete(route("concelhos.destroy", id), {
      preserveScroll: true,
      onSuccess: () => setDeleteConcelho(null),
    });
  };

  const postEditora = (payload) => {
    router.post(route("editoras.store"), payload, {
      preserveScroll: true,
      onSuccess: () => setNewEditoraOpen(false),
    });
  };

  const putEditora = (id, payload) => {
    router.put(route("editoras.update", id), payload, {
      preserveScroll: true,
      onSuccess: () => setEditEditora(null),
    });
  };

  const delEditora = (id) => {
    router.delete(route("editoras.destroy", id), {
      preserveScroll: true,
      onSuccess: () => setDeleteEditora(null),
    });
  };

  const postDisciplina = (payload) => {
    router.post(route("disciplinas.store"), payload, {
      preserveScroll: true,
      onSuccess: () => setNewDisciplinaOpen(false),
    });
  };

  const putDisciplina = (id, payload) => {
    router.put(route("disciplinas.update", id), payload, {
      preserveScroll: true,
      onSuccess: () => setEditDisciplina(null),
    });
  };

  const delDisciplina = (id) => {
    router.delete(route("disciplinas.destroy", id), {
      preserveScroll: true,
      onSuccess: () => setDeleteDisciplina(null),
    });
  };

  const postAnoLetivo = (payload) => {
    setAnoLetivoError("");
    router.post(route("anos-letivos.avancar"), payload, {
      preserveScroll: true,
      onError: (errors) => setAnoLetivoError(errors.password || "Erro ao criar ano letivo."),
      onSuccess: () => { setNewAnoLetivoOpen(false); setAnoLetivoError(""); },
    });
  };

  const putAnoLetivo = (id, payload) => {
    router.put(route("anos-letivos.update", id), payload, {
      preserveScroll: true,
      onSuccess: () => setEditAnoLetivo(null),
    });
  };

  const delAnoLetivo = (id) => {
    router.delete(route("anos-letivos.destroy", id), {
      preserveScroll: true,
      onSuccess: () => setDeleteAnoLetivo(null),
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Gestão" />

      <div className="-m-8 min-h-screen bg-gray-50/80 font-sans flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestão</h1>
              <p className="text-sm text-gray-500/80 mt-1 font-medium">Gerir concelhos, editoras, disciplinas e anos letivos.</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <TabButton
                active={tab === "CONCELHOS"}
                onClick={() => setTab("CONCELHOS")}
                icon={<FaMapMarkerAlt />}
              >
                Concelhos
              </TabButton>
              <TabButton
                active={tab === "EDITORAS"}
                onClick={() => setTab("EDITORAS")}
                icon={<FaBuilding />}
              >
                Editoras
              </TabButton>
              <TabButton
                active={tab === "DISCIPLINAS"}
                onClick={() => setTab("DISCIPLINAS")}
                icon={<FaGraduationCap />}
              >
                Disciplinas
              </TabButton>
              <TabButton
                active={tab === "ANOS_LETIVOS"}
                onClick={() => setTab("ANOS_LETIVOS")}
                icon={<FaCalendarAlt />}
              >
                Anos Letivos
              </TabButton>
            </div>
          </div>

          {flash?.success && (
            <div className="p-4 rounded-xl border border-green-200 bg-green-50 text-green-800 text-sm font-semibold">
              {flash.success}
            </div>
          )}

          {/* ---------------- CONCELHOS ---------------- */}
          {tab === "CONCELHOS" && (
            <div className="space-y-4">
              <div className="card-3d rounded-3xl p-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between animate-card-in">
                <input
                  value={searchConcelhos}
                  onChange={(e) => setSearchConcelhos(e.target.value)}
                  placeholder="Pesquisar concelho..."
                  className="glass-input w-full md:max-w-md rounded-xl px-4 py-3 text-sm font-semibold text-gray-800"
                />

                <button
                  onClick={() => setNewConcelhoOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 active:scale-[0.97] whitespace-nowrap"
                >
                  <FaPlus /> Novo Concelho
                </button>
              </div>

              <div className="card-3d rounded-3xl overflow-hidden animate-card-in-delay">
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50/50 border-b border-white/40">
                      <tr className="text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">
                        <th className="px-4 py-3">Nome</th>
                        <th className="px-4 py-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/60">
                      {(concelhosList || []).map((c) => (
                        <tr key={c.id} className="hover:bg-indigo-50/20 transition-colors">
                          <td className="px-4 py-3 font-semibold text-gray-900">{c.nome}</td>
                          <td className="px-4 py-3">
                            <RowActions
                              onEdit={() => setEditConcelho(c)}
                              onDelete={() => setDeleteConcelho(c)}
                            />
                          </td>
                        </tr>
                      ))}
                      {(concelhosList || []).length === 0 && (
                        <tr>
                          <td colSpan={2} className="px-4 py-10 text-center text-sm text-gray-400">
                            Sem concelhos.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- EDITORAS ---------------- */}
          {tab === "EDITORAS" && (
            <div className="space-y-4">
              <div className="card-3d rounded-3xl p-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between animate-card-in">
                <input
                  value={searchEditoras}
                  onChange={(e) => setSearchEditoras(e.target.value)}
                  placeholder="Pesquisar editora..."
                  className="glass-input w-full md:max-w-md rounded-xl px-4 py-3 text-sm font-semibold text-gray-800"
                />

                <button
                  onClick={() => setNewEditoraOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 active:scale-[0.97] whitespace-nowrap"
                >
                  <FaPlus /> Nova Editora
                </button>
              </div>

              <div className="card-3d rounded-3xl overflow-hidden animate-card-in-delay">
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50/50 border-b border-white/40">
                      <tr className="text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">
                        <th className="px-4 py-3">Nome</th>
                        <th className="px-4 py-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/60">
                      {(editorasList || []).map((e) => (
                        <tr key={e.id} className="hover:bg-indigo-50/20 transition-colors">
                          <td className="px-4 py-3 font-semibold text-gray-900">{e.nome}</td>
                          <td className="px-4 py-3">
                            <RowActions
                              onEdit={() => setEditEditora(e)}
                              onDelete={() => setDeleteEditora(e)}
                            />
                          </td>
                        </tr>
                      ))}
                      {(editorasList || []).length === 0 && (
                        <tr>
                          <td colSpan={2} className="px-4 py-10 text-center text-sm text-gray-400">
                            Sem editoras.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- DISCIPLINAS ---------------- */}
          {tab === "DISCIPLINAS" && (
            <div className="space-y-4">
              <div className="card-3d rounded-3xl p-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between animate-card-in">
                <input
                  value={searchDisciplinas}
                  onChange={(e) => setSearchDisciplinas(e.target.value)}
                  placeholder="Pesquisar disciplina..."
                  className="glass-input w-full md:max-w-md rounded-xl px-4 py-3 text-sm font-semibold text-gray-800"
                />

                <button
                  onClick={() => setNewDisciplinaOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 active:scale-[0.97] whitespace-nowrap"
                >
                  <FaPlus /> Nova Disciplina
                </button>
              </div>

              <div className="card-3d rounded-3xl overflow-hidden animate-card-in-delay">
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50/50 border-b border-white/40">
                      <tr className="text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">
                        <th className="px-4 py-3">Nome</th>
                        <th className="px-4 py-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/60">
                      {disciplinasList.map((d) => (
                        <tr key={d.id} className="hover:bg-indigo-50/20 transition-colors">
                          <td className="px-4 py-3 font-semibold text-gray-900">{d.nome}</td>
                          <td className="px-4 py-3">
                            <RowActions
                              onEdit={() => setEditDisciplina(d)}
                              onDelete={() => setDeleteDisciplina(d)}
                            />
                          </td>
                        </tr>
                      ))}
                      {disciplinasList.length === 0 && (
                        <tr>
                          <td colSpan={2} className="px-4 py-10 text-center text-sm text-gray-400">
                            Sem disciplinas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- ANOS LETIVOS ---------------- */}
          {tab === "ANOS_LETIVOS" && (
            <div className="space-y-4">
              <div className="card-3d rounded-3xl p-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between animate-card-in">
                <input
                  value={searchAnosLetivos}
                  onChange={(e) => setSearchAnosLetivos(e.target.value)}
                  placeholder="Pesquisar ano letivo..."
                  className="glass-input w-full md:max-w-md rounded-xl px-4 py-3 text-sm font-semibold text-gray-800"
                />

                <button
                  onClick={() => setNewAnoLetivoOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 active:scale-[0.97] whitespace-nowrap"
                >
                  <FaPlus /> Novo Ano Letivo
                </button>
              </div>

              <div className="card-3d rounded-3xl overflow-hidden animate-card-in-delay">
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50/50 border-b border-white/40">
                      <tr className="text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">
                        <th className="px-4 py-3">Nome</th>
                        <th className="px-4 py-3">Data Início</th>
                        <th className="px-4 py-3">Data Fim</th>
                        <th className="px-4 py-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/60">
                      {anosLetivosList.map((a) => (
                        <tr key={a.id} className="hover:bg-indigo-50/20 transition-colors">
                          <td className="px-4 py-3 font-semibold text-gray-900">{a.nome}</td>
                          <td className="px-4 py-3 text-gray-600">{fmtDate(a.data_inicio)}</td>
                          <td className="px-4 py-3 text-gray-600">{fmtDate(a.data_fim)}</td>
                          <td className="px-4 py-3">
                            <RowActions
                              onEdit={() => setEditAnoLetivo(a)}
                              onDelete={() => setDeleteAnoLetivo(a)}
                            />
                          </td>
                        </tr>
                      ))}
                      {anosLetivosList.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-400">
                            Sem anos letivos.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* -------- MODAIS CONCELHOS -------- */}
      <NameModal
        open={newConcelhoOpen}
        onClose={() => setNewConcelhoOpen(false)}
        title="Novo Concelho"
        onSubmit={(payload) => postConcelho(payload)}
      />

      <NameModal
        open={!!editConcelho}
        onClose={() => setEditConcelho(null)}
        title="Editar Concelho"
        initialName={editConcelho?.nome || ""}
        onSubmit={(payload) => putConcelho(editConcelho.id, payload)}
      />

      <ConfirmDeleteModal
        open={!!deleteConcelho}
        onClose={() => setDeleteConcelho(null)}
        title="Remover Concelho"
        subtitle={`Tens a certeza que queres remover "${deleteConcelho?.nome}"?`}
        onConfirm={() => delConcelho(deleteConcelho.id)}
      />

      {/* -------- MODAIS EDITORAS -------- */}
      <NameModal
        open={newEditoraOpen}
        onClose={() => setNewEditoraOpen(false)}
        title="Nova Editora"
        onSubmit={(payload) => postEditora(payload)}
      />

      <NameModal
        open={!!editEditora}
        onClose={() => setEditEditora(null)}
        title="Editar Editora"
        initialName={editEditora?.nome || ""}
        onSubmit={(payload) => putEditora(editEditora.id, payload)}
      />

      <ConfirmDeleteModal
        open={!!deleteEditora}
        onClose={() => setDeleteEditora(null)}
        title="Remover Editora"
        subtitle={`Tens a certeza que queres remover "${deleteEditora?.nome}"?`}
        onConfirm={() => delEditora(deleteEditora.id)}
      />

      {/* -------- MODAIS DISCIPLINAS -------- */}
      <NameModal
        open={newDisciplinaOpen}
        onClose={() => setNewDisciplinaOpen(false)}
        title="Nova Disciplina"
        onSubmit={(payload) => postDisciplina(payload)}
      />

      <NameModal
        open={!!editDisciplina}
        onClose={() => setEditDisciplina(null)}
        title="Editar Disciplina"
        initialName={editDisciplina?.nome || ""}
        onSubmit={(payload) => putDisciplina(editDisciplina.id, payload)}
      />

      <ConfirmDeleteModal
        open={!!deleteDisciplina}
        onClose={() => setDeleteDisciplina(null)}
        title="Remover Disciplina"
        subtitle={`Tens a certeza que queres remover "${deleteDisciplina?.nome}"?`}
        onConfirm={() => delDisciplina(deleteDisciplina.id)}
      />

      {/* -------- MODAIS ANOS LETIVOS -------- */}
      <NovoAnoLetivoModal
        open={newAnoLetivoOpen}
        onClose={() => { setNewAnoLetivoOpen(false); setAnoLetivoError(""); }}
        nextNome={nextAnoLetivoNome}
        error={anoLetivoError}
        onSubmit={(payload) => postAnoLetivo(payload)}
      />

      <AnoLetivoModal
        open={!!editAnoLetivo}
        onClose={() => setEditAnoLetivo(null)}
        title="Editar Ano Letivo"
        initial={editAnoLetivo}
        onSubmit={(payload) => putAnoLetivo(editAnoLetivo.id, payload)}
      />

      <ConfirmDeleteModal
        open={!!deleteAnoLetivo}
        onClose={() => setDeleteAnoLetivo(null)}
        title="Remover Ano Letivo"
        subtitle={`Tens a certeza que queres remover "${deleteAnoLetivo?.nome}"?`}
        onConfirm={() => delAnoLetivo(deleteAnoLetivo.id)}
      />
    </AuthenticatedLayout>
  );
}
