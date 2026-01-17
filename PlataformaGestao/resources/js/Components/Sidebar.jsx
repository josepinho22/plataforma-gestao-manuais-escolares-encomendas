import { Link } from '@inertiajs/react';
import { FaUser, FaHome, FaBox, FaBook, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar({ user }) {

    const menuItems = [
        {
            label: 'Dashboard',
            href: route('dashboard'),
            active: route().current('dashboard'),
            icon: <FaHome className="w-5 h-5" />,
        },
        {
            label: 'Encomendas - Clientes',
            href: route('orders.index'), 
            active: route().current('orders.*'), 
            icon: <FaBox className="w-5 h-5" />, 
            disabled: false, 
        },
         {
            label: 'Encomendas - Editora',
            href: route('orders.index'), 
            active: route().current('orders.*'), 
            icon: <FaBox className="w-5 h-5" />, 
            disabled: false, 
        },
        {
            label: 'Catálogo de Livros',
            href: '#', 
            active: false,
            icon: <FaBook className="w-5 h-5" />,
            disabled: true,
        },
        {
            label: 'Meu Perfil',
            href: route('profile.edit'), 
            active: route().current('profile.edit'),
            icon: <FaUser className="w-5 h-5" />,
        }
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-50">

            {/* 1. LOGO */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <Link href={route('dashboard')} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">
                        P
                    </div>
                    <img 
                        src="/images/papelix.png" 
                        alt="Papelix Logo" 
                        className="h-8 w-auto" 
                        onError={(e) => e.target.style.display = 'none'}
                    />
                </Link>
            </div>

            {/* 2. MENU DE NAVEGAÇÃO */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {menuItems.map(({ label, href, active, icon, disabled }) => (
                    <NavLink
                        key={label}
                        href={href}
                        active={active}
                        icon={icon}
                        disabled={disabled}
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* 3. PERFIL DO UTILIZADOR */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center w-full">
                    <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                        {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    
                
                    <div className="ml-3 overflow-hidden w-full">
                        <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
                        
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button" 
                            className="flex items-center text-xs text-red-600 hover:text-red-800 hover:underline font-medium mt-1 w-full text-left"
                        >
                            <p>Terminar Sessão</p>
                            <FaSignOutAlt className="w-3 h-3 mr-5 ml-2" /> 
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}

// Sub-componente seguro para NavLink
function NavLink({ href, active, children, icon, disabled }) {
    return (
        <Link
            href={disabled ? '#' : href}
            as={disabled ? 'span' : 'a'} 
            className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-md group
                ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                transition-colors
            `}
        >
            {icon && <span className={`mr-3 ${active ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}`}>{icon}</span>}
            {children}
        </Link>
    );
}