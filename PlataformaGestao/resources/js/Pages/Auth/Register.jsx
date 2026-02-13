import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-blue-50 px-4">
            <Head title="Registo - Papelix" />

            {/* Cartão de Registo */}
            <div className="w-full sm:max-w-md mt-6 px-8 py-10 bg-white shadow-xl overflow-hidden sm:rounded-lg">
                
                {/* Link para Voltar ao Login no Topo */}
                <div className="flex justify-end mb-6">
                    <p className="text-sm text-gray-600">
                        Já tem conta?{' '}
                        <Link
                            href={route('login')}
                            className="font-bold text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                        >
                            Entre aqui
                        </Link>
                    </p>
                </div>

                {/* 1. LOGO PAPELOCK */}
                <div className="flex justify-center mb-6">
                    <img 
                        src="/images/Papelock_logo.png" 
                        alt="Papelock Logo" 
                        className="h-32 w-auto mx-auto object-contain" 
                    />
                </div>

                {/* 2. TÍTULOS */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Criar Conta</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Registe-se para gerir os seus manuais escolares
                    </p>
                </div>

                {/* 3. FORMULÁRIO */}
                <form onSubmit={submit} className="space-y-4">
                    
                    {/* Nome */}
                    <div>
                        <label className="block font-medium text-sm text-gray-700">Nome Completo</label>
                        <input
                            type="text"
                            value={data.name}
                            className="mt-1 block w-full bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-0 rounded-md py-3 px-4 transition-all"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block font-medium text-sm text-gray-700">Email Profissional</label>
                        <input
                            type="email"
                            value={data.email}
                            className="mt-1 block w-full bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-0 rounded-md py-3 px-4 transition-all"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Palavra-passe */}
                    <div>
                        <label className="block font-medium text-sm text-gray-700">Palavra-passe</label>
                        <input
                            type="password"
                            value={data.password}
                            className="mt-1 block w-full bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-0 rounded-md py-3 px-4 transition-all"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Confirmar Palavra-passe */}
                    <div>
                        <label className="block font-medium text-sm text-gray-700">Confirmar Palavra-passe</label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            className="mt-1 block w-full bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-0 rounded-md py-3 px-4 transition-all"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                    </div>

                    {/* Botão Registar */}
                    <div className="pt-4">
                        <button
                            disabled={processing}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-50"
                        >
                            {processing ? 'A processar...' : 'Criar Conta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}