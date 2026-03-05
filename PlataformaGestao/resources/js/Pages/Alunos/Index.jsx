import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { FaUserGraduate, FaPlus, FaSearch } from "react-icons/fa";

import NewAlunoModal from "@/Components/Alunos/NewAlunoModal";
import EditAlunoModal from "@/Components/Alunos/EditAlunoModal";
import Pagination from "@/Components/Pagination";

function StatCard({ label, value }) {
  return (
    <div className="card-3d rounded-2xl p-5 animate-card-in">
      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{label}</div>
      <div className="text-4xl font-black text-gray-900 mt-2">{value}</div>
    </div>
  );
}

export default function Index({ auth, stats, alunos, initial }) {
  const { flash } = usePage().props;

  const [search, setSearch] = useState(initial.search || "");

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [editAluno, setEditAluno] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      router.get(
        route("alunos.index"),
        { search: search || undefined },
        { preserveState: true, replace: true, preserveScroll: true }
      );
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

  const rows = alunos?.data || [];

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Gerir Alunos" />

      <div className="-m-8 min-h-screen bg-gray-50/80 font-sans flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                <FaUserGraduate /> Gerir Alunos
              </h1>
              <p className="text-sm text-gray-500/80 mt-1 font-medium">
                Pesquisa por nome, NIF, telefone ou nº cliente. Cria e edita alunos via modais.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsNewOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 active:scale-[0.97] whitespace-nowrap"
            >
              <FaPlus /> Novo Aluno
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
            <StatCard label="Total de Alunos" value={stats?.total ?? 0} />
          </div>

          {/* Pesquisa */}
          <div className="card-3d rounded-3xl p-5 animate-card-in">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar por nome, NIF, telefone, nº cliente..."
                className="glass-input w-full pl-11 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800"
              />
            </div>
          </div>

          {/* Tabela */}
          <div className="card-3d rounded-3xl overflow-hidden animate-card-in-delay">
            <div className="px-6 py-4 border-b border-white/40">
              <h2 className="text-base font-extrabold text-gray-900">Lista de Alunos</h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Clique em "Editar" para alterar os dados.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50/50 border-b border-white/40">
                  <tr className="text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">
                    <th className="px-5 py-3">Nome</th>
                    <th className="px-5 py-3">NIF</th>
                    <th className="px-5 py-3">Telefone</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Nº Cliente</th>
                    <th className="px-5 py-3 w-40">Ações</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100/60">
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-sm">
                        Sem alunos para mostrar.
                      </td>
                    </tr>
                  ) : (
                    rows.map((a) => (
                      <tr key={a.id} className="hover:bg-indigo-50/20 transition-colors">
                        <td className="px-5 py-4 font-bold text-gray-900">{a.nome}</td>
                        <td className="px-5 py-4 text-gray-600">{a.nif || "—"}</td>
                        <td className="px-5 py-4 text-gray-600">{a.telefone || "—"}</td>
                        <td className="px-5 py-4 text-gray-600">{a.email || "—"}</td>
                        <td className="px-5 py-4 text-gray-600">{a.numero_cliente || "—"}</td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => setEditAluno(a)}
                            className="px-3 py-2 rounded-xl border border-gray-200 bg-white/60 hover:bg-white text-gray-800 font-bold text-xs transition-colors"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Pagination items={alunos} params={{ search: search || undefined }} />
          </div>

        </div>
      </div>

      {/* MODAIS */}
      <NewAlunoModal open={isNewOpen} onClose={() => setIsNewOpen(false)} />
      <EditAlunoModal open={!!editAluno} onClose={() => setEditAluno(null)} aluno={editAluno} />
    </AuthenticatedLayout>
  );
}
