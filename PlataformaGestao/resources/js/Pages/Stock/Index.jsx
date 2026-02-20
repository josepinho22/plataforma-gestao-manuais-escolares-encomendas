import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState, useRef } from "react";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Modal from "@/Components/Modal";
import InputError from "@/Components/InputError";

export default function StockIndex({
    items,
    totalInStock,
    filters,
    disciplinas,
    editoras,
    anosEscolares,
}) {
    const [formData, setFormData] = useState({
        q: filters?.q ?? "",
        disciplina_id: filters?.disciplina_id ?? "",
        editora_id: filters?.editora_id ?? "",
        ano_escolar_id: filters?.ano_escolar_id ?? "",
    });
    const filterTimerRef = useRef(null);

    const handleQChange = (value) => {
        const next = { ...formData, q: value };
        setFormData(next);
        clearTimeout(filterTimerRef.current);
        filterTimerRef.current = setTimeout(() => {
            router.get("/stock", next, {
                preserveState: true,
                preserveScroll: true,
                only: ["items", "totalInStock", "filters"],
            });
        }, 300);
    };

    const handleSelectChange = (field, value) => {
        const next = { ...formData, [field]: value };
        setFormData(next);
        router.get("/stock", next, {
            preserveState: true,
            preserveScroll: true,
            only: ["items", "totalInStock", "filters"],
        });
    };

    const handleClear = () => {
        clearTimeout(filterTimerRef.current);
        const empty = { q: "", disciplina_id: "", editora_id: "", ano_escolar_id: "" };
        setFormData(empty);
        router.get("/stock", {}, {
            preserveState: true,
            preserveScroll: true,
            only: ["items", "totalInStock", "filters"],
        });
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

    // ── Add Stock modal ──────────────────────────────────────────────────────
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedLivro, setSelectedLivro] = useState(null);
    const searchTimerRef = useRef(null);

    const addForm = useForm({
        livro_id: "",
        quantidade: "",
    });

    const openAddModal = () => setShowAddModal(true);

    const closeAddModal = () => {
        clearTimeout(searchTimerRef.current);
        setShowAddModal(false);
        setSearchTerm("");
        setSearchResults([]);
        setSelectedLivro(null);
        addForm.reset();
        addForm.clearErrors();
    };

    const handleSearchTermChange = (value) => {
        setSearchTerm(value);
        setSelectedLivro(null);
        addForm.setData("livro_id", "");
        clearTimeout(searchTimerRef.current);

        if (value.length < 2) {
            setSearchResults([]);
            return;
        }

        searchTimerRef.current = setTimeout(() => {
            fetch(`/livros/search?q=${encodeURIComponent(value)}`)
                .then((res) => res.json())
                .then((data) => setSearchResults(data))
                .catch(() => setSearchResults([]));
        }, 300);
    };

    const selectLivro = (livro) => {
        setSelectedLivro(livro);
        addForm.setData("livro_id", livro.id);
        setSearchResults([]);
        setSearchTerm("");
    };

    const submitAdd = (e) => {
        e.preventDefault();
        if (!addForm.data.livro_id) return;
        addForm.post("/stock/add", {
            preserveScroll: true,
            onSuccess: () => closeAddModal(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Stock" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Stock</h1>
                    <p className="text-gray-500 text-sm">
                        Gestão de stock de manuais escolares
                    </p>
                </div>

                {/* Total em Stock Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Total em Stock
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                        {totalInStock || 0}
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="md:col-span-2 lg:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pesquisar (Título / ISBN)
                                </label>
                                <TextInput
                                    type="text"
                                    value={formData.q}
                                    onChange={(e) => handleQChange(e.target.value)}
                                    placeholder="Título ou ISBN..."
                                    className="w-full"
                                    autoComplete="off"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Disciplina
                                </label>
                                <select
                                    value={formData.disciplina_id}
                                    onChange={(e) => handleSelectChange("disciplina_id", e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Editora
                                </label>
                                <select
                                    value={formData.editora_id}
                                    onChange={(e) => handleSelectChange("editora_id", e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ano Escolar
                                </label>
                                <select
                                    value={formData.ano_escolar_id}
                                    onChange={(e) => handleSelectChange("ano_escolar_id", e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

                        <div className="flex justify-end">
                            <SecondaryButton type="button" onClick={handleClear}>
                                Limpar
                            </SecondaryButton>
                        </div>
                    </div>
                </div>

                {/* Add book to stock button */}
                <div>
                    <button
                        type="button"
                        onClick={openAddModal}
                        className="inline-flex items-center gap-1 rounded-md bg-gray-800 hover:bg-gray-700 px-4 py-2 text-sm font-semibold text-white transition"
                    >
                        <span className="text-lg leading-none">+</span>
                        Adicionar Livro ao Stock
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ano
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Disciplina
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Título
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Editora
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ISBN
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cód. Editora
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Necessário
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.data && items.data.length > 0 ? (
                                    items.data.map((item) => (
                                        <tr
                                            key={item.livro_id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.ano_escolar_id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.disciplina_nome || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {item.titulo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.editora_nome || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.isbn}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.editora_codigo || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                {item.stock_qtd}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                                                {item.necessario}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() =>
                                                        openAdjustModal(item)
                                                    }
                                                    className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs font-medium transition"
                                                >
                                                    Ajustar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="px-6 py-8 text-center text-sm text-gray-500"
                                        >
                                            Nenhum livro encontrado com stock ou
                                            necessário.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {items.links && items.links.length > 3 && (
                    <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex flex-wrap gap-1">
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
                                    className={`px-3 py-2 text-sm font-medium rounded ${
                                        link.active
                                            ? "bg-gray-800 text-white"
                                            : link.url
                                              ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Stock Modal */}
            <Modal show={showAddModal} onClose={closeAddModal} maxWidth="md">
                <form onSubmit={submitAdd} className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Adicionar Livro ao Stock
                    </h2>

                    <div className="space-y-4">
                        {/* Search input + autocomplete dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Pesquisar Livro
                            </label>
                            <div className="relative">
                                <TextInput
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        handleSearchTermChange(e.target.value)
                                    }
                                    placeholder="Título ou ISBN..."
                                    className="w-full"
                                    autoComplete="off"
                                />

                                {searchTerm.length >= 2 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                        {searchResults.length > 0 ? (
                                            searchResults.map((livro) => (
                                                <button
                                                    key={livro.id}
                                                    type="button"
                                                    onClick={() =>
                                                        selectLivro(livro)
                                                    }
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none"
                                                >
                                                    <span className="font-medium text-gray-900">
                                                        {livro.titulo}
                                                    </span>
                                                    {livro.isbn && (
                                                        <span className="ml-2 text-xs text-gray-400">
                                                            {livro.isbn}
                                                        </span>
                                                    )}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-gray-500">
                                                Nenhum livro encontrado.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Selected livro pill */}
                        {selectedLivro && (
                            <div className="flex items-center justify-between rounded-md bg-indigo-50 border border-indigo-200 px-3 py-2">
                                <div>
                                    <span className="text-sm font-medium text-indigo-800">
                                        {selectedLivro.titulo}
                                    </span>
                                    {selectedLivro.isbn && (
                                        <span className="ml-2 text-xs text-indigo-500">
                                            {selectedLivro.isbn}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedLivro(null);
                                        addForm.setData("livro_id", "");
                                    }}
                                    className="ml-3 text-indigo-400 hover:text-indigo-600 text-xs font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        <InputError
                            message={addForm.errors.livro_id}
                            className="mt-1"
                        />

                        {/* Quantidade */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantidade
                            </label>
                            <TextInput
                                type="number"
                                min="1"
                                value={addForm.data.quantidade}
                                onChange={(e) =>
                                    addForm.setData(
                                        "quantidade",
                                        e.target.value,
                                    )
                                }
                                className="w-full"
                                placeholder="Quantidade a adicionar"
                            />
                            <InputError
                                message={addForm.errors.quantidade}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <SecondaryButton type="button" onClick={closeAddModal}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            disabled={
                                addForm.processing || !addForm.data.livro_id
                            }
                        >
                            {addForm.processing ? "A guardar..." : "Confirmar"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Adjust Stock Modal */}
            <Modal
                show={showAdjustModal}
                onClose={closeAdjustModal}
                maxWidth="md"
            >
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
                                onChange={(e) =>
                                    adjustForm.setData(
                                        "operacao",
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="ADICIONAR">Adicionar</option>
                                <option value="REMOVER">Remover</option>
                            </select>
                            <InputError
                                message={adjustForm.errors.operacao}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantidade
                            </label>
                            <TextInput
                                type="number"
                                min="1"
                                value={adjustForm.data.quantidade}
                                onChange={(e) =>
                                    adjustForm.setData(
                                        "quantidade",
                                        e.target.value,
                                    )
                                }
                                className="w-full"
                                placeholder="Quantidade"
                            />
                            <InputError
                                message={adjustForm.errors.quantidade}
                                className="mt-1"
                            />
                        </div>

                    </div>

                    {adjustForm.errors.livro_id && (
                        <InputError
                            message={adjustForm.errors.livro_id}
                            className="mt-4"
                        />
                    )}

                    <div className="flex justify-end gap-2 mt-6">
                        <SecondaryButton
                            type="button"
                            onClick={closeAdjustModal}
                        >
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            disabled={adjustForm.processing}
                        >
                            {adjustForm.processing
                                ? "A guardar..."
                                : "Confirmar"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
