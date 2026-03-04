import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
    FaPlus, FaSearch, FaTimes,
    FaBox, FaSchool, FaChevronRight, FaClock, FaCheckCircle, FaSpinner
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

    // Aplicar filtros
    const applyFilters = () => {
        const params = pickBy({
            search,
            ...activeFilters
        }, value => value !== '');

        router.get('/encomendas/clientes', params, {
            preserveState: true,
            replace: true,
            preserveScroll: true
        });
    };

    // Atualizar filtro individual
    const updateFilter = (key, value) => {
        const newFilters = { ...activeFilters, [key]: value };
        if (key === 'concelho_id') {
            newFilters.escola_id = '';
        }
        setActiveFilters(newFilters);
        const params = pickBy({ search, ...newFilters }, v => v !== '');
        router.get('/encomendas/clientes', params, {
            preserveState: true,
            replace: true,
            preserveScroll: true
        });
    };

    // Filtrar escolas
    const filteredSchools = activeFilters.concelho_id
        ? filterOptions.schools.filter(s => s.concelho_id == activeFilters.concelho_id)
        : filterOptions.schools;

    const handleSearch = (e) => { e.preventDefault(); };
    const clearSearch = () => { setSearch(''); };

    const changePage = (page) => {
        const params = pickBy({ search, ...activeFilters, page }, value => value !== '');
        router.get('/encomendas/clientes', params, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Encomendas" />

            {/* Fundo Edge-to-Edge estilo Glassmorphism */}
            <div className="-m-8 min-h-screen bg-gray-50/80 font-sans flex flex-col">
                <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 py-8 space-y-6">

                    {/* 1. HEADER E AÇÕES */}
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-2">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Encomendas</h1>
                            <p className="text-sm text-gray-500/80 mt-1 font-medium">Gestão e processamento de pedidos</p>
                        </div>
                        
                        <div className="flex gap-3 w-full md:w-auto items-center">
                            {/* Barra de Pesquisa Glass */}
                            <form onSubmit={handleSearch} className="relative flex-1 md:w-80 group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400 text-xs group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Pesquisar NIF, Nome, ID..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="glass-input w-full pl-10 pr-10 py-2.5 text-sm rounded-xl placeholder:text-gray-400/70 border-transparent focus:border-indigo-500 focus:ring-0 transition-all shadow-sm"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200/50 transition"
                                    >
                                        <FaTimes size={12} />
                                    </button>
                                )}
                            </form>

                            {/* Botão Nova Encomenda (Gradiente) */}
                            <a href="/encomendas/clientes/create" 
                               className="px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 active:scale-[0.97] flex items-center gap-2 whitespace-nowrap"
                            >
                                <FaPlus className="text-xs" />
                                <span className="hidden sm:inline">Nova Encomenda</span>
                            </a>
                        </div>
                    </div>

                    {/* 2. STATS (Estilo Card 3D) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <GlassStat 
                            label="Pendentes" 
                            value={stats.pendentes} 
                            icon={FaClock} 
                            gradient="from-amber-400 to-orange-500" 
                            shadow="shadow-amber-500/20" 
                        />
                        <GlassStat 
                            label="Processamento" 
                            value={stats.processamento} 
                            icon={FaSpinner} 
                            gradient="from-blue-400 to-indigo-500" 
                            shadow="shadow-blue-500/20" 
                        />
                         {/* Exemplo estático */}
                        <GlassStat 
                            label="A Levantar" 
                            value="12" 
                            icon={FaBox} 
                            gradient="from-purple-400 to-fuchsia-500" 
                            shadow="shadow-purple-500/20" 
                        />
                        <GlassStat 
                            label="Concluídas" 
                            value={stats.concluidas} 
                            icon={FaCheckCircle} 
                            gradient="from-emerald-400 to-teal-500" 
                            shadow="shadow-emerald-500/20" 
                        />
                    </div>

                    {/* 2.5 BARRA DE FILTROS (Glass Panel) */}
                    <div className="card-3d rounded-3xl p-1.5 animate-card-in">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                            <GlassFilterSelect
                                label="Concelho"
                                value={activeFilters.concelho_id}
                                onChange={(e) => updateFilter('concelho_id', e.target.value)}
                                options={filterOptions.concelhos}
                                placeholder="Todos os concelhos"
                            />
                            <GlassFilterSelect
                                label="Escola"
                                value={activeFilters.escola_id}
                                onChange={(e) => updateFilter('escola_id', e.target.value)}
                                options={filteredSchools}
                                placeholder="Todas as escolas"
                                disabled={!activeFilters.concelho_id && filteredSchools.length !== filterOptions.schools.length}
                            />
                            <GlassFilterSelect
                                label="Ano Escolar"
                                value={activeFilters.ano_escolar_id}
                                onChange={(e) => updateFilter('ano_escolar_id', e.target.value)}
                                options={filterOptions.years}
                                placeholder="Todos os anos"
                            />
                            <GlassFilterSelect
                                label="Estado"
                                value={activeFilters.status}
                                onChange={(e) => updateFilter('status', e.target.value)}
                                options={filterOptions.statuses}
                                placeholder="Todos os estados"
                            />
                            <GlassFilterSelect
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

                    {/* 3. LISTA (Card 3D + Table) */}
                    <div className="card-3d rounded-3xl overflow-hidden shadow-sm animate-card-in-delay flex flex-col min-h-[400px]">
                        
                        {/* Header Tabela */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            <div className="col-span-4 md:col-span-3 pl-2">Aluno / ID</div>
                            <div className="col-span-3 hidden md:block">Escola</div>
                            <div className="col-span-3 md:col-span-2">Estado</div>
                            <div className="col-span-3 md:col-span-2 text-right">Valor</div>
                            <div className="col-span-2 md:col-span-2 text-right pr-2">Ação</div>
                        </div>

                        <div className="flex-1 divide-y divide-gray-100">
                            {orders.data.length > 0 ? (
                                orders.data.map((order) => (
                                    <GlassOrderRow
                                        key={order.id}
                                        order={order}
                                        onClick={() => setSelectedOrder(order)}
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <FaBox className="text-2xl opacity-20" />
                                    </div>
                                    <p className="text-sm font-medium">Nenhuma encomenda encontrada.</p>
                                </div>
                            )}
                        </div>

                        {/* Paginação Glass */}
                        {orders.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex justify-center">
                                <div className="flex gap-1.5 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
                                    {Array.from({ length: orders.last_page }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => changePage(page)}
                                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-200 ${
                                                page === orders.current_page
                                                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                                    : 'text-gray-500 hover:bg-gray-100'
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
            </div>

            {/* MODAL */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onSave={() => {
                        setSelectedOrder(null);
                        router.reload({ preserveScroll: true });
                    }}
                />
            )}
        </AuthenticatedLayout>
    );
}

// ---------------- SUB-COMPONENTES ESTILIZADOS ----------------

function GlassFilterSelect({ label, value, onChange, options, placeholder, disabled, hideEmpty }) {
    return (
        <div className="relative group">
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full pl-3 pr-8 py-2.5 text-xs font-semibold bg-gray-50/50 hover:bg-white border-transparent hover:border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 outline-none appearance-none"
            >
                {!hideEmpty && <option value="">{label}: {placeholder}</option>}
                {hideEmpty && <option value="" disabled>{label}</option>}
                {options.map((opt) => (
                    <option key={opt.id || opt.value} value={opt.id || opt.value}>
                        {opt.nome || opt.label}
                    </option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-indigo-500 transition-colors">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    );
}

function GlassStat({ label, value, icon: Icon, gradient, shadow }) {
    return (
        <div className="card-3d rounded-2xl p-4 flex items-center gap-4 animate-card-in hover:scale-[1.02] transition-transform duration-200">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadow} shrink-0`}>
                <Icon className="text-white text-lg" />
            </div>
            <div>
                <p className="text-2xl font-extrabold text-gray-800 leading-none">{value}</p>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mt-1">{label}</p>
            </div>
        </div>
    );
}

function GlassOrderRow({ order, onClick }) {
    // Configuração de Badges Transparente
    const statusConfig = {
        pendente: { bg: 'bg-amber-500/10', text: 'text-amber-600', label: 'Pendente' },
        processamento: { bg: 'bg-blue-500/10', text: 'text-blue-600', label: 'Processamento' },
        concluida: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', label: 'Concluída' },
        ensacamento: { bg: 'bg-blue-600', text: 'text-blue-50', label: 'Aguarda Ensacamento' },
        encapamento: { bg: 'bg-blue-500/10', text: 'text-blue-600', label: 'Aguarda Encapamento' },
        levantamento: { bg: 'bg-purple-500/10', text: 'text-purple-600', label: 'Aguarda Levantamento' },
    };

    const currentStatus = statusConfig[order.status.badge] || statusConfig.pendente;

    return (
        <div
            onClick={onClick}
            className="group grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-indigo-50/30 cursor-pointer transition-all duration-200 border-l-[3px] border-l-transparent hover:border-l-indigo-500"
        >
            {/* Coluna 1: Aluno */}
            <div className="col-span-4 md:col-span-3 pl-2">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                        {order.student_name}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium mt-0.5 flex items-center gap-1.5">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">#{order.id}</span>
                        <span>{order.date}</span>
                    </span>
                </div>
            </div>

            {/* Coluna 2: Escola */}
            <div className="col-span-3 hidden md:block">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 truncate">
                        <FaSchool className="text-gray-300" />
                        {order.school}
                    </div>
                    <span className="text-[10px] text-gray-400 ml-5">{order.concelho} • {order.year}</span>
                </div>
            </div>

            {/* Coluna 3: Status Badge */}
            <div className="col-span-3 md:col-span-2">
                <span className={`inline-flex items-center justify-center w-[160px] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${currentStatus.bg} ${currentStatus.text}`}>
                    {order.status.label}
                </span>
            </div>

            {/* Coluna 4: Valor */}
            <div className="col-span-3 md:col-span-2 text-right">
                <p className="text-sm font-extrabold text-gray-800">€{order.total}</p>
                <p className="text-[10px] text-gray-400 font-medium">{order.items.length} itens</p>
            </div>

            {/* Coluna 5: Ação */}
            <div className="col-span-2 md:col-span-2 text-right flex justify-end pr-2">
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm transition-all">
                    <FaChevronRight size={12} />
                </button>
            </div>
        </div>
    );
}