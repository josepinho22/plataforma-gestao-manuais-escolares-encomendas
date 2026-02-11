import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
    FaPlus, FaSearch, FaTimes,
    FaBox, FaSchool, FaChevronRight, FaCheckCircle, FaClock
} from "react-icons/fa";
import { useState, useEffect } from 'react';
import pickBy from 'lodash/pickBy';
import OrderDetailsModal from '@/Components/OrderDetailsModal';

export default function OrdersIndex({ auth, orders, stats, filters, filterOptions }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Estados dos filtros avançados
    const [activeFilters, setActiveFilters] = useState({
        concelho_id: filters.concelho_id || '',
        escola_id: filters.escola_id || '',
        ano_escolar_id: filters.ano_escolar_id || '',
        status: filters.status || '',
        sort: filters.sort || 'desc',
    });

    // Debounce de pesquisa em tempo real
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            applyFilters();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    // Aplicar filtros (chamado quando qualquer filtro muda)
    const applyFilters = () => {
        const params = pickBy({
            search,
            ...activeFilters
        }, value => value !== '');

        router.get('/encomendas', params, {
            preserveState: true,
            replace: true,
            preserveScroll: true
        });
    };

    // Atualizar filtro individual
    const updateFilter = (key, value) => {
        const newFilters = { ...activeFilters, [key]: value };

        // Se mudou o concelho, limpar escola selecionada
        if (key === 'concelho_id') {
            newFilters.escola_id = '';
        }

        setActiveFilters(newFilters);

        // Aplicar imediatamente (sem debounce)
        const params = pickBy({ search, ...newFilters }, v => v !== '');
        router.get('/encomendas', params, {
            preserveState: true,
            replace: true,
            preserveScroll: true
        });
    };

    // Filtrar escolas por concelho selecionado (se houver)
    const filteredSchools = activeFilters.concelho_id
        ? filterOptions.schools.filter(s => s.concelho_id == activeFilters.concelho_id)
        : filterOptions.schools;

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const clearSearch = () => {
        setSearch('');
    };

    const changePage = (page) => {
        const params = pickBy({ search, ...activeFilters, page }, value => value !== '');
        router.get('/encomendas', params, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Encomendas" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* 1. HEADER E AÇÕES */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-gray-200 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Encomendas - Clientes</h1>
                        <p className="text-sm text-gray-500 mt-1">Visão geral, criação e processamento de pedidos</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <form onSubmit={handleSearch} className="relative flex-1 md:w-72">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input
                                type="text"
                                placeholder="Pesquisar por nome, NIF ou ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-8 py-2 text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition"
                                    title="Limpar pesquisa"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </form>
                        <a href="/encomendas/create" className="flex items-center bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition whitespace-nowrap">
                            <FaPlus className="mr-2" />
                            Nova Encomenda
                        </a>
                    </div>
                </div>

                {/* 2. STATS COMPACTOS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MiniStat label="Total Pendentes" value={stats.pendentes} color="text-amber-600" bg="bg-amber-50" border="border-amber-100" />
                    <MiniStat label="Em Processamento" value={stats.processamento} color="text-blue-600" bg="bg-blue-50" border="border-blue-100" />
                    <MiniStat label="Pronto a Levantar" value="12" color="text-purple-600" bg="bg-purple-50" border="border-purple-100" /> {/* Exemplo estático */}
                    <MiniStat label="Concluídas" value={stats.concluidas} color="text-emerald-600" bg="bg-emerald-50" border="border-emerald-100" />
                </div>

                {/* 2.5 BARRA DE FILTROS AVANÇADOS */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <FilterSelect
                            label="Concelho"
                            value={activeFilters.concelho_id}
                            onChange={(e) => updateFilter('concelho_id', e.target.value)}
                            options={filterOptions.concelhos}
                            placeholder="Todos os concelhos"
                        />
                        <FilterSelect
                            label="Escola"
                            value={activeFilters.escola_id}
                            onChange={(e) => updateFilter('escola_id', e.target.value)}
                            options={filteredSchools}
                            placeholder="Todas as escolas"
                            disabled={!activeFilters.concelho_id && filteredSchools.length !== filterOptions.schools.length}
                        />
                        <FilterSelect
                            label="Ano Escolar"
                            value={activeFilters.ano_escolar_id}
                            onChange={(e) => updateFilter('ano_escolar_id', e.target.value)}
                            options={filterOptions.years}
                            placeholder="Todos os anos"
                        />
                        <FilterSelect
                            label="Estado"
                            value={activeFilters.status}
                            onChange={(e) => updateFilter('status', e.target.value)}
                            options={filterOptions.statuses}
                            placeholder="Todos os estados"
                        />
                        <FilterSelect
                            label="Ordenação"
                            value={activeFilters.sort}
                            onChange={(e) => updateFilter('sort', e.target.value)}
                            options={[
                                { value: 'desc', label: 'Mais Recentes' },
                                { value: 'asc', label: 'Mais Antigas' }
                            ]}
                            placeholder=""
                            hideEmpty={true}
                        />
                    </div>
                </div>

                {/* 3. LISTA SISTEMÁTICA (DATA GRID) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Cabeçalho da Tabela (Visual) */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-4 md:col-span-3">Aluno / ID</div>
                        <div className="col-span-3 hidden md:block">Escola</div>
                        <div className="col-span-3 md:col-span-2">Estado</div>
                        <div className="col-span-3 md:col-span-2 text-right">Itens / Total</div>
                        <div className="col-span-2 md:col-span-2 text-right">Ação</div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {orders.data.length > 0 ? (
                            orders.data.map((order) => (
                                <CompactOrderRow
                                    key={order.id}
                                    order={order}
                                    onClick={() => setSelectedOrder(order)}
                                />
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-400">
                                <FaBox className="mx-auto text-4xl mb-3 opacity-20" />
                                <p>Nenhuma encomenda encontrada.</p>
                            </div>
                        )}
                    </div>

                    {/* Paginação Compacta */}
                    {orders.last_page > 1 && (
                        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-center">
                           <div className="flex gap-1">
                                {Array.from({ length: orders.last_page }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => changePage(page)}
                                        className={`w-8 h-8 flex items-center justify-center rounded text-xs font-medium transition ${
                                            page === orders.current_page
                                                ? 'bg-white text-indigo-600 border border-indigo-200 shadow-sm'
                                                : 'text-gray-500 hover:bg-gray-200'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                           </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </AuthenticatedLayout>
    );
}

// ---------------- SUB-COMPONENTES ----------------

function FilterSelect({ label, value, onChange, options, placeholder, disabled, hideEmpty }) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                {label}
            </label>
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
                {!hideEmpty && <option value="">{placeholder}</option>}
                {options.map((opt) => (
                    <option key={opt.id || opt.value} value={opt.id || opt.value}>
                        {opt.nome || opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function MiniStat({ label, value, color, bg, border }) {
    return (
        <div className={`${bg} ${border} border rounded-lg p-3 flex flex-col justify-center`}>
            <span className={`text-2xl font-bold ${color} leading-none`}>{value}</span>
            <span className="text-xs text-gray-600 font-medium mt-1 truncate">{label}</span>
        </div>
    );
}

function CompactOrderRow({ order, onClick }) {
    // Definição de cores e badges baseadas no status
    const statusConfig = {
        pendente: { color: 'border-l-amber-400', badge: 'bg-amber-100 text-amber-700', label: 'Pendente' },
        processamento: { color: 'border-l-blue-500', badge: 'bg-blue-100 text-blue-700', label: 'Processamento' },
        concluida: { color: 'border-l-emerald-500', badge: 'bg-emerald-100 text-emerald-700', label: 'Concluída' },
    };

    // Fallback se o status não existir no config
    const currentStatus = statusConfig[order.status.badge] || statusConfig.pendente;

    return (
        <div
            onClick={onClick}
            className={`group grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out border-l-4 ${currentStatus.color}`}
        >
            {/* Coluna 1: Aluno e ID */}
            <div className="col-span-4 md:col-span-3">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                        {order.student_name}
                    </span>
                    <span className="text-xs text-gray-400 font-mono mt-0.5">
                        #{order.id} • <span className="text-gray-500">{order.date}</span>
                    </span>
                </div>
            </div>

            {/* Coluna 2: Escola (Escondido em Mobile) */}
            <div className="col-span-3 hidden md:block">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700 truncate">
                        <FaSchool className="text-gray-400" />
                        {order.school}
                    </div>
                    <span className="text-[10px] text-gray-400 ml-5">{order.year} • {order.class_name || 'Sem turma'}</span>
                </div>
            </div>

            {/* Coluna 3: Status Badge */}
            <div className="col-span-3 md:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatus.badge}`}>
                    {order.status.label}
                </span>
            </div>

            {/* Coluna 4: Totais */}
            <div className="col-span-3 md:col-span-2 text-right">
                <p className="text-sm font-bold text-gray-900">€{order.total}</p>
                <p className="text-xs text-gray-500">{order.items.length} itens</p>
            </div>

            {/* Coluna 5: Ação */}
            <div className="col-span-2 md:col-span-2 text-right flex justify-end">
                <button className="text-gray-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-1">
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
}
