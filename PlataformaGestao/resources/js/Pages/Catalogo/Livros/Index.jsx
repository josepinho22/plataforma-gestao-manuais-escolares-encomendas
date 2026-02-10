import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { FaPlus, FaCheckCircle, FaBook } from "react-icons/fa";

import EditBookModal from "@/Components/Catalogo/Livros/EditBookModal";
import DeleteBookModal from "@/Components/Catalogo/Livros/DeleteBookModal";
import NewBookModal from "@/Components/Catalogo/Livros/NewBookModal";
import StatCard from "@/Components/Catalogo/Livros/StatCard";
import Select from "@/Components/Catalogo/Livros/Select";
import LivroCard from "@/Components/Catalogo/Livros/LivroCard";

export default function Index({ auth, stats, livros, filters, initial }) {
  const [search, setSearch] = useState(initial.search || "");
  const [disciplina, setDisciplina] = useState(initial.disciplina_id || "");
  const [ano, setAno] = useState(initial.ano_escolar_id || "");
  const [editora, setEditora] = useState(initial.editora_id || "");
  const [tipo, setTipo] = useState(initial.tipo || "");

  
  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);
  const [newBookOpen, setNewBookOpen] = useState(false);

  
  const refreshList = () => {
    router.get(
      route("catalogo.livros.index"),
      {
        search: search || undefined,
        disciplina_id: disciplina || undefined,
        ano_escolar_id: ano || undefined,
        editora_id: editora || undefined,
        tipo: tipo || undefined,
      },
      { preserveScroll: true, replace: true, preserveState: false }
    );
  };

  
  React.useEffect(() => {
    const t = setTimeout(() => {
      router.get(
        route("catalogo.livros.index"),
        {
          search: search || undefined,
          disciplina_id: disciplina || undefined,
          ano_escolar_id: ano || undefined,
          editora_id: editora || undefined,
          tipo: tipo || undefined,
        },
        { preserveState: true, replace: true, preserveScroll: true }
      );
    }, 300);

    return () => clearTimeout(t);
  }, [search, disciplina, ano, editora, tipo]);

  
  const toggleActive = (book) => {
    router.patch(
      route("catalogo.livros.toggle", book.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => refreshList(),
      }
    );
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Catálogo de Livros" />

      <div className="space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Catálogo de Livros</h1>
            <p className="text-sm text-gray-500">Gestão de livros escolares</p>
          </div>

          <button
            type="button"
            onClick={() => setNewBookOpen(true)} 
            className="inline-flex items-center gap-2 bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg transition-all px-4 py-2.5 rounded-xl text-sm font-bold"
          >
            <FaPlus /> Novo Livro
          </button>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total de Livros" value={stats.total} icon={<FaBook />} iconClass="text-gray-400" />
          <StatCard label="Livros Ativos" value={stats.ativos} icon={<FaCheckCircle />} iconClass="text-green-600" />
          <StatCard label="Manuais" value={stats.manuais} icon={<FaBook />} iconClass="text-blue-600" />
          <StatCard label="Cadernos" value={stats.cadernos} icon={<FaBook />} iconClass="text-orange-600" />
        </div>

        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 space-y-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por título ou ISBN..."
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Select value={disciplina} onChange={setDisciplina} options={filters.disciplinas || []} placeholder="Todas as Disciplinas" />
              <Select value={ano} onChange={setAno} options={filters.anos || []} placeholder="Todos os Anos" />
              <Select value={editora} onChange={setEditora} options={filters.editoras || []} placeholder="Todas as Editoras" />
              <Select value={tipo} onChange={setTipo} options={filters.tipos || []} placeholder="Todos os Tipos" />
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {(livros || []).map((l) => (
            <LivroCard
              key={l.id}
              livro={l}
              onEdit={(book) => setEditBook(book)}
              onToggleActive={toggleActive}
              onDelete={(book) => setDeleteBook(book)}
            />
          ))}
        </div>
      </div>

      
      <EditBookModal
        open={!!editBook}
        onClose={() => setEditBook(null)}
        book={editBook}
        filters={filters}
        onUpdated={refreshList} 
      />

      <DeleteBookModal
        open={!!deleteBook}
        onClose={() => setDeleteBook(null)}
        book={deleteBook}
      />

      <NewBookModal
        open={newBookOpen}
        onClose={() => setNewBookOpen(false)}
        filters={filters}
        onCreated={refreshList}
      />
    </AuthenticatedLayout>
  );
}
