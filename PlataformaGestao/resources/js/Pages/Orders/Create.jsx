import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import {
    FaPlus, FaMinus, FaSearch, FaSpinner,
    FaArrowLeft, FaUser, FaSchool, FaBook, FaExclamationCircle,
    FaTimes
} from 'react-icons/fa';
import axios from 'axios';

export default function CreateOrder({ auth, schools, concelhos, anos_escolares }) {
    const [studentLoading, setStudentLoading] = useState(false);
    const [booksLoading, setBooksLoading] = useState(false);
    const [availableBooks, setAvailableBooks] = useState([]);
    const [cart, setCart] = useState({});
    const [encaparMap, setEncaparMap] = useState({});
    const [debugInfo, setDebugInfo] = useState(null);
    const [selectedConcelho, setSelectedConcelho] = useState('');

    // Modal "Adicionar Livro"
    const [showAddBookModal, setShowAddBookModal] = useState(false);
    const [modalClosing, setModalClosing] = useState(false);
    const [bookSearchQuery, setBookSearchQuery] = useState('');
    const [bookSearchResults, setBookSearchResults] = useState([]);
    const [bookSearchLoading, setBookSearchLoading] = useState(false);

    const { data, setData, post, processing, errors, transform } = useForm({
        nif: '', id_mega: '', nome: '', telefone: '', email: '',
        escola_id: '', ano_escolar_id: '', ano_letivo_id: 1, observacao: '', items: []
    });

    const filteredSchools = selectedConcelho
        ? schools.filter(s => s.concelho_id == selectedConcelho)
        : schools;

    const handleStudentLookup = async (field, value) => {
        if (!value) return;
        setStudentLoading(true);
        try {
            const response = await axios.get('/api/students/lookup', { params: { [field]: value } });
            if (response.data.found) {
                setData(prev => ({
                    ...prev,
                    nome: response.data.nome || prev.nome,
                    telefone: response.data.telefone || prev.telefone,
                    email: response.data.email || prev.email,
                }));
            }
        } catch (error) { console.log('Aluno não encontrado'); }
        finally { setStudentLoading(false); }
    };

    const [manualBooks, setManualBooks] = useState([]);

    useEffect(() => {
        if (data.escola_id && data.ano_escolar_id) {
            loadBooks();
        } else {
            setAvailableBooks(manualBooks);
        }
    }, [data.escola_id, data.ano_escolar_id]);

    const loadBooks = async () => {
        setBooksLoading(true);
        setDebugInfo(null);
        try {
            const response = await axios.get('/api/books/search', {
                params: { escola_id: data.escola_id, ano_escolar_id: data.ano_escolar_id }
            });
            const listaBooks = response.data.books || [];
            const listaIds = new Set(listaBooks.map(b => b.id));
            const extras = manualBooks.filter(b => !listaIds.has(b.id));
            setAvailableBooks([...listaBooks, ...extras]);
            if (response.data.debug) setDebugInfo(response.data.debug);
        } catch (error) {
            setAvailableBooks(manualBooks);
            setDebugInfo({ error: 'Erro ao carregar livros: ' + error.message });
        }
        finally { setBooksLoading(false); }
    };

    const updateQuantity = (bookId, delta) => {
        setCart(prev => {
            const currentQty = prev[bookId] || 0;
            const newQty = Math.max(0, currentQty + delta);
            if (newQty === 0) {
                const { [bookId]: removed, ...rest } = prev;
                return rest;
            }
            return { ...prev, [bookId]: newQty };
        });
    };

    const addAllQuantity = (filterType) => {
        setCart(prev => {
            const updated = { ...prev };
            availableBooks.forEach(book => {
                if (!filterType || book.tipo === filterType) {
                    updated[book.id] = (updated[book.id] || 0) + 1;
                }
            });
            return updated;
        });
    };

    const setEncaparBulk = (filterType) => {
        setEncaparMap(prev => {
            const matching = availableBooks.filter(book => !filterType || book.tipo === filterType);
            const allMarked = matching.length > 0 && matching.every(book => prev[book.id]);
            const updated = { ...prev };
            matching.forEach(book => { updated[book.id] = !allMarked; });
            return updated;
        });
    };

    const toggleEncapar = (bookId) => {
        setEncaparMap(prev => ({ ...prev, [bookId]: !prev[bookId] }));
    };

    // Modal smooth close
    const closeModal = useCallback(() => {
        setModalClosing(true);
        setTimeout(() => {
            setShowAddBookModal(false);
            setModalClosing(false);
            setBookSearchQuery('');
            setBookSearchResults([]);
        }, 200);
    }, []);

    useEffect(() => {
        if (!bookSearchQuery || bookSearchQuery.length < 2) {
            setBookSearchResults([]);
            return;
        }
        const timeout = setTimeout(async () => {
            setBookSearchLoading(true);
            try {
                const response = await axios.get('/api/books/all-search', { params: { q: bookSearchQuery } });
                setBookSearchResults(response.data.books || []);
            } catch (error) {
                setBookSearchResults([]);
            } finally {
                setBookSearchLoading(false);
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [bookSearchQuery]);

    const addBookFromSearch = (book) => {
        if (!manualBooks.find(b => b.id === book.id)) {
            setManualBooks(prev => [...prev, book]);
        }
        if (!availableBooks.find(b => b.id === book.id)) {
            setAvailableBooks(prev => [...prev, book]);
        }
        setCart(prev => prev[book.id] ? prev : { ...prev, [book.id]: 1 });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const items = Object.entries(cart).map(([bookId, quantity]) => ({
            livro_id: parseInt(bookId),
            quantidade: quantity,
            encapar: !!encaparMap[bookId]
        }));
        if (items.length === 0) { alert('Adicione pelo menos um livro'); return; }
        transform((formData) => ({ ...formData, items }));
        post('/encomendas/clientes');
    };

    const total = availableBooks.reduce((sum, book) => sum + (book.preco * (cart[book.id] || 0)), 0);
    const itemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const isFormValid = data.nif && data.nome && data.escola_id && data.ano_escolar_id && itemCount > 0;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Nova Encomenda" />

            {/* White background — negate layout py-8 px-8 to fill edge-to-edge */}
            <div className="-m-8 h-[calc(100vh)] flex flex-col overflow-hidden bg-gray-50/80">

                <div className="flex flex-col h-full max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 py-4">

                    {/* HEADER */}
                    <div className="shrink-0 flex justify-between items-center mb-3 pb-2">
                        <div className="flex items-center gap-3">
                            <a href="/encomendas/clientes"
                               className="w-9 h-9 flex items-center justify-center card-3d rounded-2xl text-gray-500 hover:text-gray-900 hover:scale-105 active:scale-95 transition-all duration-200">
                                <FaArrowLeft className="text-sm" />
                            </a>
                            <div>
                                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Nova Encomenda</h1>
                                <p className="text-[13px] text-gray-500/80 mt-0.5 font-medium">Criação de nova encomenda</p>
                            </div>
                        </div>
                        {studentLoading && (
                            <div className="flex items-center gap-2 card-3d px-4 py-2 rounded-2xl text-indigo-600 text-xs font-bold animate-pulse">
                                <FaSpinner className="animate-spin" /> A pesquisar aluno...
                            </div>
                        )}
                    </div>

                    {/* GRID */}
                    <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">

                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-5 space-y-2.5">

                            {/* Card: Selecionar Escola */}
                            <div className="card-3d overflow-hidden animate-card-in">
                                <div className="px-4 py-2.5 flex items-center gap-2 border-b border-gray-100">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-500/25">
                                        <FaSchool className="text-white text-[10px]" />
                                    </div>
                                    <h3 className="text-[13px] font-bold text-gray-800">Selecionar Escola</h3>
                                </div>
                                <div className="px-4 py-3 grid gap-2.5">
                                    <GlassSelect
                                        label="Concelho" value={selectedConcelho}
                                        onChange={e => { setSelectedConcelho(e.target.value); setData('escola_id', ''); }}
                                        options={concelhos.map(c => ({ value: c.id, label: c.nome }))}
                                        placeholder="Todos os concelhos..."
                                    />
                                    <GlassSelect
                                        label="Escola" value={data.escola_id} error={errors.escola_id}
                                        onChange={e => setData('escola_id', e.target.value)}
                                        options={filteredSchools.map(s => ({ value: s.id, label: s.nome }))}
                                        placeholder="Selecione a escola..."
                                    />
                                    <GlassSelect
                                        label="Ano Escolar" value={data.ano_escolar_id} error={errors.ano_escolar_id}
                                        onChange={e => setData('ano_escolar_id', e.target.value)}
                                        options={anos_escolares.map(a => ({ value: a.id, label: a.nome }))}
                                        placeholder="Selecione o ano..."
                                    />
                                </div>
                            </div>

                            {/* Card: Dados do Aluno */}
                            <div className="card-3d overflow-hidden animate-card-in-delay">
                                <div className="px-4 py-2.5 flex items-center gap-2 border-b border-gray-100">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm shadow-violet-500/25">
                                        <FaUser className="text-white text-[10px]" />
                                    </div>
                                    <h3 className="text-[13px] font-bold text-gray-800">Dados do Aluno</h3>
                                </div>
                                <div className="px-4 py-3 space-y-2.5">
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <GlassInput
                                            label="NIF" value={data.nif} error={errors.nif}
                                            onChange={e => setData('nif', e.target.value)}
                                            onBlur={e => handleStudentLookup('nif', e.target.value)}
                                            placeholder="123456789"
                                        />
                                        <GlassInput
                                            label="ID Mega" value={data.id_mega}
                                            onChange={e => setData('id_mega', e.target.value)}
                                            onBlur={e => handleStudentLookup('id_mega', e.target.value)}
                                            placeholder="Opcional"
                                        />
                                    </div>
                                    <GlassInput
                                        label="Nome Completo" value={data.nome} error={errors.nome}
                                        onChange={e => setData('nome', e.target.value)}
                                        placeholder="Nome do aluno"
                                    />
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <GlassInput
                                            label="Telefone" value={data.telefone}
                                            onChange={e => setData('telefone', e.target.value)}
                                            placeholder="910..."
                                        />
                                        <GlassInput
                                            label="Email" type="email" value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="email@exemplo.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Notas Adicionais</label>
                                        <textarea
                                            value={data.observacao}
                                            onChange={e => setData('observacao', e.target.value)}
                                            rows={1}
                                            className="glass-input w-full px-3.5 py-1.5 text-sm rounded-xl placeholder:text-gray-400/70 resize-none"
                                            placeholder="Notas internas..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: BOOKS */}
                        <div className="lg:col-span-7 h-full min-h-0">
                            <div className="card-3d flex flex-col h-full overflow-hidden animate-card-in">

                                {/* Header */}
                                <div className="shrink-0 px-5 py-3 border-b border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm shadow-emerald-500/25">
                                                <FaBook className="text-white text-xs" />
                                            </div>
                                            <h3 className="text-[13px] font-bold text-gray-800">Manuais Disponíveis</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {booksLoading && <FaSpinner className="animate-spin text-indigo-500" />}
                                            {!booksLoading && availableBooks.length > 0 && (<>
                                                <span className="text-[11px] bg-blue-500/10 text-blue-700 px-2.5 py-1 rounded-lg font-semibold">
                                                    {availableBooks.filter(b => b.tipo === 'Manual').length} manuais
                                                </span>
                                                <span className="text-[11px] bg-emerald-500/10 text-emerald-700 px-2.5 py-1 rounded-lg font-semibold">
                                                    {availableBooks.filter(b => b.tipo === 'Caderno').length} cadernos
                                                </span>
                                            </>)}
                                            <button
                                                type="button"
                                                onClick={() => setShowAddBookModal(true)}
                                                className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-500/10 hover:bg-indigo-500/15 px-3 py-1.5 rounded-xl transition-all duration-200 active:scale-95"
                                            >
                                                <FaPlus className="text-[8px]" /> Adicionar Livro
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quick action buttons */}
                                    {availableBooks.length > 0 && (
                                        <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase mr-0.5">Qtd:</span>
                                            <PillBtn label="1x Tudo" onClick={() => addAllQuantity(null)} />
                                            <PillBtn label="1x Manuais" onClick={() => addAllQuantity('Manual')} />
                                            <PillBtn label="1x Cadernos" onClick={() => addAllQuantity('Caderno')} />
                                            <div className="w-px h-4 bg-gray-200/80 mx-1" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase mr-0.5">Encapar:</span>
                                            <PillBtn label="Tudo" onClick={() => setEncaparBulk(null)} variant="amber" />
                                            <PillBtn label="Manuais" onClick={() => setEncaparBulk('Manual')} variant="amber" />
                                        </div>
                                    )}
                                </div>

                                {/* Table header */}
                                <div className="grid grid-cols-12 gap-2 px-5 py-2 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                                    <div className="col-span-5">Livro</div>
                                    <div className="col-span-2 text-right">Preço</div>
                                    <div className="col-span-3 text-center">Qtd.</div>
                                    <div className="col-span-2 text-center">Encapar</div>
                                </div>

                                {/* Book list */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                                    {availableBooks.length === 0 && (!data.escola_id || !data.ano_escolar_id) ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                                            <FaSchool className="text-3xl mb-3 opacity-20" />
                                            <p className="text-sm font-medium">Selecione Escola e Ano ou adicione livros manualmente</p>
                                        </div>
                                    ) : availableBooks.length === 0 && !booksLoading ? (
                                        <div className="h-full flex flex-col items-center justify-center p-8">
                                            <FaExclamationCircle className="text-3xl mb-3 text-amber-400 opacity-50" />
                                            <p className="text-sm text-gray-600 font-semibold mb-4">Nenhum livro encontrado</p>
                                        </div>
                                    ) : (
                                        <div>
                                            {availableBooks.map(book => {
                                                const qty = cart[book.id] || 0;
                                                const isSelected = qty > 0;
                                                const isEncapar = !!encaparMap[book.id];
                                                return (
                                                    <div key={book.id}
                                                         className={`grid grid-cols-12 gap-2 px-5 py-2.5 items-center transition-all duration-200 border-b border-gray-100/50 ${isSelected ? 'bg-indigo-50/70 border-l-[3px] border-l-indigo-500 pl-[calc(1.25rem-3px)]' : 'hover:bg-gray-50/60 border-l-[3px] border-l-transparent'}`}>
                                                        <div className="col-span-5 overflow-hidden">
                                                            <p className={`text-[13px] font-semibold truncate ${isSelected ? 'text-indigo-900' : 'text-gray-800'}`}>{book.titulo}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <p className="text-[11px] text-gray-400 truncate">{book.isbn}</p>
                                                                <TypeBadge tipo={book.tipo} />
                                                            </div>
                                                        </div>
                                                        <div className="col-span-2 text-right">
                                                            <p className="text-[13px] font-bold text-gray-800">{parseFloat(book.preco).toFixed(2)}€</p>
                                                        </div>
                                                        <div className="col-span-3 flex justify-center items-center gap-1.5">
                                                            <button type="button" onClick={() => updateQuantity(book.id, -1)} disabled={qty === 0}
                                                                className="w-7 h-7 flex items-center justify-center rounded-[10px] bg-white border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 active:scale-90">
                                                                <FaMinus className="text-[10px]" />
                                                            </button>
                                                            <span className={`w-7 text-center font-bold text-[13px] tabular-nums ${isSelected ? 'text-indigo-600' : 'text-gray-300'}`}>{qty}</span>
                                                            <button type="button" onClick={() => updateQuantity(book.id, 1)}
                                                                className="w-7 h-7 flex items-center justify-center rounded-[10px] bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/30 transition-all duration-200 active:scale-90">
                                                                <FaPlus className="text-[10px]" />
                                                            </button>
                                                        </div>
                                                        <div className="col-span-2 flex justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleEncapar(book.id)}
                                                                className={`w-7 h-7 flex items-center justify-center rounded-[10px] border transition-all duration-200 active:scale-90 ${isEncapar ? 'bg-gradient-to-b from-amber-400 to-amber-500 border-amber-400 text-white shadow-sm shadow-amber-500/30' : 'bg-white border-gray-200 text-gray-300 hover:border-amber-300 hover:bg-amber-50'}`}
                                                            >
                                                                {isEncapar && <span className="text-xs font-bold">✓</span>}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="shrink-0 border-t border-gray-100 px-5 py-3.5 flex items-center justify-between bg-gray-50/50">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Total Estimado</p>
                                        <div className="flex items-baseline gap-2.5">
                                            <p className="text-2xl font-extrabold text-gray-900 tracking-tight tabular-nums">{total.toFixed(2)}€</p>
                                            <span className="text-[11px] font-semibold text-gray-500 bg-gray-900/[0.05] px-2.5 py-0.5 rounded-lg">{itemCount} itens</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!isFormValid || processing}
                                        className="px-7 py-3 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.97] flex items-center gap-2.5"
                                    >
                                        {processing ? (
                                            <FaSpinner className="animate-spin" />
                                        ) : (
                                            <>
                                                <FaPlus className="text-xs" />
                                                <span>Criar Encomenda</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal "Adicionar Livro" */}
            {showAddBookModal && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center ${modalClosing ? '' : 'animate-backdrop-in'}`}
                     style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
                     onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div className={`card-3d rounded-3xl w-full max-w-lg mx-4 flex flex-col max-h-[80vh] ${modalClosing ? 'animate-modal-out' : 'animate-modal-in'}`}>
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-extrabold text-gray-900">Adicionar Livro</h3>
                            <button type="button" onClick={closeModal}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100/60 rounded-xl transition-all duration-200 active:scale-90">
                                <FaTimes className="text-sm" />
                            </button>
                        </div>
                        {/* Search field */}
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="relative">
                                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    value={bookSearchQuery}
                                    onChange={e => setBookSearchQuery(e.target.value)}
                                    placeholder="Pesquisar por título ou ISBN..."
                                    className="glass-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl placeholder:text-gray-400/70"
                                    autoFocus
                                />
                                {bookSearchLoading && <FaSpinner className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-indigo-500" />}
                            </div>
                        </div>
                        {/* Results */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {bookSearchResults.length === 0 && bookSearchQuery.length >= 2 && !bookSearchLoading ? (
                                <div className="p-8 text-center text-gray-400 text-sm font-medium">Nenhum livro encontrado</div>
                            ) : (
                                <div className="px-2 py-1.5">
                                    {bookSearchResults.map(book => {
                                        const alreadyAdded = !!availableBooks.find(b => b.id === book.id);
                                        return (
                                            <div key={book.id} className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-150 group">
                                                <div className="flex items-center gap-3 overflow-hidden mr-3">
                                                    <TypeBadge tipo={book.tipo} size="md" />
                                                    <div className="overflow-hidden">
                                                        <p className="text-[13px] font-semibold text-gray-900 truncate">{book.titulo}</p>
                                                        <p className="text-[11px] text-gray-400 truncate">{book.editora_nome} &middot; {book.isbn}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className="text-[13px] font-bold text-gray-700">{parseFloat(book.preco).toFixed(2)}€</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => addBookFromSearch(book)}
                                                        disabled={alreadyAdded}
                                                        className="px-3.5 py-1.5 text-[11px] font-bold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-500/25 hover:shadow-md"
                                                    >
                                                        {alreadyAdded ? 'Adicionado' : 'Adicionar'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            {bookSearchQuery.length < 2 && (
                                <div className="p-8 text-center text-gray-400 text-sm font-medium">
                                    Escreva pelo menos 2 caracteres para pesquisar
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

// ── Subcomponents ──

function TypeBadge({ tipo, size = 'sm' }) {
    const isManual = tipo === 'Manual';
    const cls = size === 'sm'
        ? 'text-[9px] px-1.5 py-0.5 rounded-md'
        : 'text-[10px] px-2 py-1 rounded-lg min-w-[52px] text-center';
    return (
        <span className={`font-bold shrink-0 ${cls} ${isManual ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
            {tipo}
        </span>
    );
}

function PillBtn({ label, onClick, variant = 'indigo' }) {
    const styles = {
        indigo: 'bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/15 active:bg-indigo-500/20',
        amber: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 active:bg-amber-500/20',
    };
    return (
        <button type="button" onClick={onClick}
            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all duration-150 active:scale-95 ${styles[variant]}`}>
            {label}
        </button>
    );
}

function GlassInput({ label, value, onChange, onBlur, type = "text", placeholder, error }) {
    return (
        <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
            <input type={type} value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder}
                className={`glass-input w-full px-3.5 py-2 text-sm rounded-xl placeholder:text-gray-400/70 ${error ? '!border-red-300 !bg-red-50/40' : ''}`} />
            {error && <p className="text-[11px] text-red-500 mt-1 font-medium">{error}</p>}
        </div>
    );
}

function GlassSelect({ label, value, onChange, options, placeholder, error }) {
    return (
        <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
            <select value={value} onChange={onChange}
                className={`glass-input w-full px-3.5 py-2 text-sm rounded-xl ${error ? '!border-red-300 !bg-red-50/40' : ''}`}>
                <option value="">{placeholder}</option>
                {options.map((opt, i) => (<option key={i} value={opt.value}>{opt.label}</option>))}
            </select>
            {error && <p className="text-[11px] text-red-500 mt-1 font-medium">{error}</p>}
        </div>
    );
}
