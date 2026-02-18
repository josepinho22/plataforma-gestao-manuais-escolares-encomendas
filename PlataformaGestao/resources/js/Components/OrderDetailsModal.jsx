import { useState, useEffect } from 'react';
import { FaTimes, FaCheckCircle, FaHistory, FaTrash, FaFilePdf, FaEdit, FaSave, FaSearch, FaSpinner } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function OrderDetailsModal({ order: initialOrder, onClose }) {
    const [order, setOrder] = useState(initialOrder);
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('items');
    const [deleting, setDeleting] = useState(false);

    // Estado de edicao inline
    const [editingItemId, setEditingItemId] = useState(null);
    const [editQty, setEditQty] = useState('');
    const [editSaving, setEditSaving] = useState(false);

    // Pesquisa de livro para troca
    const [swapItemId, setSwapItemId] = useState(null);
    const [swapQuery, setSwapQuery] = useState('');
    const [swapResults, setSwapResults] = useState([]);
    const [swapLoading, setSwapLoading] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const response = await axios.get(`/api/orders/${order.id}/history`);
            setHistory(response.data.history);
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        }
    };

    // Atualizar checkbox de item (Optimistic UI)
    const handleCheckboxChange = async (itemId, field, currentValue) => {
        const newValue = !currentValue;

        setOrder(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.id === itemId ? { ...item, [field]: newValue } : item
            )
        }));

        try {
            const response = await axios.patch(`/api/orders/${order.id}/items/${itemId}`, {
                field,
                value: newValue
            });
            // Atualizar status da encomenda se o backend devolveu um novo status
            if (response.data.order_status) {
                setOrder(prev => ({ ...prev, status: response.data.order_status }));
            }
            loadHistory();
        } catch (error) {
            console.error('Erro ao atualizar item:', error);
            setOrder(prev => ({
                ...prev,
                items: prev.items.map(item =>
                    item.id === itemId ? { ...item, [field]: currentValue } : item
                )
            }));
            alert('Erro ao atualizar item. Tente novamente.');
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

    // Imprimir PDF
    const handlePrintPDF = () => {
        window.open(`/api/orders/${order.id}/pdf`, '_blank');
    };

    // Iniciar edicao de quantidade
    const startEditQty = (item) => {
        setEditingItemId(item.id);
        setEditQty(String(item.quantity));
        setSwapItemId(null);
    };

    // Guardar edicao de quantidade
    const saveEditQty = async (itemId) => {
        const newQty = parseInt(editQty);
        if (isNaN(newQty) || newQty < 1) { alert('Quantidade inválida'); return; }

        setEditSaving(true);
        try {
            const response = await axios.patch(`/api/orders/${order.id}/items/${itemId}/edit`, {
                quantidade: newQty
            });
            if (response.data.success) {
                setOrder(prev => ({
                    ...prev,
                    items: prev.items.map(item =>
                        item.id === itemId ? { ...item, ...response.data.item } : item
                    )
                }));
                loadHistory();
            }
        } catch (error) {
            alert('Erro ao guardar quantidade.');
        } finally {
            setEditSaving(false);
            setEditingItemId(null);
        }
    };

    // Iniciar troca de livro
    const startSwapBook = (item) => {
        setSwapItemId(item.id);
        setSwapQuery('');
        setSwapResults([]);
        setEditingItemId(null);
    };

    // Pesquisa debounce para troca de livro
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

    // Confirmar troca de livro
    const confirmSwapBook = async (newBookId) => {
        setEditSaving(true);
        try {
            const response = await axios.patch(`/api/orders/${order.id}/items/${swapItemId}/edit`, {
                livro_id: newBookId
            });
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

    // Expandir itens para stacking visual (qty 3 -> 3 linhas visuais)
    const expandedItems = [];
    order.items.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
            expandedItems.push({
                ...item,
                unitIndex: i,
                unitLabel: item.quantity > 1 ? `${i + 1}/${item.quantity}` : null,
                isFirstUnit: i === 0,
            });
        }
    });

    // Progresso
    const totalUnits = expandedItems.length;
    const unitsEntregues = order.items.reduce((sum, i) => sum + (i.entregue ? i.quantity : 0), 0);
    const progressPercent = totalUnits > 0 ? (unitsEntregues / totalUnits) * 100 : 0;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-200">
                    <div className="px-6 py-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Detalhes da Encomenda #{order.id}</h2>
                            <p className="text-xs text-gray-500">Criada a {order.date}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition">
                            <FaTimes />
                        </button>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="px-6 pb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-gray-600">Progresso de Entrega</span>
                            <span className="text-xs font-bold text-indigo-600">{unitsEntregues} de {totalUnits} unidades</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-t border-gray-200">
                        <button
                            onClick={() => setActiveTab('items')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition ${
                                activeTab === 'items'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            Itens da Encomenda
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition flex items-center justify-center gap-2 ${
                                activeTab === 'history'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <FaHistory /> Histórico
                        </button>
                    </div>
                </div>

                {/* Conteudo */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'items' ? (
                        <div>
                            {/* Tabela */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livro</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Encapar</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Ensacar</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Entregar</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Preço</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {expandedItems.map((item) => (
                                            <tr key={`${item.id}-${item.unitIndex}`} className={`hover:bg-gray-50 transition ${item.entregue ? 'bg-green-50/30' : ''}`}>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-900">{item.title}</span>
                                                            {item.unitLabel && (
                                                                <span className="text-[9px] font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                                                                    {item.unitLabel}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-gray-500">{item.editora} {item.isbn}</span>
                                                    </div>
                                                </td>

                                                {/* Encapar - so mostra checkbox na primeira unidade e se foi pedido */}
                                                <td className="px-4 py-3 text-center">
                                                    {item.isFirstUnit ? (
                                                        item.encapar ? (
                                                            <input
                                                                type="checkbox"
                                                                checked={item.encapado}
                                                                onChange={() => handleCheckboxChange(item.id, 'encapado', item.encapado)}
                                                                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                                            />
                                                        ) : (
                                                            <span className="text-xs text-gray-400">N/A</span>
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-gray-300">-</span>
                                                    )}
                                                </td>

                                                {/* Ensacar - so na primeira unidade */}
                                                <td className="px-4 py-3 text-center">
                                                    {item.isFirstUnit ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={item.ensacado}
                                                            onChange={() => handleCheckboxChange(item.id, 'ensacado', item.ensacado)}
                                                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-300">-</span>
                                                    )}
                                                </td>

                                                {/* Entregar - so na primeira unidade */}
                                                <td className="px-4 py-3 text-center">
                                                    {item.isFirstUnit ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={item.entregue}
                                                            onChange={() => handleCheckboxChange(item.id, 'entregue', item.entregue)}
                                                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-300">-</span>
                                                    )}
                                                </td>

                                                {/* Preco - so na primeira unidade */}
                                                <td className="px-4 py-3 text-right whitespace-nowrap text-sm text-gray-500">
                                                    {item.isFirstUnit ? (
                                                        <>
                                                            {item.price.toFixed(2)}€
                                                        </>
                                                    ) : null}
                                                </td>

                                                {/* Acoes - so na primeira unidade */}
                                                <td className="px-4 py-3 text-center">
                                                    {item.isFirstUnit && (
                                                        <button
                                                            type="button"
                                                            onClick={() => editingItemId === item.id ? setEditingItemId(null) : startEditQty(item)}
                                                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                                                            title="Editar"
                                                        >
                                                            <FaEdit className="text-sm" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Linha de edicao inline (aparece abaixo do item selecionado) */}
                                        {editingItemId && (
                                            <tr className="bg-indigo-50/50">
                                                <td colSpan="6" className="px-4 py-3">
                                                    <div className="flex items-center gap-4 flex-wrap">
                                                        <div className="flex items-center gap-2">
                                                            <label className="text-xs font-bold text-gray-500 uppercase">Quantidade:</label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={editQty}
                                                                onChange={e => setEditQty(e.target.value)}
                                                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                                                            />
                                                            <button
                                                                onClick={() => saveEditQty(editingItemId)}
                                                                disabled={editSaving}
                                                                className="px-3 py-1 text-xs font-bold bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1"
                                                            >
                                                                {editSaving ? <FaSpinner className="animate-spin" /> : <FaSave />} Guardar
                                                            </button>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => startSwapBook(order.items.find(i => i.id === editingItemId))}
                                                                className="px-3 py-1 text-xs font-bold bg-amber-500 text-white rounded hover:bg-amber-600 flex items-center gap-1"
                                                            >
                                                                <FaSearch /> Trocar Livro
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => setEditingItemId(null)}
                                                            className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 underline"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>

                                                    {/* Pesquisa de troca de livro */}
                                                    {swapItemId === editingItemId && (
                                                        <div className="mt-3 border border-gray-200 rounded-lg bg-white p-3">
                                                            <div className="relative mb-2">
                                                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                                                <input
                                                                    type="text"
                                                                    value={swapQuery}
                                                                    onChange={e => setSwapQuery(e.target.value)}
                                                                    placeholder="Pesquisar livro por título ou ISBN..."
                                                                    className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                                                                    autoFocus
                                                                />
                                                                {swapLoading && <FaSpinner className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-indigo-500 text-xs" />}
                                                            </div>
                                                            <div className="max-h-40 overflow-y-auto divide-y divide-gray-100">
                                                                {swapResults.map(book => (
                                                                    <div key={book.id} className="flex items-center justify-between py-2 px-1 hover:bg-gray-50">
                                                                        <div className="overflow-hidden mr-3">
                                                                            <p className="text-sm font-medium text-gray-900 truncate">{book.titulo}</p>
                                                                            <p className="text-xs text-gray-500">{book.isbn} - {book.editora_nome}</p>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => confirmSwapBook(book.id)}
                                                                            disabled={editSaving}
                                                                            className="px-2 py-1 text-xs font-bold bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 shrink-0"
                                                                        >
                                                                            Selecionar
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                {swapQuery.length >= 2 && swapResults.length === 0 && !swapLoading && (
                                                                    <p className="py-3 text-center text-xs text-gray-400">Nenhum livro encontrado</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan="4" className="px-4 py-3 text-right text-sm font-medium text-gray-500">Total da Encomenda:</td>
                                            <td className="px-4 py-3 text-right text-base font-bold text-indigo-700">{order.total}€</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Observacoes */}
                            {order.observacao && (
                                <div className="mt-6 bg-amber-50 text-amber-800 p-4 rounded-lg text-sm border border-amber-100 flex gap-3">
                                    <span className="font-bold">Nota:</span> {order.observacao}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Tab de Historico */
                        <div>
                            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4">Histórico de Alterações</h3>

                            {history.length > 0 ? (
                                <div className="space-y-3">
                                    {history.map((log) => (
                                        <div key={log.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FaCheckCircle className="text-indigo-500 text-sm" />
                                                    <span className="text-sm font-medium text-gray-900">{log.user_name}</span>
                                                </div>
                                                <span className="text-xs text-gray-500" title={log.timestamp_full}>
                                                    {log.timestamp}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 ml-6">{log.action}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <FaHistory className="mx-auto text-4xl mb-3 opacity-20" />
                                    <p className="text-sm">Nenhum histórico disponível</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrintPDF}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-700 bg-white border border-gray-300 hover:border-indigo-300 px-3 py-2 rounded-lg transition font-medium"
                        >
                            <FaFilePdf /> Imprimir PDF
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 bg-white border border-red-200 hover:border-red-400 px-3 py-2 rounded-lg transition font-medium disabled:opacity-50"
                        >
                            <FaTrash /> {deleting ? 'A eliminar...' : 'Eliminar Encomenda'}
                        </button>
                    </div>
                    <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
