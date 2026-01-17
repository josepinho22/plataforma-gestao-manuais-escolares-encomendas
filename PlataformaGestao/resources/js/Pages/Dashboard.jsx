import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    FaBoxOpen, FaBook, FaHistory, FaPlus, FaSearch, FaFileAlt, 
    FaCheckCircle, FaExclamationTriangle, FaTruck, FaClipboardList, FaArrowRight 
} from "react-icons/fa";

export default function Dashboard({ auth }) {
    
    const customerStats = [
        { 
            label: 'Pronto p/ levantar', 
            value: '24', 
            icon: <FaCheckCircle />,
            href: route('orders.index'), 
            color: 'bg-green-50 text-green-700 border-green-200',
            btnColor: 'bg-green-600 hover:bg-green-700'
        },
        { 
            label: 'Faltam Livros', 
            value: '8', 
            icon: <FaExclamationTriangle />,
            href: '#', 
            color: 'bg-red-50 text-red-700 border-red-200',
            btnColor: 'bg-red-600 hover:bg-red-700'
        },
        { 
            label: 'Aguarda Encapamento', 
            value: '12', 
            icon: <FaBoxOpen />,
            href: '#', 
            color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            btnColor: 'bg-yellow-600 hover:bg-yellow-700'
        },
    ];

    const publisherStats = [
        { 
            label: 'Para encomendar', 
            value: '24', 
            icon: <FaClipboardList />,
            href: '#', 
            color: 'bg-orange-50 text-orange-700 border-orange-200',
            btnColor: 'bg-orange-600 hover:bg-orange-700'
        },
        { 
            label: 'Já Encomendadas', 
            value: '8', 
            icon: <FaTruck />,
            href: '#', 
            color: 'bg-blue-50 text-blue-700 border-blue-200',
            btnColor: 'bg-blue-600 hover:bg-blue-700'
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="space-y-8">

                {/* 1. BARRA DE AÇÕES RÁPIDAS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Olá, {auth.user.name} 👋</h2>
                        <p className="text-sm text-gray-500">O que pretende fazer hoje?</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <QuickAction icon={<FaPlus />} label="Nova Encomenda" primary />
                        <QuickAction icon={<FaSearch />} label="Consultar" />
                        <QuickAction icon={<FaFileAlt />} label="Relatórios" />
                    </div>
                </div>

                {/* 2. ESTATÍSTICAS (GRID PRINCIPAL) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Coluna Esquerda: Clientes */}
                    <div className="space-y-4">
                        <SectionHeader title="Encomendas Clientes" icon={<FaBoxOpen className="text-blue-600"/>} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {customerStats.map((stat, index) => (
                                <StatCard key={index} stat={stat} />
                            ))}
                        </div>
                    </div>

                    {/* Coluna Direita: Editora */}
                    <div className="space-y-4">
                        <SectionHeader title="Encomendas Editora" icon={<FaTruck className="text-purple-600"/>} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {publisherStats.map((stat, index) => (
                                <StatCard key={index} stat={stat} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. MENU DE ACESSO RÁPIDO */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">Gestão da Plataforma</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard 
                            title="Listas de Manuais" 
                            desc="Gerir manuais por escola e ano"
                            icon={<FaBook />}
                            color="bg-blue-600"
                        />
                        <FeatureCard 
                            title="Gestão de Encomendas" 
                            desc="Painel completo de encomendas"
                            icon={<FaBoxOpen />}
                            color="bg-green-600"
                            href={route('orders.index')}
                        />
                        <FeatureCard 
                            title="Histórico Completo" 
                            desc="Consultar anos anteriores"
                            icon={<FaHistory />}
                            color="bg-purple-600"
                        />
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

// --- SUB-COMPONENTES (Para manter o código limpo) ---

function SectionHeader({ title, icon }) {
    return (
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            {icon}
            <h3 className="font-bold text-gray-800">{title}</h3>
        </div>
    );
}

function StatCard({ stat }) {
    return (
        <div className={`p-5 rounded-xl border ${stat.color} transition-all duration-200 hover:shadow-md flex flex-col justify-between h-36 relative overflow-hidden`}>
            {/* Ícone de fundo decorativo */}
            <div className="absolute -right-4 -top-4 opacity-10 text-6xl">
                {stat.icon}
            </div>

            <div>
                <div className="flex items-center gap-2 mb-1 opacity-90">
                    {stat.icon}
                    <span className="text-xs font-bold uppercase tracking-wide">{stat.label}</span>
                </div>
                <span className="text-4xl font-black tracking-tight">{stat.value}</span>
            </div>

            <Link 
                href={stat.href} 
                className={`mt-2 py-1.5 px-3 rounded-lg text-xs font-bold text-white text-center flex items-center justify-center gap-2 transition-colors ${stat.btnColor}`}
            >
                Ver Detalhes <FaArrowRight className="w-3 h-3"/>
            </Link>
        </div>
    );
}

function QuickAction({ icon, label, primary = false }) {
    return (
        <button className={`
            flex items-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all
            ${primary 
                ? 'bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'}
        `}>
            <span className="mr-2 text-lg">{icon}</span>
            {label}
        </button>
    );
}

function FeatureCard({ title, desc, icon, color, href = '#' }) {
    return (
        <Link href={href} className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col items-start">
            <div className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center text-xl mb-4 shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                {icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{desc}</p>
        </Link>
    );
}