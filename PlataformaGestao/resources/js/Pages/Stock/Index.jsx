import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import InputError from "@/Components/InputError";
import Modal from "@/Components/Modal";

export default function StockIndex({
    items,
    totalInStock,
    filters,
    disciplinas,
    editoras,
    anosEscolares,
}) {
    const [formData, setFormData] = useState({
        titulo: filters?.titulo ?? "",
        isbn: filters?.isbn ?? "",
        disciplina_id: filters?.disciplina_id ?? "",
        editora_id: filters?.editora_id ?? "",
        ano_escolar_id: filters?.ano_escolar_id ?? "",
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/stock", formData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClear = () => {
        setFormData({
            titulo: "",
            isbn: "",
            disciplina_id: "",
            editora_id: "",
            ano_escolar_id: "",
        });
        router.get(
            "/stock",
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Adjust modal state
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const adjustForm = useForm({
        livro_id: "",
        operacao: "ADICIONAR",
        quantidade: "",
    });

    const openAdjustModal = (item) => {
        setSelectedItem(item);
        adjustForm.setData({
            livro_id: item.livro_id,
            operacao: "ADICIONAR",
            quantidade: "",
        });
        adjustForm.clearErrors();
        setShowAdjustModal(true);
    };

    const closeAdjustModal = () => {
        setShowAdjustModal(false);
        setSelectedItem(null);
        adjustForm.reset();
        adjustForm.clearErrors();
    };

    const submitAdjust = (e) => {
        e.preventDefault();
        adjustForm.post("/stock/adjust", {
            preserveScroll: true,
            onSuccess: () => closeAdjustModal(),
        });
    };

    const selectClass = "w-full glass-input rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 appearance-none";

    return (
        <AuthenticatedLayout>
            <Head title="Stock" />

            <div className="-m-8 min-h-screen bg-gray-50/80 font-sans flex flex-col">
                <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 py-8 space-y-6">

                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Stock</h1>
                        <p className="text-sm text-gray-500/80 mt-1 font-medium">
                            Gestão de stock de manuais escolares
                        </p>
                    </div>

                    {/* Total em Stock Card */}
                    <div className="card-3d rounded-2xl p-6 animate-card-in">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                            Total em Stock
                        </h3>
                        <p className="text-4xl font-black text-indigo-600">
                            {totalInStock || 0}
                        </p>
                    </div>

                    {/* Filtros */}
                    <div className="card-3d rounded-3xl p-6 animate-card-in">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.titulo}
                                        onChange={(e) => handleInputChange("titulo", e.target.value)}
                                        placeholder="Pesquisar por título"
                                        className="glass-input w-full rounded-xl px-4 py-3 text-sm font-semibold text-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                                        ISBN
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.isbn}
                                        onChange={(e) => handleInputChange("isbn", e.target.value)}
                                        placeholder="Pesquisar por ISBN"
                                        className="glass-input w-full rounded-xl px-4 py-3 text-sm font-semibold text-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                                        Disciplina
                                    </label>
                                    <select
                                        value={formData.disciplina_id}
                                        onChange={(e) => handleInputChange("disciplina_id", e.target.value)}
                                        className={selectClass}
                                    >
                                        <option value="">Todas as disciplinas</option>
                                        {disciplinas && disciplinas.map((disciplina) => (
                                            <option key={disciplina.id} value={disciplina.id}>
                                                {disciplina.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                                        Editora
                                    </label>
                                    <select
                                        value={formData.editora_id}
                                        onChange={(e) => handleInputChange("editora_id", e.target.value)}
                                        className={selectClass}
                                    >
                                        <option value="">Todas as editoras</option>
                                        {editoras && editoras.map((editora) => (
                                            <option key={editora.id} value={editora.id}>
                                                {editora.nome}{editora.codigo ? ` (${editora.codigo})` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                                        Ano Escolar
                                    </label>
                                    <select
                                        value={formData.ano_escolar_id}
                                        onChange={(e) => handleInputChange("ano_escolar_id", e.target.value)}
                                        className={selectClass}
                                    >
                                        <option value="">Todos os anos</option>
                                        {anosEscolares && anosEscolares.map((ano) => (
                                            <option key={ano.id} value={ano.id}>
                                                {ano.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-1">
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 active:scale-[0.97]"
                                >
                                    Pesquisar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="px-5 py-2.5 border border-gray-200 bg-white/60 hover:bg-white text-gray-700 text-sm font-bold rounded-2xl transition-all duration-200"
                                >
                                    Limpar
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Add book to stock button */}
                    <div>
                        <button
                            disabled
                            className="inline-flex items-center gap-1 px-5 py-2.5 rounded-2xl bg-gray-200 text-gray-400 text-sm font-bold cursor-not-allowed"
                        >
                            <span className="text-lg leading-none">+</span>
                            Adicionar Livro ao Stock
                        </button>
                    </div>

                    {/* Table */}
                    <div className="card-3d rounded-3xl overflow-hidden animate-card-in-delay">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50/50 border-b border-white/40">
                                    <tr className="text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">
                                        <th className="px-6 py-3">Ano</th>
                                        <th className="px-6 py-3">Disciplina</th>
                                        <th className="px-6 py-3">Título</th>
                                        <th className="px-6 py-3">Editora</th>
                                        <th className="px-6 py-3">ISBN</th>
                                        <th className="px-6 py-3">Cód. Editora</th>
                                        <th className="px-6 py-3">Stock</th>
                                        <th className="px-6 py-3">Necessário</th>
                                        <th className="px-6 py-3">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/60">
                                    {items.data && items.data.length > 0 ? (
                                        items.data.map((item) => (
                                            <tr key={item.livro_id} className="hover:bg-indigo-50/20 transition-colors">
                                                <td className="px-6 py-4 text-gray-700">{item.ano_escolar_id}</td>
                                                <td className="px-6 py-4 text-gray-700">{item.disciplina_nome || "-"}</td>
                                                <td className="px-6 py-4 font-semibold text-gray-900">{item.titulo}</td>
                                                <td className="px-6 py-4 text-gray-700">{item.editora_nome || "-"}</td>
                                                <td className="px-6 py-4 text-gray-700">{item.isbn}</td>
                                                <td className="px-6 py-4 text-gray-700">{item.editora_codigo || "-"}</td>
                                                <td className="px-6 py-4 font-bold text-indigo-600">{item.stock_qtd}</td>
                                                <td className="px-6 py-4 font-bold text-amber-600">{item.necessario}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => openAdjustModal(item)}
                                                        className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 text-xs font-bold transition-colors"
                                                    >
                                                        Ajustar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-8 text-center text-sm text-gray-400">
                                                Nenhum livro encontrado com stock ou necessário.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {items.links && items.links.length > 3 && (
                        <div className="flex justify-center">
                            <div className="flex gap-1.5 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
                                {items.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (link.url) {
                                                router.get(link.url, formData, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                });
                                            }
                                        }}
                                        disabled={!link.url}
                                        className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                                            link.active
                                                ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20"
                                                : link.url
                                                  ? "text-gray-500 hover:bg-gray-100"
                                                  : "text-gray-300 cursor-not-allowed"
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Adjust Stock Modal */}
            <Modal show={showAdjustModal} onClose={closeAdjustModal} maxWidth="md">
                <form onSubmit={submitAdjust} className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                        Ajustar Stock
                    </h2>
                    {selectedItem && (
                        <p className="text-sm text-gray-500 mb-4">
                            {selectedItem.titulo}
                        </p>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Operação
                            </label>
                            <select
                                value={adjustForm.data.operacao}
                                onChange={(e) => adjustForm.setData("operacao", e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="ADICIONAR">Adicionar</option>
                                <option value="REMOVER">Remover</option>
                            </select>
                            <InputError message={adjustForm.errors.operacao} className="mt-1" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantidade
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={adjustForm.data.quantidade}
                                onChange={(e) => adjustForm.setData("quantidade", e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Quantidade"
                            />
                            <InputError message={adjustForm.errors.quantidade} className="mt-1" />
                        </div>
                    </div>

                    {adjustForm.errors.livro_id && (
                        <InputError message={adjustForm.errors.livro_id} className="mt-4" />
                    )}

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={closeAdjustModal}
                            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={adjustForm.processing}
                            className="px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
                        >
                            {adjustForm.processing ? "A guardar..." : "Confirmar"}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
