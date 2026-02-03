import { Link } from '@inertiajs/react';
import { 
    FaThLarge, FaPlus, FaBox, FaBook, FaListUl, FaTruck, FaSignOutAlt 
} from "react-icons/fa";

export default function Sidebar({ user }) {
    // 1. Definição dos itens do menu conforme a tua imagem
    const menuItems = [
        { label: 'Dashboard', href: route('dashboard'), active: route().current('dashboard'), icon: <FaThLarge /> },
        { label: 'Nova Encomenda', href: '#', active: false, icon: <FaPlus /> },
        { label: 'Encomendas', href: route('orders.index'), active: route().current('orders.*'), icon: <FaBox /> },
        { label: 'Catálogo de Livros', href: '#', active: false, icon: <FaBook /> },
        { label: 'Listas de Livros', href: route('books.index'), active: route().current('books.index'), icon: <FaListUl /> },
        { label: 'Encomendas à Editora', href: '#', active: false, icon: <FaTruck /> },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-50">
        
            {/* 1. ÁREA DA LOGO - Fiel ao design da imagem */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-center min-h-[120px]">
                    <Link 
                        href={route('dashboard')} 
                        className="flex items-center justify-center w-full"
                    >
                        <img 
                            src="images/Papelock_logo.png"
                            alt="Papelock Logo" 
                            className="h-16 w-auto object-contain transition-transform hover:scale-105"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }}
                        />
                        {/* Texto de segurança caso a imagem não carregue */}
                        <span className="hidden text-blue-600 font-black text-2xl tracking-tight">
                            Papelock
                        </span>
                    </Link>
                </div>


            {/* 3. NAVEGAÇÃO PRINCIPAL */}
            <nav className="flex-1 px-3 py-6 space-y-1">
                {menuItems.map((item) => (
                    <NavLink key={item.label} {...item} />
                ))}
            </nav>

            {/* 4. RODAPÉ DO UTILIZADOR (Versão limpa conforme a imagem) */}
            <div className="p-4 border-t border-gray-50 bg-white">
                <div className="flex flex-col gap-2">
                    <div className="px-2">
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    </div>
                    
                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button" 
                        className="flex items-center gap-2 px-2 py-2 text-xs text-red-500 hover:bg-red-50 rounded-md transition-colors w-full font-bold"
                    >
                        <FaSignOutAlt className="w-3 h-3" />
                        Terminar Sessão
                    </Link>
                </div>
            </div>
        </aside>
    );
}

// 5. SUB-COMPONENTE NAVLINK (Mais simples e fiel ao design)
function NavLink({ href, active, label, icon }) {
    return (
        <Link
            href={href}
            className={`
                flex items-center px-4 py-3 text-sm font-bold rounded-lg transition-all
                ${active 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
            `}
        >
            <span className={`mr-3 text-lg ${active ? 'text-white' : 'text-gray-400'}`}>
                {icon}
            </span>
            {label}
        </Link>
    );
}