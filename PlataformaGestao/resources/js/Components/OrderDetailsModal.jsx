import { useState, useEffect } from 'react';
import { FaTimes, FaCheckCircle, FaHistory, FaTrash, FaFilePdf, FaEdit, FaSave, FaSearch, FaSpinner } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function OrderDetailsModal({ order: initialOrder, onClose, onSave }) {
    const [order, setOrder] = useState(initialOrder);
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('items');
    const [deleting, setDeleting] = useState(false);
    const [bulkLoading, setBulkLoading] = useState(false);
    const [modalClosing, setModalClosing] = useState(false);

    // Estado de edicao inline
    const [editingItemId, setEditingItemId] = useState(null);
    const [editQty, setEditQty] = useState('');
    const [editSaving, setEditSaving] = useState(false);

    // Pesquisa de livro para troca
    const [swapItemId, setSwapItemId] = useState(null);
    const [swapQuery, setSwapQuery] = useState('');
    const [swapResults, setSwapResults] = useState([]);
    const [swapLoading, setSwapLoading] = useState(false);

    const closeModal = () => {
        setModalClosing(true);
        setTimeout(() => {
            onClose();
        }, 200);
    };

    const saveModal = () => {
        setModalClosing(true);
        setTimeout(() => {
            (onSave ?? onClose)();
        }, 200);
    };

    useEffect(() => {
        loadHistory();
        normalizeItems();
    }, []);

    const loadHistory = async () => {
        try {
            const response = await axios.get(`/api/orders/${order.id}/history`);
            setHistory(response.data.history);
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        }
    };

    // Dividir itens legados com qty>1 em linhas individuais
    const normalizeItems = async () => {
        const hasMultiple = initialOrder.items.some(i => i.quantity > 1);
        if (!hasMultiple) return;
        try {
            const response = await axios.post(`/api/orders/${initialOrder.id}/normalize-items`);
            if (response.data.success) {
                setOrder(prev => ({ ...prev, items: response.data.items }));
            }
        } catch (error) {
            console.error('Erro ao normalizar itens:', error);
        }
    };

    // Atualizar checkbox de item (Optimistic UI)
    const handleCheckboxChange = async (itemId, field, currentValue) => {
        const newValue = !currentValue;
        const currentItem = order.items.find(i => i.id === itemId);

        setOrder(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if (item.id === itemId) return { ...item, [field]: newValue };
                // Para ensacado: atualizar stock_disponivel dos itens do mesmo livro
                if (field === 'ensacado' && currentItem && item.livro_id === currentItem.livro_id && !item.ensacado) {
                    const delta = newValue ? -1 : 1;
                    return { ...item, stock_disponivel: Math.max(0, (item.stock_disponivel ?? 0) + delta) };
                }
                return item;
            })
        }));

        try {
            const response = await axios.patch(`/api/orders/${order.id}/items/${itemId}`, { field, value: newValue });
            // Sincronizar stock real do servidor para todos os itens do mesmo livro
            if (field === 'ensacado' && response.data.item?.stock_disponivel !== undefined) {
                const serverStock = response.data.item.stock_disponivel;
                setOrder(prev => ({
                    ...prev,
                    items: prev.items.map(item => {
                        if (!currentItem) return item;
                        if (item.livro_id === currentItem.livro_id && !item.ensacado) {
                            return { ...item, stock_disponivel: serverStock };
                        }
                        if (item.id === itemId) return { ...item, stock_disponivel: serverStock };
                        return item;
                    })
                }));
            }
            loadHistory();
        } catch (error) {
            // Reverter alterações optimistas
            setOrder(prev => ({
                ...prev,
                items: prev.items.map(item => {
                    if (item.id === itemId) return { ...item, [field]: currentValue };
                    if (field === 'ensacado' && currentItem && item.livro_id === currentItem.livro_id && !item.ensacado) {
                        const delta = newValue ? 1 : -1;
                        return { ...item, stock_disponivel: Math.max(0, (item.stock_disponivel ?? 0) + delta) };
                    }
                    return item;
                })
            }));
            alert('Erro ao atualizar item. Tente novamente.');
        }
    };

    // Ação em massa com toggle: se todos já marcados → desmarcar, senão → marcar
    const handleBulkAction = async (field) => {
        const relevantItems = field === 'encapado'
            ? order.items.filter(item => item.encapar)
            : order.items;

        if (relevantItems.length === 0) return;

        const allMarked = relevantItems.every(item => item[field]);
        const targetValue = !allMarked;

        const itemsToUpdate = relevantItems.filter(item => item[field] !== targetValue);
        if (itemsToUpdate.length === 0) return;

        setBulkLoading(true);
        setOrder(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if (field === 'encapado' && !item.encapar) return item;
                return { ...item, [field]: targetValue };
            })
        }));
        try {
            await Promise.all(
                itemsToUpdate.map(item =>
                    axios.patch(`/api/orders/${order.id}/items/${item.id}`, { field, value: targetValue })
                )
            );
            loadHistory();
        } catch (error) {
            alert('Erro ao atualizar itens.');
        } finally {
            setBulkLoading(false);
        }
    };

    // Remover livro da encomenda
    const handleDeleteItem = async (itemId) => {
        if (!confirm('Remover este livro da encomenda?')) return;
        try {
            await axios.delete(`/api/orders/${order.id}/items/${itemId}`);
            setOrder(prev => ({ ...prev, items: prev.items.filter(item => item.id !== itemId) }));
            if (editingItemId === itemId) setEditingItemId(null);
            loadHistory();
        } catch (error) {
            alert('Erro ao remover livro da encomenda.');
        }
    };

    // Eliminar encomenda
    const handleDelete = async () => {
        if (!confirm('Tem a certeza que pretende eliminar esta encomenda? Esta ação não pode ser desfeita.')) return;
        setDeleting(true);
        try {
            await axios.delete(`/api/orders/${order.id}`);
            onClose();
            router.reload();
        } catch (error) {
            alert('Erro ao eliminar encomenda.');
            setDeleting(false);
        }
    };

    const handlePrintPDF = () => window.open(`/api/orders/${order.id}/pdf`, '_blank');

    const startEditQty = (item) => {
        setEditingItemId(item.id);
        setEditQty(String(item.quantity));
        setSwapItemId(null);
    };

    const saveEditQty = async (itemId) => {
        const newQty = parseInt(editQty);
        if (isNaN(newQty) || newQty < 1) { alert('Quantidade inválida'); return; }
        setEditSaving(true);
        try {
            const response = await axios.patch(`/api/orders/${order.id}/items/${itemId}/edit`, { quantidade: newQty });
            if (response.data.success) {
                const addedItems = response.data.newItems || [];
                setOrder(prev => ({
                    ...prev,
                    items: [
                        ...prev.items.map(item =>
                            item.id === itemId ? { ...item, ...response.data.item } : item
                        ),
                        ...addedItems,
                    ]
                }));
                loadHistory();
                if (addedItems.length > 0) {
                    setEditingItemId(null);
                    setSwapItemId(null);
                }
            }
        } catch (error) {
            alert('Erro ao guardar quantidade.');
        } finally {
            setEditSaving(false);
            setEditingItemId(null);
        }
    };

    const startSwapBook = (item) => {
        setSwapItemId(item.id);
        setSwapQuery('');
        setSwapResults([]);
    };

    useEffect(() => {
        if (!swapQuery || swapQuery.length < 2) { setSwapResults([]); return; }
        const timeout = setTimeout(async () => {
            setSwapLoading(true);
            try {
                const response = await axios.get('/api/books/all-search', { params: { q: swapQuery } });
                setSwapResults(response.data.books || []);
            } catch { setSwapResults([]); }
            finally { setSwapLoading(false); }
        }, 400);
        return () => clearTimeout(timeout);
    }, [swapQuery]);

    const confirmSwapBook = async (newBookId) => {
        setEditSaving(true);
        try {
            const response = await axios.patch(`/api/orders/${order.id}/items/${swapItemId}/edit`, { livro_id: newBookId });
            if (response.data.success) {
                setOrder(prev => ({
                    ...prev,
                    items: prev.items.map(item =>
                        item.id === swapItemId ? { ...item, ...response.data.item } : item
                    )
                }));
                loadHistory();
            }
        } catch (error) {
            alert('Erro ao trocar livro.');
        } finally {
            setEditSaving(false);
            setSwapItemId(null);
            setSwapQuery('');
            setSwapResults([]);
        }
    };

    const totalItems = order.items.length;
    const itemsEntregues = order.items.filter(i => i.entregue).length;
    const progressPercent = totalItems > 0 ? (itemsEntregues / totalItems) * 100 : 0;
    const hasEncaparItems = order.items.some(i => i.encapar);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${modalClosing ? '' : 'animate-backdrop-in'}`}
            style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
            onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
            <div className={`card-3d !bg-white rounded-3xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden flex flex-col ${modalClosing ? 'animate-modal-out' : 'animate-modal-in'}`}>

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-extrabold text-gray-900">Encomenda #{order.id}</h2>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">Criada a {order.date}</p>
                    </div>
                    <button
                        onClick={closeModal}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100/60 rounded-xl transition-all duration-200 active:scale-90"
                    >
                        <FaTimes className="text-sm" />
                    </button>
                </div>

                {/* ── Progresso ── */}
                {totalItems > 0 && (
                    <div className="px-8 py-2.5 border-b border-gray-100/80 flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full overflow-hidden" style={{ height: '2px' }}>
                            <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{
                                    width: `${progressPercent}%`,
                                    background: progressPercent === 100 ? '#34d399' : '#9ca3af',
                                }}
                            />
                        </div>
                        <span className="text-[10px] font-medium tabular-nums shrink-0" style={{ color: progressPercent === 100 ? '#34d399' : '#d1d5db' }}>
                            {itemsEntregues}/{totalItems}
                        </span>
                    </div>
                )}

                {/* ── Tabs ── */}
                <div className="flex border-b border-gray-100 px-8">
                    {[
                        { key: 'items', label: 'Itens da Encomenda' },
                        { key: 'history', label: 'Histórico', icon: <FaHistory className="text-[10px]" /> },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-1.5 mr-6 py-3 text-[13px] font-bold border-b-2 transition-all duration-200 ${
                                activeTab === tab.key
                                    ? 'text-indigo-600 border-indigo-500'
                                    : 'text-gray-400 border-transparent hover:text-gray-600'
                            }`}
                        >
                            {tab.icon}{tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Conteúdo ── */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-5">
                    {activeTab === 'items' ? (
                        <div>
                            {/* Ações em massa */}
                            {order.items.length > 0 && (
                                <div className="flex gap-2 mb-4 flex-wrap items-center">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Ações em massa:</span>
                                    <button
                                        type="button"
                                        onClick={() => handleBulkAction('ensacado')}
                                        disabled={bulkLoading}
                                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/15 transition-all duration-150 active:scale-95 disabled:opacity-50"
                                    >
                                        Ensacar Tudo
                                    </button>
                                    {hasEncaparItems && (
                                        <button
                                            type="button"
                                            onClick={() => handleBulkAction('encapado')}
                                            disabled={bulkLoading}
                                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 transition-all duration-150 active:scale-95 disabled:opacity-50"
                                        >
                                            Encapar Tudo
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleBulkAction('entregue')}
                                        disabled={bulkLoading}
                                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 transition-all duration-150 active:scale-95 disabled:opacity-50"
                                    >
                                        Entregar Tudo
                                    </button>
                                    {bulkLoading && <FaSpinner className="animate-spin text-gray-400 text-xs" />}
                                </div>
                            )}

                            {/* Tabela */}
                            <div className="rounded-2xl overflow-hidden border border-gray-100">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Livro</th>
                                            <th className="px-4 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider w-28">Ensacar</th>
                                            <th className="px-4 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider w-28">Encapar</th>
                                            <th className="px-4 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider w-28">Entregar</th>
                                            <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider w-24">Preço</th>
                                            <th className="px-4 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider w-24">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100/80">
                                        {order.items.map((item) => {
                                            const noBook = !item.isbn;
                                            return (
                                                <tr
                                                    key={item.id}
                                                    className={`transition-all duration-150 ${item.entregue ? 'bg-emerald-50/40 border-l-2 border-l-emerald-400' : 'hover:bg-gray-50/60 border-l-2 border-l-transparent'}`}
                                                >
                                                    {/* Livro */}
                                                    <td className="px-4 py-3">
                                                        <p className="text-[13px] font-semibold text-gray-800">{item.title}</p>
                                                        <p className="text-[11px] text-gray-400">{item.editora} · {item.isbn}</p>
                                                    </td>

                                                    {/* Ensacar */}
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            <input
                                                                type="checkbox"
                                                                checked={item.ensacado}
                                                                onChange={() => handleCheckboxChange(item.id, 'ensacado', item.ensacado)}
                                                                disabled={noBook || (!item.ensacado && (item.stock_disponivel ?? 0) <= 0)}
                                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer accent-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                            />
                                                            {!noBook && !item.ensacado && (item.stock_disponivel ?? 0) <= 0 && (
                                                                <span className="text-[9px] font-semibold text-red-400 leading-none">Sem stock</span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Encapar */}
                                                    <td className="px-4 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.encapado}
                                                            onChange={() => item.encapar && item.ensacado && handleCheckboxChange(item.id, 'encapado', item.encapado)}
                                                            disabled={!item.encapar || noBook || !item.ensacado}
                                                            className="w-4 h-4 text-amber-500 border-gray-300 rounded cursor-pointer accent-amber-500 disabled:opacity-30 disabled:cursor-not-allowed"
                                                        />
                                                    </td>

                                                    {/* Entregar */}
                                                    <td className="px-4 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.entregue}
                                                            onChange={() => handleCheckboxChange(item.id, 'entregue', item.entregue)}
                                                            disabled={noBook || !item.ensacado || (item.encapar && !item.encapado)}
                                                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded cursor-pointer accent-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                        />
                                                    </td>

                                                    {/* Preço */}
                                                    <td className="px-4 py-3 text-right">
                                                        <span className="text-[13px] font-bold text-gray-700">{item.price.toFixed(2)}€</span>
                                                    </td>

                                                    {/* Ações */}
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => { if (editingItemId === item.id) { setEditingItemId(null); setSwapItemId(null); setSwapQuery(''); setSwapResults([]); } else { startEditQty(item); } }}
                                                                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-150 active:scale-90"
                                                                title="Editar"
                                                            >
                                                                <FaEdit className="text-xs" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteItem(item.id)}
                                                                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150 active:scale-90"
                                                                title="Remover"
                                                            >
                                                                <FaTrash className="text-xs" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                        {/* Linha de edição inline */}
                                        {editingItemId && (
                                            <tr className="bg-indigo-50/40">
                                                <td colSpan="6" className="px-4 py-3">
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <div className="flex items-center gap-2">
                                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Qtd:</label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={editQty}
                                                                onChange={e => setEditQty(e.target.value)}
                                                                className="glass-input w-20 px-2.5 py-1.5 text-sm rounded-xl"
                                                            />
                                                            <button
                                                                onClick={() => saveEditQty(editingItemId)}
                                                                disabled={editSaving}
                                                                className="px-3 py-1.5 text-[11px] font-bold bg-gradient-to-b from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-1 active:scale-95 transition-all"
                                                            >
                                                                {editSaving ? <FaSpinner className="animate-spin" /> : <FaSave />} Guardar
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => startSwapBook(order.items.find(i => i.id === editingItemId))}
                                                            className="px-3 py-1.5 text-[11px] font-bold bg-amber-500/10 text-amber-700 rounded-xl hover:bg-amber-500/20 flex items-center gap-1 active:scale-95 transition-all"
                                                        >
                                                            <FaSearch className="text-[9px]" /> Trocar Livro
                                                        </button>
                                                        <button
                                                            onClick={() => { setEditingItemId(null); setSwapItemId(null); setSwapQuery(''); setSwapResults([]); }}
                                                            className="text-[11px] text-gray-400 hover:text-gray-600 underline"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>

                                                    {/* Pesquisa troca livro */}
                                                    {swapItemId !== null && (
                                                        <div className="mt-3 border border-gray-100 rounded-2xl bg-white/80 p-4">
                                                            <div className="relative mb-3">
                                                                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                                                <input
                                                                    type="text"
                                                                    value={swapQuery}
                                                                    onChange={e => setSwapQuery(e.target.value)}
                                                                    placeholder="Pesquisar livro por título ou ISBN..."
                                                                    className="glass-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl placeholder:text-gray-400/70"
                                                                    autoFocus
                                                                />
                                                                {swapLoading && <FaSpinner className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-indigo-500 text-xs" />}
                                                            </div>
                                                            <div className="max-h-40 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                                                                {swapResults.map(book => (
                                                                    <div key={book.id} className="flex items-center justify-between py-2 px-2 rounded-xl hover:bg-gray-50 transition-all">
                                                                        <div className="overflow-hidden mr-3">
                                                                            <p className="text-[13px] font-semibold text-gray-900 truncate">{book.titulo}</p>
                                                                            <p className="text-[11px] text-gray-400">{book.isbn} · {book.editora_nome}</p>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => confirmSwapBook(book.id)}
                                                                            disabled={editSaving}
                                                                            className="px-3 py-1.5 text-[11px] font-bold bg-gradient-to-b from-indigo-500 to-indigo-600 text-white rounded-xl disabled:opacity-50 shrink-0 active:scale-95 transition-all"
                                                                        >
                                                                            Selecionar
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                {swapQuery.length >= 2 && swapResults.length === 0 && !swapLoading && (
                                                                    <p className="py-4 text-center text-[12px] text-gray-400 font-medium">Nenhum livro encontrado</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-50/50 border-t border-gray-100">
                                            <td colSpan="4" className="px-4 py-3 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total da Encomenda</td>
                                            <td className="px-4 py-3 text-right text-[15px] font-extrabold text-gray-800">{order.total}€</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Observações */}
                            {order.observacao && (
                                <div className="mt-4 bg-amber-50/80 text-amber-800 px-4 py-3 rounded-2xl text-sm border border-amber-100 flex gap-2">
                                    <span className="font-bold shrink-0">Nota:</span>
                                    <span>{order.observacao}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Histórico */
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Histórico de Alterações</p>
                            {history.length > 0 ? (
                                <div className="space-y-2">
                                    {history.map((log) => (
                                        <div key={log.id} className="bg-gray-50/60 rounded-2xl px-4 py-3 border border-gray-100">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-2">
                                                    <FaCheckCircle className="text-indigo-400 text-xs" />
                                                    <span className="text-[13px] font-semibold text-gray-800">{log.user_name}</span>
                                                </div>
                                                <span className="text-[11px] text-gray-400 font-medium" title={log.timestamp_full}>{log.timestamp}</span>
                                            </div>
                                            <p className="text-[12px] text-gray-600 ml-5">{log.action}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 text-gray-400">
                                    <FaHistory className="mx-auto text-3xl mb-3 opacity-20" />
                                    <p className="text-sm font-medium">Nenhum histórico disponível</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="px-8 py-5 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrintPDF}
                            className="flex items-center gap-2 text-[12px] font-bold text-gray-500 hover:text-indigo-600 bg-gray-100/60 hover:bg-indigo-50 px-3.5 py-2 rounded-xl transition-all duration-200 active:scale-95"
                        >
                            <FaFilePdf /> PDF
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex items-center gap-2 text-[12px] font-bold text-red-500 hover:text-red-700 bg-red-50/60 hover:bg-red-100/60 px-3.5 py-2 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50"
                        >
                            <FaTrash /> {deleting ? 'A eliminar...' : 'Eliminar'}
                        </button>
                    </div>
                    <button
                        onClick={saveModal}
                        className="px-6 py-2 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-[13px] font-bold rounded-xl shadow-sm shadow-indigo-500/25 hover:shadow-md transition-all duration-200 active:scale-[0.97]"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
