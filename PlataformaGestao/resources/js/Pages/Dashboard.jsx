import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    FaBoxOpen, FaBook, FaPlus, FaSearch, FaFileAlt,
    FaCheckCircle, FaExclamationTriangle, FaTruck, FaClipboardList, FaThLarge, FaArrowRight
} from "react-icons/fa";

export default function Dashboard({ auth, stats = {}, anosLetivos = [], encapadosPorAno = {} }) {

    const customerStats = [
        { label: 'Aguarda Livros',       value: stats.aguardaLivros       ?? 0, icon: <FaExclamationTriangle />, color: 'border-red-500 text-red-600',       btnColor: 'bg-red-600',    href: route("orders.clientes.index", { status: 'AGUARDA_LIVROS',       sort: 'asc' }) },
        { label: 'Aguarda Ensacamento',  value: stats.aguardaEnsacamento  ?? 0, icon: <FaFileAlt />,             color: 'border-yellow-500 text-yellow-600', btnColor: 'bg-yellow-500', href: route("orders.clientes.index", { status: 'AGUARDA_ENSACAMENTO',  sort: 'asc' }) },
        { label: 'Aguarda Encapamento',  value: stats.aguardaEncapamento  ?? 0, icon: <FaBoxOpen />,             color: 'border-orange-500 text-orange-600', btnColor: 'bg-orange-600', href: route("orders.clientes.index", { status: 'AGUARDA_ENCAPAMENTO',  sort: 'asc' }) },
        { label: 'Aguarda Levantamento', value: stats.aguardaLevantamento ?? 0, icon: <FaCheckCircle />,         color: 'border-green-500 text-green-600',   btnColor: 'bg-green-600',  href: route("orders.clientes.index", { status: 'AGUARDA_LEVANTAMENTO', sort: 'asc' }) },
    ];

    const publisherStats = [
        { label: 'Solicitado',      value: stats.paraEncomendar ?? 0, icon: <FaClipboardList />, color: 'border-blue-400 text-blue-500',   btnColor: 'bg-blue-500',   href: route("orders.editora.index", { status: 'SOLICITADO' }) },
        { label: 'Entrega Parcial', value: stats.encomendadas   ?? 0, icon: <FaTruck />,         color: 'border-purple-400 text-purple-500', btnColor: 'bg-purple-500', href: route("orders.editora.index", { status: 'ENTREGA_PARCIAL' }) },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="-m-8 min-h-screen bg-gray-50/80 font-sans flex flex-col">
                <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 py-8 space-y-8">

                    {/* 1. CABEÇALHO */}
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
                        <p className="text-sm text-gray-500/80 mt-1 font-medium">Bem-vindo ao PAPELOCK - Gestão de Livros Escolares</p>
                    </div>

                    {/* 2. ACÇÕES RÁPIDAS */}
                    <section>
                        <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Ações Rápidas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <QuickAction icon={<FaPlus />} label="Nova Encomenda" variant="dark" href={route("orders.create")} />
                            <QuickAction icon={<FaSearch />} label="Consultar Encomendas" href={route("orders.clientes.index")} />
                        </div>
                    </section>

                    {/* 3. ENCOMENDAS - CLIENTES */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Encomendas - Clientes</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {customerStats.map((stat, i) => (
                                <StatCard key={i} stat={stat} />
                            ))}
                        </div>
                    </section>

                    {/* 4. ENCOMENDAS - EDITORA */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Encomendas - Editora</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {publisherStats.map((stat, i) => (
                                <StatCard key={i} stat={stat} />
                            ))}
                        </div>
                    </section>

                    {/* 5. ESTATÍSTICAS */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estatísticas</h3>
                        <EncapadosCard anosLetivos={anosLetivos} encapadosPorAno={encapadosPorAno} />
                    </section>

                    {/* 6. CARDS DE GESTÃO */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FeatureCard title="Listas de Manuais" desc="Gerir listas de livros por escola e ano letivo" icon={<FaBook className="text-blue-500" />} href={route("manuais.index")} />
                        <FeatureCard title="Encomendas" desc="Ver e gerir todas as encomendas de alunos" icon={<FaPlus className="text-indigo-500" />} href={route("orders.clientes.index")} />
                        <FeatureCard title="Catálogo" desc="Gerir livros, preços e editoras" icon={<FaThLarge className="text-purple-500" />} href={route("catalogo.livros.index")}/>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// --- SUB-COMPONENTES ---

function QuickAction({ icon, label, variant = 'light', href }) {
    const isDark = variant === 'dark';
    const themeClasses = isDark
        ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 border-transparent'
        : 'card-3d text-gray-700 hover:shadow-md';

    if (href) {
        return (
            <Link href={href} className={`relative overflow-hidden flex flex-col items-center justify-center p-8 rounded-2xl border transition-all duration-200 active:scale-[0.97] group ${themeClasses}`}>
                <div className="relative z-10 flex flex-col items-center">
                    <span className="text-2xl mb-3">{icon}</span>
                    <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
                </div>
            </Link>
        );
    }

    return (
        <button className={`relative overflow-hidden flex flex-col items-center justify-center p-8 rounded-2xl border transition-all duration-200 active:scale-[0.97] group ${themeClasses}`}>
            <div className="relative z-10 flex flex-col items-center">
                <span className="text-2xl mb-3">{icon}</span>
                <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
            </div>
        </button>
    );
}

function StatCard({ stat }) {
    return (
        <div className={`card-3d animate-card-in relative overflow-hidden p-6 rounded-2xl border-l-4 ${stat.color} flex flex-col items-start gap-4`}>
            {/* Ícone Decorativo no Fundo */}
            <div className="absolute -right-4 -bottom-4 opacity-10 text-8xl transform rotate-12">
                {stat.icon}
            </div>

            {/* Conteúdo Principal */}
            <div className="relative z-10 w-full">
                <div className="flex items-center gap-2 opacity-80 mb-1">
                    <span className="text-sm">{stat.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
                </div>
                <span className="text-5xl font-bold block">{stat.value}</span>

                <Link
                    href={stat.href || "#"}
                    className={`mt-4 w-full py-2 px-3 rounded-xl text-[10px] font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity ${stat.btnColor}`}
                >
                    Ver Detalhes <FaArrowRight className="w-3 h-3"/>
                </Link>
            </div>
        </div>
    );
}

function EncapadosCard({ anosLetivos, encapadosPorAno }) {
    const [selectedAno, setSelectedAno] = useState(anosLetivos[0]?.id ?? '');
    const total = encapadosPorAno[selectedAno] ?? 0;

    return (
        <div className="card-3d animate-card-in relative overflow-hidden p-6 rounded-2xl border-l-4 border-teal-500 text-teal-600 flex flex-col items-start gap-4">
            <div className="absolute -right-4 -bottom-4 opacity-10 text-8xl transform rotate-12">
                <FaBook />
            </div>

            <div className="relative z-10 w-full">
                <div className="flex items-center gap-2 opacity-80 mb-3">
                    <span className="text-sm"><FaBook /></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Livros Encapados por Ano Letivo</span>
                </div>

                <select
                    value={selectedAno}
                    onChange={e => setSelectedAno(Number(e.target.value))}
                    className="w-full mb-4 py-1.5 px-3 rounded-xl text-[11px] font-semibold border border-teal-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                    {anosLetivos.length === 0
                        ? <option value="">Sem anos letivos</option>
                        : anosLetivos.map(ano => (
                            <option key={ano.id} value={ano.id}>{ano.nome}</option>
                        ))
                    }
                </select>

                <span className="text-5xl font-bold block">{total}</span>
            </div>
        </div>
    );
}

function FeatureCard({ title, desc, icon, href }) {
    if (href) {
        return (
            <Link href={href} className="group card-3d animate-card-in p-6 rounded-2xl hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gray-50/80 rounded-xl text-sm group-hover:bg-white transition-colors">{icon}</div>
                    <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">{desc}</p>
            </Link>
        );
    }

    return (
        <div className="group card-3d animate-card-in p-6 rounded-2xl hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-50/80 rounded-xl text-sm group-hover:bg-white transition-colors">{icon}</div>
                <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">{desc}</p>
        </div>
    );
}
