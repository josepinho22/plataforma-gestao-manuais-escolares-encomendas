import { Link, usePage } from "@inertiajs/react";
import {
  FaUser,
  FaHome,
  FaBox,
  FaBook,
  FaSignOutAlt,
  FaSchool,
  FaListAlt,
  FaWarehouse,
  FaExchangeAlt,
  FaFileImport,
} from "react-icons/fa";

export default function Sidebar({ user }) {
  const { url } = usePage();
  const currentPath = normalizePath(url);

  const menuItems = [
    
    {
      label: "Dashboard",
      href: route("dashboard"),
      active: isActive(currentPath, "/dashboard"),
      icon: <FaHome className="w-5 h-5" />,
      disabled: false,
    },

    
    {
      section: "Encomendas",
    },
    {
      label: "Encomendas - Clientes",
      href: route("orders.clientes.index"),
      active: isActive(currentPath, "/encomendas/clientes"),
      icon: <FaBox className="w-5 h-5" />,
      disabled: false,
    },
    {
      label: "Encomendas - Editora",
      href: route("orders.editora.index"),
      active: isActive(currentPath, "/encomendas/editora"),
      icon: <FaBox className="w-5 h-5" />,
      disabled: false,
    },
    
    {
      section: "Alunos",
    },
    {
      label: "Gerir Alunos",
      href: route('alunos.index'),
      active: isActive(currentPath, "/alunos"),
      icon: <FaBook className="w-5 h-5" />,
      disabled: false,
    },

    
    {
      section: "Catálogo",
    },
    {
      label: "Catálogo de Livros",
      href: route("catalogo.livros.index"),
      active: isActive(currentPath, "/catalogo/livros"),
      icon: <FaBook className="w-5 h-5" />,
      disabled: false,
    },

    
    {
      section: "Escolas",
    },
    {
      label: "Gerir Escolas",
      href: route('escolas.index'), 
      active: isActive(currentPath, "/escolas"),
      icon: <FaSchool className="w-5 h-5" />,
      disabled: false,
    },

    
    {
      section: "Listas",
    },
    {
      label: "Gerir Listas de Livros",
      href: route('books.index'), 
      active: isActive(currentPath, "/books-list"),
      icon: <FaListAlt className="w-5 h-5" />,
      disabled: false,
    },

    
    {
      section: "Stock",
      },
      {
          label: "Stock",
          href: route('stock.index'), 
          active: isActive(currentPath, "/stock"),
          icon: <FaWarehouse className="w-5 h-5" />,
          disabled: false,
      },

      {
      section: "Gestão",
      },
      {
          label: "Gestão",
          href: route('gestao.index'), 
          active: isActive(currentPath, "/gestao"),
          icon: <FaWarehouse className="w-5 h-5" />,
          disabled: false,
      },

    
    {
      section: "Conta",
    },
    {
      label: "Meu Perfil",
      href: route("profile.edit"),
      active: isActive(currentPath, "/profile"),
      icon: <FaUser className="w-5 h-5" />,
      disabled: false,
    },
  ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-50">
            
            <div className="h-16 flex items-center justify-center px-6 border-b border-gray-100">
                <Link href={route("dashboard")} className="flex items-center">
                    <img
                        src="/images/papelock_logo.png"
                        alt="Papelock"
                        className="h-10 w-auto object-contain"
                    />
                </Link>
            </div>

      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item, idx) => {
          if (item.section) {
            return (
              <div
                key={`section-${idx}`}
                className="pt-4 pb-2 px-2 text-xs font-bold uppercase tracking-wide text-gray-400"
              >
                {item.section}
              </div>
            );
          }

          return (
            <NavLink
              key={item.label}
              href={item.href}
              active={item.active}
              icon={item.icon}
              disabled={item.disabled}
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center w-full">
          <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
            {user.name.slice(0, 2).toUpperCase()}
          </div>

          <div className="ml-3 overflow-hidden w-full">
            <p className="text-sm font-medium text-gray-700 truncate">
              {user.name}
            </p>

            <Link
              href={route("logout")}
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

function normalizePath(url) {
  if (!url) return "/";
  const path = url.split("?")[0].split("#")[0];
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

function isActive(url, basePath) {
  const current = normalizePath(url);
  const base = normalizePath(basePath);
  return current === base || current.startsWith(`${base}/`);
}

function NavLink({ href, active, children, icon, disabled }) {
  return (
    <Link
      href={disabled ? "#" : href}
      as={disabled ? "span" : "a"}
      className={`
        flex items-center px-3 py-2 text-sm font-medium rounded-md group
        ${active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        transition-colors
      `}
    >
      {icon && (
        <span
          className={`mr-3 ${
            active ? "text-blue-700" : "text-gray-400 group-hover:text-gray-500"
          }`}
        >
          {icon}
        </span>
      )}
      {children}
    </Link>
  );
}