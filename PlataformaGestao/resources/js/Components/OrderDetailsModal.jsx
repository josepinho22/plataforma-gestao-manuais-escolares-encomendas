import { useState, useEffect } from 'react';
import { FaTimes, FaCheckCircle, FaHistory } from 'react-icons/fa';
import axios from 'axios';

export default function OrderDetailsModal({ order: initialOrder, onClose }) {
    const [order, setOrder] = useState(initialOrder);
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('items');

    // Carregar histórico ao abrir o modal
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

        // Optimistic UI: atualizar imediatamente
        setOrder(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.id === itemId ? { ...item, [field]: newValue } : item
            )
        }));

        try {
            await axios.patch(`/api/orders/${order.id}/items/${itemId}`, {
                field,
                value: newValue
            });

            // Recarregar histórico
            loadHistory();
        } catch (error) {
            console.error('Erro ao atualizar item:', error);

            // Reverter mudança em caso de erro
            setOrder(prev => ({
                ...prev,
                items: prev.items.map(item =>
                    item.id === itemId ? { ...item, [field]: currentValue } : item
                )
            }));

            alert('Erro ao atualizar item. Tente novamente.');
        }
    };

    // Calcular progresso
    const totalItems = order.items.length;
    const itemsEntregues = order.items.filter(i => i.entregue).length;
    const progressPercent = totalItems > 0 ? (itemsEntregues / totalItems) * 100 : 0;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>

                {/* Header Modal com Barra de Progresso */}
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
                            <span className="text-xs font-bold text-indigo-600">{itemsEntregues} de {totalItems} itens</span>
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

                {/* Conteúdo com Scroll */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'items' ? (
                        /* Tab de Itens */
                        <div>
                            {/* Tabela Interativa de Processamento */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livro</th>
                                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Encapar</th>
                                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Ensacar</th>
                                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Entregar</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Preço</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {order.items.map((item, idx) => (
                                            <tr key={idx} className={`hover:bg-gray-50 transition ${item.entregue ? 'bg-green-50/30' : ''}`}>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900">{item.title}</span>
                                                        <span className="text-xs text-gray-500">{item.editora} • {item.isbn}</span>
                                                    </div>
                                                </td>

                                                {/* Checkbox Encapar (só aparece se cliente pediu) */}
                                                <td className="px-4 py-3 text-center">
                                                    {item.encapar ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={item.encapado}
                                                            onChange={() => handleCheckboxChange(item.id, 'encapado', item.encapado)}
                                                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-400">N/A</span>
                                                    )}
                                                </td>

                                                {/* Checkbox Ensacar */}
                                                <td className="px-4 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.ensacado}
                                                        onChange={() => handleCheckboxChange(item.id, 'ensacado', item.ensacado)}
                                                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                                    />
                                                </td>

                                                {/* Checkbox Entregar */}
                                                <td className="px-4 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.entregue}
                                                        onChange={() => handleCheckboxChange(item.id, 'entregue', item.entregue)}
                                                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                                    />
                                                </td>

                                                {/* Preço */}
                                                <td className="px-4 py-3 text-right whitespace-nowrap text-sm text-gray-500">
                                                    €{item.price.toFixed(2)} <span className="text-xs text-gray-400">x{item.quantity}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan="4" className="px-4 py-3 text-right text-sm font-medium text-gray-500">Total da Encomenda:</td>
                                            <td className="px-4 py-3 text-right text-base font-bold text-indigo-700">€{order.total}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Observações */}
                            {order.observacao && (
                                <div className="mt-6 bg-amber-50 text-amber-800 p-4 rounded-lg text-sm border border-amber-100 flex gap-3">
                                    <span className="font-bold">Nota:</span> {order.observacao}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Tab de Histórico */
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

                {/* Footer Modal */}
                <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
                    <button className="text-sm text-gray-500 hover:text-gray-700 underline">Imprimir Talão</button>
                    <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}