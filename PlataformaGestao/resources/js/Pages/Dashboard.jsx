import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    FaBoxOpen, FaBook, FaPlus, FaSearch, FaFileAlt,
    FaCheckCircle, FaExclamationTriangle, FaTruck, FaClipboardList, FaThLarge, FaArrowRight
} from "react-icons/fa";

export default function Dashboard({ auth }) {

    const customerStats = [
        { label: 'Pronto para Levantar', value: '1', icon: <FaCheckCircle />, color: 'border-green-500 text-green-600', btnColor: 'bg-green-600', href: route("orders.clientes.index") },
        { label: 'Faltam Livros', value: '2', icon: <FaExclamationTriangle />, color: 'border-red-500 text-red-600', btnColor: 'bg-red-600', href: route("orders.clientes.index") },
        { label: 'Aguarda Encapamento', value: '1', icon: <FaBoxOpen />, color: 'border-orange-500 text-orange-600', btnColor: 'bg-orange-600', href: route("orders.clientes.index") },
    ];

    const publisherStats = [
        { label: 'Para Encomendar', value: '7', icon: <FaClipboardList />, color: 'border-blue-400 text-blue-500', btnColor: 'bg-blue-500', href: route("orders.editora.index") },
        { label: 'Encomendadas', value: '8', icon: <FaTruck />, color: 'border-purple-400 text-purple-500', btnColor: 'bg-purple-500', href: route("orders.editora.index") },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="space-y-10">

                {/* 1. CABEÇALHO */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                    <p className="text-sm text-gray-500">Bem-vindo ao PAPELOCK - Gestão de Livros Escolares</p>
                </div>

                {/* 2. ACÇÕES RÁPIDAS */}
                <section>
                    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Ações Rápidas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <QuickAction icon={<FaPlus />} label="Nova Encomenda" variant="dark" href={route("orders.create")} />
                        <QuickAction icon={<FaSearch />} label="Consultar Encomendas" href={route("orders.clientes.index")} />
                        <QuickAction icon={<FaFileAlt />} label="Ver Relatórios" />
                    </div>
                </section>

                {/* 3. ENCOMENDAS - CLIENTES */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Encomendas - Clientes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {customerStats.map((stat, i) => (
                            <StatCard key={i} stat={stat} />
                        ))}
                    </div>
                </section>

                {/* 4. ENCOMENDAS - EDITORA */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Encomendas - Editora</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {publisherStats.map((stat, i) => (
                            <StatCard key={i} stat={stat} />
                        ))}
                    </div>
                </section>

                {/* 5. CARDS DE GESTÃO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FeatureCard title="Listas de Manuais" desc="Gerir listas de livros por escola e ano letivo" icon={<FaBook className="text-blue-500" />} href={route("manuais.index")} />
                    <FeatureCard title="Encomendas" desc="Ver e gerir todas as encomendas de alunos" icon={<FaPlus className="text-green-500" />} href={route("orders.clientes.index")} />
                    <FeatureCard title="Catálogo" desc="Gerir livros, preços e editoras" icon={<FaThLarge className="text-purple-500" />} href={route("catalogo.livros.index")}/>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// --- SUB-COMPONENTES ---

function QuickAction({ icon, label, variant = 'light', href }) {
    const isDark = variant === 'dark';
    const themeClasses = isDark
        ? 'bg-[#0a0a1a] text-white border-transparent'
        : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50';

    if (href) {
        return (
            <Link href={href} className={`relative overflow-hidden flex flex-col items-center justify-center p-8 rounded-lg border shadow-sm transition-all group ${themeClasses}`}>
                <div className="relative z-10 flex flex-col items-center">
                    <span className="text-2xl mb-3">{icon}</span>
                    <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
                </div>
            </Link>
        );
    }

    return (
        <button className={`relative overflow-hidden flex flex-col items-center justify-center p-8 rounded-lg border shadow-sm transition-all group ${themeClasses}`}>
            <div className="relative z-10 flex flex-col items-center">
                <span className="text-2xl mb-3">{icon}</span>
                <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
            </div>
        </button>
    );
}

function StatCard({ stat }) {
    return (
        <div className={`relative overflow-hidden bg-white p-6 rounded-xl border-2 ${stat.color} flex flex-col items-start gap-4 shadow-sm`}>
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
                    className={`mt-4 w-fit py-1.5 px-3 rounded-lg text-[10px] font-bold text-white flex items-center gap-2 hover:opacity-90 transition-opacity ${stat.btnColor}`}
                >
                    Ver Detalhes <FaArrowRight className="w-3 h-3"/>
                </Link>
            </div>
        </div>
    );
}

function FeatureCard({ title, desc, icon, href }) {
    if (href) {
        return (
            <Link href={href} className="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gray-50 rounded-lg text-sm group-hover:bg-white transition-colors">{icon}</div>
                    <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">{desc}</p>
            </Link>
        );
    }

    return (
        <div className="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-50 rounded-lg text-sm group-hover:bg-white transition-colors">{icon}</div>
                <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">{desc}</p>
        </div>
    );
}
