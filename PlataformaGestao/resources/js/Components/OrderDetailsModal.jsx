import { useState, useEffect } from 'react';
import { FaTimes, FaCheckCircle, FaHistory, FaTrash, FaFilePdf, FaEdit, FaSave, FaSearch, FaSpinner } from 'react-icons/fa';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';

export default function OrderDetailsModal({ order: initialOrder, onClose, onSave }) {
    const { companySettings } = usePage().props;
    const [order, setOrder] = useState(initialOrder);
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('items');
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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

    // Valores iniciais de ensacado — usados para reverter ao fechar via "X"
    const [initialEnsacadoValues, setInitialEnsacadoValues] = useState(() => {
        const map = {};
        initialOrder.items.forEach(item => { map[item.id] = item.ensacado; });
        return map;
    });

    // Fechar via "X": reverter alterações de ensacado (e respetivo stock) não guardadas
    const closeModal = () => {
        setModalClosing(true);
        const itemsToRevert = order.items.filter(item => {
            const initial = initialEnsacadoValues[item.id] ?? false;
            return item.ensacado !== initial;
        });
        if (itemsToRevert.length > 0) {
            Promise.all(
                itemsToRevert.map(item =>
                    axios.patch(`/api/orders/${order.id}/items/${item.id}`, {
                        field: 'ensacado',
                        value: initialEnsacadoValues[item.id] ?? false,
                    })
                )
            ).catch(console.error);
        }
        setTimeout(() => { onClose(); }, 200);
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
                const normalizedItems = response.data.items;
                setOrder(prev => ({ ...prev, items: normalizedItems }));
                // Actualizar baseline de ensacado com os itens normalizados
                setInitialEnsacadoValues(prev => {
                    const map = { ...prev };
                    normalizedItems.forEach(item => {
                        if (!(item.id in map)) map[item.id] = item.ensacado;
                    });
                    return map;
                });
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
        // Candidatos base respeitando workflow e pré-condições
        const relevantItems = order.items.filter(item => {
            if (field === 'encapado') return item.encapar && item.ensacado;
            if (field === 'entregue') return item.ensacado && (!item.encapar || item.encapado);
            return true; // ensacado
        });

        if (relevantItems.length === 0) return;

        const allMarked = relevantItems.every(item => item[field]);
        const targetValue = !allMarked;

        let itemsToUpdate;
        if (field === 'ensacado' && targetValue) {
            // Rastrear stock por livro: consumir 1 unidade por item ensacado
            // Evita sobre-ensacar quando o mesmo livro aparece várias vezes
            const stockCounter = {};
            for (const item of order.items) {
                if (item.livro_id !== undefined && !(item.livro_id in stockCounter)) {
                    stockCounter[item.livro_id] = item.stock_disponivel ?? 0;
                }
            }
            itemsToUpdate = relevantItems.filter(item => {
                if (item.ensacado) return false;
                const available = stockCounter[item.livro_id] ?? 0;
                if (available > 0) {
                    stockCounter[item.livro_id] = available - 1;
                    return true;
                }
                return false;
            });
        } else {
            itemsToUpdate = relevantItems.filter(item => item[field] !== targetValue);
        }

        if (itemsToUpdate.length === 0) return;

        const updateSet = new Set(itemsToUpdate.map(i => i.id));

        // Calcular delta de stock por livro (+ ensacar, - desensacar)
        const stockDeltaPerLivro = {};
        if (field === 'ensacado') {
            itemsToUpdate.forEach(item => {
                const delta = targetValue ? -1 : 1;
                stockDeltaPerLivro[item.livro_id] = (stockDeltaPerLivro[item.livro_id] || 0) + delta;
            });
        }

        setBulkLoading(true);
        setOrder(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if (updateSet.has(item.id)) {
                    const delta = stockDeltaPerLivro[item.livro_id] || 0;
                    return {
                        ...item,
                        [field]: targetValue,
                        ...(field === 'ensacado' ? { stock_disponivel: Math.max(0, (item.stock_disponivel ?? 0) + delta) } : {}),
                    };
                }
                // Atualizar stock_disponivel nos outros itens do mesmo livro
                if (field === 'ensacado' && stockDeltaPerLivro[item.livro_id] !== undefined) {
                    return { ...item, stock_disponivel: Math.max(0, (item.stock_disponivel ?? 0) + stockDeltaPerLivro[item.livro_id]) };
                }
                return item;
            })
        }));
        try {
            const responses = await Promise.all(
                itemsToUpdate.map(item =>
                    axios.patch(`/api/orders/${order.id}/items/${item.id}`, { field, value: targetValue })
                )
            );
            // Sincronizar stock real do servidor após ensacar/desensacar
            if (field === 'ensacado') {
                const stockByLivro = {};
                responses.forEach((resp, idx) => {
                    const livroId = itemsToUpdate[idx].livro_id;
                    if (resp.data.item?.stock_disponivel !== undefined) {
                        stockByLivro[livroId] = resp.data.item.stock_disponivel;
                    }
                });
                if (Object.keys(stockByLivro).length > 0) {
                    setOrder(prev => ({
                        ...prev,
                        items: prev.items.map(item =>
                            stockByLivro[item.livro_id] !== undefined
                                ? { ...item, stock_disponivel: stockByLivro[item.livro_id] }
                                : item
                        ),
                    }));
                }
            }
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
    const handleDelete = () => setShowDeleteConfirm(true);

    const confirmDelete = async () => {
        setShowDeleteConfirm(false);
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

    const handlePrintPDF = () => {
        const printWindow = window.open('', '_blank', 'width=900,height=700');
        if (!printWindow) return;

        const LOGO_URL    = companySettings?.logo_url || '/images/Papelock_logo.png';
        const STORE_NAME  = companySettings?.nome     || 'Papelock';
        const STORE_ADDR  = companySettings?.morada   || '';
        const STORE_PHONE = companySettings?.telefone || '';
        const STORE_EMAIL = companySettings?.email    || '';
        const STORE_NIF   = companySettings?.nif ? `NIF: ${companySettings.nif}` : '';

        const esc = (v) =>
            String(v ?? '')
                .replaceAll('&', '&amp;')
                .replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;')
                .replaceAll('"', '&quot;')
                .replaceAll("'", '&#039;');

        const toNumber = (v) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

        const formatEUR = (v) => {
            try {
                return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(toNumber(v));
            } catch {
                return `${toNumber(v).toFixed(2)} €`;
            }
        };

        const items = Array.isArray(order?.items) ? order.items : [];

        // Agrupar itens pelo mesmo livro (titulo + isbn) para mostrar a quantidade total
        const grouped = [];
        items.forEach((item) => {
            const key = `${item.title}||${item.isbn}`;
            const existing = grouped.find((g) => g.key === key);
            if (existing) {
                existing.quantity += toNumber(item.quantity);
                existing.subtotal += toNumber(item.price) * toNumber(item.quantity);
            } else {
                grouped.push({
                    key,
                    title: item.title,
                    isbn: item.isbn,
                    editora: item.editora,
                    quantity: toNumber(item.quantity),
                    price: toNumber(item.price),
                    subtotal: toNumber(item.price) * toNumber(item.quantity),
                    encapar: item.encapar,
                });
            }
        });

        const total = grouped.reduce((acc, g) => acc + g.subtotal, 0);

        const rowsHtml = grouped.map((item) => `
            <tr>
                <td class="td">
                    <div class="title">${esc(item.title)}</div>
                    <div class="muted">ISBN: ${esc(item.isbn ?? '—')} · ${esc(item.editora ?? '—')}</div>
                </td>
                <td class="td center">${item.quantity}</td>
                <td class="td center">${item.encapar ? '<span class="badge">ENCAPAR</span>' : '—'}</td>
                <td class="td right">${formatEUR(item.price)}</td>
                <td class="td right">${formatEUR(item.subtotal)}</td>
            </tr>
        `).join('');

        const html = `
            <!doctype html>
            <html>
            <head>
                <meta charset="utf-8" />
                <title>Encomenda #${esc(order?.id)}</title>
                <style>
                    :root { --text: #111827; --muted: #6B7280; --border: #E5E7EB; --soft: #F9FAFB; }
                    * { box-sizing: border-box; }
                    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: var(--text); background: white; }
                    .page { padding: 28px; }
                    .header { display: flex; justify-content: space-between; gap: 16px; padding-bottom: 16px; border-bottom: 2px solid var(--border); margin-bottom: 18px; }
                    .brand { display: flex; align-items: center; gap: 12px; }
                    .logo { height: 44px; width: auto; object-fit: contain; }
                    .store { font-size: 12px; line-height: 1.4; color: var(--muted); }
                    .store strong { color: var(--text); font-size: 13px; }
                    .doc-title { text-align: right; }
                    .doc-title h1 { margin: 0; font-size: 18px; font-weight: 800; }
                    .doc-title .sub { margin-top: 6px; font-size: 12px; color: var(--muted); }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
                    .card { border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; background: var(--soft); }
                    .card-title { font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
                    .row { display: flex; justify-content: space-between; gap: 12px; font-size: 12px; margin: 4px 0; }
                    .row .k { color: var(--muted); }
                    .row .v { font-weight: 700; color: var(--text); text-align: right; }
                    table { width: 100%; border-collapse: collapse; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-top: 14px; }
                    thead th { background: #111827; color: white; font-size: 12px; padding: 10px 12px; text-align: left; }
                    .td { border-top: 1px solid var(--border); padding: 10px 12px; font-size: 12px; vertical-align: top; }
                    .title { font-weight: 800; margin-bottom: 3px; }
                    .muted { color: var(--muted); font-size: 11px; }
                    .right { text-align: right; }
                    .center { text-align: center; }
                    .badge { border: 1px solid #111827; padding: 1px 5px; font-size: 10px; font-weight: 800; border-radius: 4px; }
                    .summary { margin-top: 14px; display: flex; justify-content: flex-end; }
                    .summary-box { min-width: 260px; border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; background: var(--soft); }
                    .total { font-size: 14px; font-weight: 900; }
                    .obs { margin-top: 14px; border: 1px dashed #9CA3AF; border-radius: 8px; padding: 10px 14px; font-size: 12px; }
                    .obs .k { font-weight: 800; display: block; margin-bottom: 4px; }
                    .footer { margin-top: 18px; padding-top: 12px; border-top: 1px solid var(--border); font-size: 11px; color: var(--muted); display: flex; justify-content: space-between; gap: 10px; }
                    @media print { .page { padding: 0; } body { margin: 0; } @page { margin: 12mm; } }
                </style>
            </head>
            <body>
                <div class="page">
                    <div class="header">
                        <div class="brand">
                            <img class="logo" src="${esc(LOGO_URL)}" alt="Logo" onerror="this.style.display='none'" />
                            <div class="store">
                                <strong>${esc(STORE_NAME)}</strong><br/>
                                ${esc(STORE_ADDR)}<br/>
                                ${esc(STORE_PHONE)} · ${esc(STORE_EMAIL)}<br/>
                                ${esc(STORE_NIF)}
                            </div>
                        </div>
                        <div class="doc-title">
                            <h1>Encomenda #${esc(order?.id)}</h1>
                            <div class="sub">Documento gerado em: ${esc(new Date().toLocaleString('pt-PT'))}</div>
                        </div>
                    </div>

                    <div class="grid">
                        <div class="card">
                            <div class="card-title">Dados do Cliente</div>
                            <div class="row"><span class="k">Nome</span><span class="v">${esc(order?.student_name)}</span></div>
                            <div class="row"><span class="k">NIF</span><span class="v">${esc(order?.nif)}</span></div>
                            ${order?.telefone ? `<div class="row"><span class="k">Telefone</span><span class="v">${esc(order.telefone)}</span></div>` : ''}
                            ${order?.id_mega ? `<div class="row"><span class="k">ID Mega</span><span class="v">${esc(order.id_mega)}</span></div>` : ''}
                        </div>
                        <div class="card">
                            <div class="card-title">Contexto Escolar</div>
                            <div class="row"><span class="k">Escola</span><span class="v">${esc(order?.school)}</span></div>
                            <div class="row"><span class="k">Ano Escolar</span><span class="v">${esc(order?.year)}</span></div>
                            <div class="row"><span class="k">Ano Letivo</span><span class="v">${esc(order?.ano_letivo)}</span></div>
                            <div class="row"><span class="k">Data</span><span class="v">${esc(order?.date)}</span></div>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Livro</th>
                                <th style="width:70px; text-align:center;">Qtd</th>
                                <th style="width:90px; text-align:center;">Serviço</th>
                                <th style="width:110px; text-align:right;">Preço Un.</th>
                                <th style="width:110px; text-align:right;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${grouped.length === 0
                                ? '<tr><td class="td" colspan="5"><span class="muted">Sem itens.</span></td></tr>'
                                : rowsHtml
                            }
                        </tbody>
                    </table>

                    <div class="summary">
                        <div class="summary-box">
                            <div class="row"><span class="k">Nº de livros</span><span class="v">${grouped.length}</span></div>
                            <div class="row total"><span>Total a Pagar</span><span>${formatEUR(total)}</span></div>
                        </div>
                    </div>

                    ${order?.observacao ? `
                    <div class="obs">
                        <span class="k">Observações</span>
                        ${esc(order.observacao)}
                    </div>` : ''}

                    <div class="footer">
                        <div>Impresso para fins de controlo interno.</div>
                        <div>${esc(STORE_NAME)} · ${esc(STORE_PHONE)}</div>
                    </div>
                </div>

                <script>
                    window.onload = function () {
                        setTimeout(function () { window.print(); }, 250);
                    };
                    window.onafterprint = function () { window.close(); };
                </script>
            </body>
            </html>
        `;

        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
    };

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
        <>
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

        {/* Modal de confirmação de eliminação */}
        {showDeleteConfirm && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600">
                            <FaTrash size={16} />
                        </div>
                        <h3 className="text-base font-black text-gray-900">Eliminar encomenda</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Tens a certeza que queres eliminar esta encomenda? Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex justify-end gap-3 pt-1">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 text-sm font-black transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-black transition-all"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
