import { Link } from '@inertiajs/react';

export default function Sidebar({ user }) {
 
    // Menu configurável, sem alterar lógica original
    const menuItems = [
        {
            label: 'Dashboard',
            href: route('dashboard'),
            active: route().current('dashboard'),
            icon: null, // adicionar ícone depois
        },
        {
            label: 'Encomendas',
            href: '#',
            active: false,
            icon: null,
            disabled: true,
        },
        {
            label: 'Catálogo de Livros',
            href: '#', // futuramente route('books.index')
            active: false,
            icon: null,
            disabled: true,
        },
        {
            label: 'Meu Perfil',
            href: route('profile.update'),
            active: route().current('profile.update'),
            icon: null,
        },
        {
            label: 'Meu Perfil',
            href: route('profile.update'),
            active: route().current('profile.update'),
            icon: null,
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
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-xs text-red-600 hover:underline font-medium block text-left w-full mt-1"
                        >
                            Terminar Sessão
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
            aria-disabled={disabled}
            className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-md
                ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                transition-colors
            `}
        >
            {icon && <span className="mr-3">{icon}</span>}
            {children}
        </Link>
    );
}
 