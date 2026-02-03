import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FaSearch, FaPlus, FaBook, FaTrash, FaEdit } from "react-icons/fa";

export default function BooksLists({ auth, lists = [], concelhos = [], anos_letivos = [], anos_escolares = [] }) {
    const { data, setData, get, processing } = useForm({
        concelho: FilterSelect.concelho,
        ano_letivo_id: FilterSelect.ano_escolar_id,
        ano_escolar_id: FilterSelect.ano_escolar_id,
    });

    const handleSearch = (e) => {
        // evita atualizar a pagina inteira ao enviar um form
        e.preventDefault();
        get(route('book-lists.index'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Listas de Livros" />

            <div className="space-y-6">
                {/* CABEÇALHO */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Listas de Livros Escolares</h1>
                        <p className="text-gray-500 text-sm">Gerir listas de livros por concelho, ano letivo e ano escolar</p>
                    </div>
                    <Link 
                        href={route('books.index')}
                        className="flex items-center bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition shadow-sm"
                    >
                        <FaPlus className="mr-2" />
                        Nova Lista
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <FilterSelect 
                            label="Concelho" 
                            value={data.concelho}
                            onChange={e => setData('concelho', e.target.value)}
                            options={concelhos}
                        />
                        <FilterSelect 
                            label="Ano Letivo" 
                            value={data.ano_letivo_id}
                            onChange={e => setData('ano_letivo', e.target.value)}
                            options={anos_letivos} 
                        />
                        <FilterSelect 
                            label="Ano Escolar" 
                            value={data.ano_escolar_id}
                            onChange={e => setData('ano_escolar', e.target.value)}
                            options={anos_escolares} 
                        />
                        
                        <button 
                            type="submit"
                            disabled={processing}
                            className="w-full bg-black text-white h-[42px] rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition"
                        >
                            <FaSearch className="text-xs" />
                            Buscar Lista
                        </button>
                    </form>
                </div>

                {/* 3. TABELA DE RESULTADOS */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider">Escola / Agrupamento</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider">Ano</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider text-center">Livros</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {lists.length > 0 ? lists.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.school_name}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.year}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-bold">
                                            {item.books_count} Livros
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 transition"><FaEdit /></button>
                                        <button className="p-2 text-gray-400 hover:text-red-600 transition"><FaTrash /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                        <FaBook className="mx-auto mb-3 text-3xl opacity-20" />
                                        Nenhuma lista encontrada para os filtros selecionados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// --- SUB-COMPONENTES AUXILIARES ---

function FilterSelect({ label, value, onChange, options }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase ml-1">{label}</label>
            <select 
                value={value}
                onChange={onChange}
                className="bg-gray-50 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all"
            >
                <option value="">Selecione</option>
                {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                        {opt.nome}
                    </option>
                ))}
            </select>
        </div>
    );
}