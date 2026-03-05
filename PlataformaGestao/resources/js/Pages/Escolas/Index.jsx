import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { FaSchool, FaPlus, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import EditSchoolModal from "@/Components/Escolas/EditSchoolModal";
import DeleteSchoolModal from "@/Components/Escolas/DeleteSchoolModal";
import NewSchoolModal from "@/Components/Escolas/NewSchoolModal";

function StatCard({ label, value, icon, iconClass }) {
  return (
    <div className="card-3d rounded-2xl p-5 flex items-center justify-between animate-card-in">
      <div>
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{label}</div>
        <div className="text-4xl font-black text-gray-900 mt-2">{value}</div>
      </div>
      <div className={`text-2xl ${iconClass}`}>{icon}</div>
    </div>
  );
}

function Select({ value, onChange, options, placeholder, getLabel }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full glass-input rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 appearance-none"
    >
      <option value="">{placeholder}</option>
      {(options || []).map((o) => (
        <option key={o.id ?? o.value} value={o.id ?? o.value}>
          {getLabel ? getLabel(o) : o.nome ?? o.label ?? o.value}
        </option>
      ))}
    </select>
  );
}

function EscolaCard({ escola, onEdit, onToggle, onDelete }) {
  return (
    <div className="card-3d rounded-2xl overflow-hidden flex flex-col h-full animate-card-in">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-gray-900 leading-snug">
              {escola.nome}
            </h3>

            <div className="mt-2 flex items-center gap-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-gray-200 text-xs font-bold text-gray-700 bg-white/60">
                Código: {escola.codigo}
              </div>

              {!escola.isAtivo && (
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-red-200 text-xs font-bold text-red-700 bg-red-50">
                  Inativa
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-400 font-bold uppercase">
              Concelho
            </div>
            <div className="text-sm font-black text-gray-900">
              {escola.concelho ?? "—"}
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          Atualizado: {escola.updated_at}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-white/40 bg-gray-50/30 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(escola)}
          className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white/60 hover:bg-white text-gray-800 font-bold text-sm transition-colors"
        >
          Editar
        </button>

        <button
          type="button"
          onClick={() => onToggle(escola)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white/60 hover:bg-white text-gray-800 font-bold text-sm transition-colors"
          title={escola.isAtivo ? "Tornar inativa" : "Ativar"}
        >
          {escola.isAtivo ? <FaTimesCircle /> : <FaCheckCircle />}
        </button>

        <button
          type="button"
          onClick={() => onDelete(escola)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white/60 hover:bg-white text-gray-800 font-bold text-sm transition-colors"
          title="Eliminar"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

export default function Index({ auth, stats, escolas, filters, initial }) {
  const { flash } = usePage().props;

  const [search, setSearch] = useState(initial.search || "");
  const [concelho, setConcelho] = useState(initial.concelho_id || "");
  const [estado, setEstado] = useState(initial.estado || "ALL");

  // MODAIS
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [editEscola, setEditEscola] = useState(null);
  const [deleteEscola, setDeleteEscola] = useState(null);

  const refreshList = () => {
    router.get(
      route("escolas.index"),
      {
        search: search || undefined,
        concelho_id: concelho || undefined,
        estado: estado || undefined,
      },
      { preserveScroll: true, replace: true, preserveState: false }
    );
  };

  React.useEffect(() => {
    const t = setTimeout(() => {
      router.get(
        route("escolas.index"),
        {
          search: search || undefined,
          concelho_id: concelho || undefined,
          estado: estado || undefined,
        },
        { preserveState: true, replace: true, preserveScroll: true }
      );
    }, 300);

    return () => clearTimeout(t);
  }, [search, concelho, estado]);

  const toggleActive = (e) => {
    router.patch(route("escolas.toggle", e.id), {}, { preserveScroll: true });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Gerir Escolas" />

      <div className="-m-8 min-h-screen bg-gray-50/80 font-sans flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                <FaSchool /> Gerir Escolas
              </h1>
              <p className="text-sm text-gray-500/80 mt-1 font-medium">
                Pesquisar, editar e gerir estado das escolas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsNewOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 active:scale-[0.97] whitespace-nowrap"
            >
              <FaPlus /> Nova Escola
            </button>
          </div>

          {/* Flash */}
          {flash?.success && (
            <div className="p-4 rounded-xl border border-green-200 bg-green-50 text-green-800 text-sm font-semibold">
              {flash.success}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total" value={stats.total} icon={<FaSchool />} iconClass="text-gray-400" />
            <StatCard label="Ativas" value={stats.ativas} icon={<FaCheckCircle />} iconClass="text-green-600" />
            <StatCard label="Inativas" value={stats.inativas} icon={<FaTimesCircle />} iconClass="text-red-600" />
          </div>

          {/* Filtros */}
          <div className="card-3d rounded-3xl p-5 space-y-4 animate-card-in">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome ou código..."
              className="glass-input w-full rounded-xl px-4 py-3 text-sm font-semibold text-gray-800"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Select
                value={concelho}
                onChange={setConcelho}
                options={filters?.concelhos || []}
                placeholder="Todos os Concelhos"
                getLabel={(c) => c.nome}
              />
              <Select
                value={estado}
                onChange={setEstado}
                options={filters?.estados || []}
                placeholder="Estado"
                getLabel={(s) => s.label}
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(escolas || []).map((e) => (
              <EscolaCard
                key={e.id}
                escola={e}
                onEdit={(escola) => setEditEscola(escola)}
                onToggle={toggleActive}
                onDelete={(escola) => setDeleteEscola(escola)}
              />
            ))}
          </div>

        </div>
      </div>

      {/* MODAIS */}
      <NewSchoolModal
        open={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        concelhos={filters?.concelhos || []}
        onCreated={refreshList}
      />

      <EditSchoolModal
        open={!!editEscola}
        onClose={() => setEditEscola(null)}
        school={editEscola}
        concelhos={filters?.concelhos || []}
        onUpdated={refreshList}
      />

      <DeleteSchoolModal
        open={!!deleteEscola}
        onClose={() => setDeleteEscola(null)}
        school={deleteEscola}
        onDeleted={refreshList}
      />
    </AuthenticatedLayout>
  );
}
