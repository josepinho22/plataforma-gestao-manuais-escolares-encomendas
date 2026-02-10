import React, { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { FaUserGraduate, FaPlus, FaSearch } from "react-icons/fa";

import NewAlunoModal from "@/Components/Alunos/NewAlunoModal";
import EditAlunoModal from "@/Components/Alunos/EditAlunoModal";

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="text-sm font-bold text-gray-600">{label}</div>
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

  const rows = useMemo(() => alunos || [], [alunos]);

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Gerir Alunos" />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <FaUserGraduate /> Gerir Alunos
            </h1>
            <p className="text-sm text-gray-500">
              Pesquisa por nome, NIF, telefone ou nº cliente. Cria e edita alunos via modais.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsNewOpen(true)}
            className="inline-flex items-center gap-2 bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg transition-all px-4 py-2.5 rounded-xl text-sm font-bold"
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar por nome, NIF, telefone, nº cliente..."
                className="w-full pl-11 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-900">Lista de Alunos</h2>
            <p className="text-sm text-gray-500">Clique em “Editar” para alterar os dados.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs font-black uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3">Nome</th>
                  <th className="px-5 py-3">NIF</th>
                  <th className="px-5 py-3">Telefone</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Nº Cliente</th>
                  <th className="px-5 py-3 w-40">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                      Sem alunos para mostrar.
                    </td>
                  </tr>
                ) : (
                  rows.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-bold text-gray-900">{a.nome}</td>
                      <td className="px-5 py-4 text-gray-700">{a.nif || "—"}</td>
                      <td className="px-5 py-4 text-gray-700">{a.telefone || "—"}</td>
                      <td className="px-5 py-4 text-gray-700">{a.email || "—"}</td>
                      <td className="px-5 py-4 text-gray-700">{a.numero_cliente || "—"}</td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setEditAluno(a)}
                          className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-bold"
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
        </div>
      </div>

      {/* MODAIS */}
      <NewAlunoModal open={isNewOpen} onClose={() => setIsNewOpen(false)} />
      <EditAlunoModal open={!!editAluno} onClose={() => setEditAluno(null)} aluno={editAluno} />
    </AuthenticatedLayout>
  );
}