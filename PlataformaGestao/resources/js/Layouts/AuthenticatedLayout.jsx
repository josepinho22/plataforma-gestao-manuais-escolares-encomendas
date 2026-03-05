import Sidebar from '@/Components/Sidebar'; // Importamos o ficheiro que criámos acima
import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    // Vamos buscar o utilizador logado
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-gray-50">
            
            {/* 1. A Sidebar Fixa à Esquerda */}
            <Sidebar user={user} />

            {/* 2. O Conteúdo Principal */}
            {/* ml-64 (margin-left: 16rem) empurra o conteúdo para não ficar escondido debaixo da sidebar */}
            <main className="ml-64 min-h-screen transition-all duration-300">
                
                {/* Cabeçalho da Página (Aquela barra branca no topo do conteúdo, se existir) */}
                {header && (
                    <header className="bg-white shadow-sm border-b border-gray-200">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Aqui entra o teu Dashboard, Tabelas, Formulários */}
                <div className="py-8 px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}