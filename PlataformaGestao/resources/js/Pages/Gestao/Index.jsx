import React, { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { FaPlus, FaPen, FaTrash, FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import ModalShell from "@/Components/Orders/Editora/ModalShell";

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

export default function Index({ auth, concelhos, editoras, initial }) {
  const { flash } = usePage().props;

  const [tab, setTab] = useState("CONCELHOS");

  const [searchConcelhos, setSearchConcelhos] = useState(initial?.concelhos_search || "");
  const [searchEditoras, setSearchEditoras] = useState(initial?.editoras_search || "");

  const [newConcelhoOpen, setNewConcelhoOpen] = useState(false);
  const [editConcelho, setEditConcelho] = useState(null);
  const [deleteConcelho, setDeleteConcelho] = useState(null);

  const [newEditoraOpen, setNewEditoraOpen] = useState(false);
  const [editEditora, setEditEditora] = useState(null);
  const [deleteEditora, setDeleteEditora] = useState(null);

  React.useEffect(() => {
    const t = setTimeout(() => {
      router.get(
        route("concelhos.index"),
        {
          search: searchConcelhos || undefined,
          editoras_search: searchEditoras || undefined,
        },
        { preserveState: true, replace: true, preserveScroll: true }
      );
    }, 250);

    return () => clearTimeout(t);
  }, [searchConcelhos, searchEditoras]);

  const concelhosList = useMemo(() => concelhos || [], [concelhos]);
  const editorasList = useMemo(() => editoras || [], [editoras]);

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

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Gestão" />

      <div className="-m-8 min-h-screen bg-gray-50/80 font-sans flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestão</h1>
              <p className="text-sm text-gray-500/80 mt-1 font-medium">Gerir concelhos e editoras.</p>
            </div>

            <div className="flex items-center gap-2">
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
    </AuthenticatedLayout>
  );
}
