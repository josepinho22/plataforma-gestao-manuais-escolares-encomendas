import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    FaPlus, FaMinus, FaSearch, FaSpinner, 
    FaArrowLeft, FaUser, FaSchool, FaBook, FaSave, FaExclamationCircle 
} from 'react-icons/fa';
import axios from 'axios';

export default function CreateOrder({ auth, schools, anos_escolares }) {
    // --- LÓGICA (Mantida igual) ---
    const [studentLoading, setStudentLoading] = useState(false);
    const [booksLoading, setBooksLoading] = useState(false);
    const [availableBooks, setAvailableBooks] = useState([]);
    const [cart, setCart] = useState({});
    const [debugInfo, setDebugInfo] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        nif: '', id_mega: '', nome: '', telefone: '', email: '',
        escola_id: '', ano_escolar_id: '', ano_letivo_id: 1, observacao: '', items: []
    });

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

    useEffect(() => {
        if (data.escola_id && data.ano_escolar_id) {
            loadBooks();
        } else {
            setAvailableBooks([]);
            setCart({});
        }
    }, [data.escola_id, data.ano_escolar_id]);

    const loadBooks = async () => {
        setBooksLoading(true);
        setDebugInfo(null);
        try {
            const response = await axios.get('/api/books/search', {
                params: { escola_id: data.escola_id, ano_escolar_id: data.ano_escolar_id }
            });
            setAvailableBooks(response.data.books || []);

            // Mostrar informações de debug se não houver livros
            if (response.data.debug) {
                setDebugInfo(response.data.debug);
            }
        } catch (error) {
            setAvailableBooks([]);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const items = Object.entries(cart).map(([bookId, quantity]) => ({
            livro_id: parseInt(bookId),
            quantidade: quantity,
            encapar: false
        }));
        if (items.length === 0) { alert('Adicione pelo menos um livro'); return; }
        post('/encomendas', { ...data, items });
    };

    const total = availableBooks.reduce((sum, book) => sum + (book.preco * (cart[book.id] || 0)), 0);
    const itemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const isFormValid = data.nif && data.nome && data.escola_id && data.ano_escolar_id && itemCount > 0;

    // --- RENDERIZAÇÃO 100% VH ---

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Nova Encomenda" />

            {/* Container Principal fixo na altura da janela (menos navbar) */}
            <div className="h-[calc(100vh-65px)] flex flex-col max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 overflow-hidden">
                
                {/* 1. HEADER (Fixo no topo) */}
                <div className="shrink-0 flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <a href="/encomendas" className="p-2 -ml-2 hover:bg-white rounded-full transition text-gray-500 hover:text-gray-900">
                            <FaArrowLeft />
                        </a>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Nova Encomenda</h1>
                            <p className="text-sm text-gray-500 mt-0.5">Criação de nova encomenda</p>
                        </div>
                    </div>
                    {studentLoading && (
                        <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-bold animate-pulse">
                            <FaSpinner className="animate-spin" /> A pesquisar aluno...
                        </div>
                    )}
                </div>

                {/* 2. GRID DE CONTEÚDO (Preenche o resto da altura) */}
                <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                    
                    {/* --- COLUNA ESQUERDA: FORMULÁRIOS (Scrollável se necessário) --- */}
                    <div className="lg:col-span-5 overflow-y-auto pr-2 space-y-5 custom-scrollbar">
                        
                        {/* Card: Contexto Escolar */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
                                <FaSchool className="text-gray-400 text-sm" />
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contexto Escolar</h3>
                            </div>
                            <div className="p-5 grid gap-4">
                                <SelectInput 
                                    label="Escola" value={data.escola_id} error={errors.escola_id}
                                    onChange={e => setData('escola_id', e.target.value)}
                                    options={schools.map(s => ({ value: s.id, label: s.nome }))}
                                    placeholder="Selecione a escola..."
                                />
                                <SelectInput 
                                    label="Ano Escolar" value={data.ano_escolar_id} error={errors.ano_escolar_id}
                                    onChange={e => setData('ano_escolar_id', e.target.value)}
                                    options={anos_escolares.map(a => ({ value: a.id, label: a.nome }))}
                                    placeholder="Selecione o ano..."
                                />
                            </div>
                        </div>

                        {/* Card: Dados do Aluno */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
                                <FaUser className="text-gray-400 text-sm" />
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dados do Aluno</h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <TextInput 
                                        label="NIF" value={data.nif} error={errors.nif}
                                        onChange={e => setData('nif', e.target.value)}
                                        onBlur={e => handleStudentLookup('nif', e.target.value)}
                                        placeholder="123456789"
                                    />
                                    <TextInput 
                                        label="ID Mega" value={data.id_mega}
                                        onChange={e => setData('id_mega', e.target.value)}
                                        onBlur={e => handleStudentLookup('id_mega', e.target.value)}
                                        placeholder="Opcional"
                                    />
                                </div>
                                <TextInput 
                                    label="Nome Completo" value={data.nome} error={errors.nome}
                                    onChange={e => setData('nome', e.target.value)}
                                    placeholder="Nome do aluno"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <TextInput 
                                        label="Telefone" value={data.telefone}
                                        onChange={e => setData('telefone', e.target.value)}
                                        placeholder="910..."
                                    />
                                    <TextInput 
                                        label="Email" type="email" value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="email@exemplo.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Observação</label>
                                    <textarea
                                        value={data.observacao}
                                        onChange={e => setData('observacao', e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                        placeholder="Notas internas..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- COLUNA DIREITA: CARTÃO ÚNICO (Header + Lista + Footer de Ação) --- */}
                    <div className="lg:col-span-7 h-full min-h-0">
                        <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-full shadow-sm overflow-hidden">
                            
                            {/* A. Header do Cartão */}
                            <div className="shrink-0 px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
                                <div className="flex items-center gap-2">
                                    <FaBook className="text-gray-400" />
                                    <h3 className="text-sm font-bold text-gray-900">Manuais Disponíveis</h3>
                                </div>
                                {booksLoading && <FaSpinner className="animate-spin text-indigo-600" />}
                                {!booksLoading && availableBooks.length > 0 && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200 font-medium">
                                        {availableBooks.length} manuais
                                    </span>
                                )}
                            </div>

                            {/* B. Lista Scrollável (Flex-1 para ocupar o espaço disponível) */}
                            <div className="flex-1 overflow-y-auto bg-gray-50/30 custom-scrollbar relative">
                                {/* Header Tabela Fixo */}
                                <div className="grid grid-cols-12 gap-4 px-6 py-2 bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider sticky top-0 z-10">
                                    <div className="col-span-7">Livro</div>
                                    <div className="col-span-2 text-right">Preço</div>
                                    <div className="col-span-3 text-center">Qtd.</div>
                                </div>

                                {/* Conteúdo da Lista */}
                                {!data.escola_id || !data.ano_escolar_id ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                                        <FaSchool className="text-3xl mb-3 opacity-20" />
                                        <p className="text-sm">Selecione Escola e Ano</p>
                                    </div>
                                ) : availableBooks.length === 0 && !booksLoading ? (
                                    <div className="h-full flex flex-col items-center justify-center p-8">
                                        <FaExclamationCircle className="text-3xl mb-3 text-amber-400 opacity-40" />
                                        <p className="text-sm text-gray-600 font-medium mb-4">Nenhum livro encontrado</p>

                                        {/* Informações de Debug */}
                                        {debugInfo && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md text-left">
                                                <p className="text-xs font-bold text-amber-800 uppercase mb-2">Informação de Debug:</p>

                                                {debugInfo.error && (
                                                    <p className="text-sm text-amber-900 mb-2">
                                                        <span className="font-semibold">Problema:</span> {debugInfo.error}
                                                    </p>
                                                )}

                                                {debugInfo.solucao && (
                                                    <p className="text-sm text-amber-900 mb-3">
                                                        <span className="font-semibold">Solução:</span> {debugInfo.solucao}
                                                    </p>
                                                )}

                                                <div className="text-xs text-amber-700 space-y-1 bg-white/50 p-2 rounded">
                                                    {debugInfo.escola_id && <p>• Escola ID: {debugInfo.escola_id}</p>}
                                                    {debugInfo.ano_escolar_id && <p>• Ano Escolar ID: {debugInfo.ano_escolar_id}</p>}
                                                    {debugInfo.ano_letivo_id && <p>• Ano Letivo ID: {debugInfo.ano_letivo_id} ({debugInfo.ano_letivo_nome})</p>}
                                                    {debugInfo.lista_id && <p>• Lista ID: {debugInfo.lista_id}</p>}
                                                    {debugInfo.lista_itens_count !== undefined && <p>• Itens na lista: {debugInfo.lista_itens_count}</p>}
                                                    {debugInfo.books_found !== undefined && <p>• Livros encontrados: {debugInfo.books_found}</p>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 bg-white">
                                        {availableBooks.map(book => {
                                            const qty = cart[book.id] || 0;
                                            const isSelected = qty > 0;
                                            return (
                                                <div key={book.id} className={`grid grid-cols-12 gap-4 px-6 py-3 items-center transition ${isSelected ? 'bg-indigo-50/60 border-l-4 border-indigo-500 pl-[calc(1.5rem-4px)]' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}>
                                                    <div className="col-span-7 overflow-hidden">
                                                        <p className={`text-sm font-medium truncate ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>{book.titulo}</p>
                                                        <p className="text-xs text-gray-500 truncate mt-0.5">{book.isbn}</p>
                                                    </div>
                                                    <div className="col-span-2 text-right">
                                                        <p className="text-sm font-bold text-gray-900">€{parseFloat(book.preco).toFixed(2)}</p>
                                                    </div>
                                                    <div className="col-span-3 flex justify-center items-center gap-2">
                                                        <button type="button" onClick={() => updateQuantity(book.id, -1)} disabled={qty === 0}
                                                            className="w-7 h-7 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition">
                                                            <FaMinus className="text-[10px]" />
                                                        </button>
                                                        <span className={`w-6 text-center font-bold text-sm ${isSelected ? 'text-indigo-600' : 'text-gray-300'}`}>{qty}</span>
                                                        <button type="button" onClick={() => updateQuantity(book.id, 1)}
                                                            className="w-7 h-7 flex items-center justify-center rounded bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition">
                                                            <FaPlus className="text-[10px]" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* C. Footer / Action Area (Integrado no mesmo card) */}
                            <div className="shrink-0 bg-gray-50 border-t border-gray-200 p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Total Estimado</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold text-gray-900 tracking-tight">€{total.toFixed(2)}</p>
                                        <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{itemCount} itens</span>
                                    </div>
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={!isFormValid || processing}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                                >
                                    {processing ? <FaSpinner className="animate-spin" /> : <><FaSave /> <span>Criar Encomenda</span></>}
                                </button>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

// --- COMPONENTES AUXILIARES ---
function TextInput({ label, value, onChange, onBlur, type = "text", placeholder, error }) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
            <input type={type} value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder}
                className={`w-full px-3 py-2 text-sm rounded-lg shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'}`} />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}
function SelectInput({ label, value, onChange, options, placeholder, error }) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
            <select value={value} onChange={onChange}
                className={`w-full px-3 py-2 text-sm rounded-lg shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'}`}>
                <option value="">{placeholder}</option>
                {options.map((opt, idx) => (<option key={idx} value={opt.value}>{opt.label}</option>))}
            </select>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}