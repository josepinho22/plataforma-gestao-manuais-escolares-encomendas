import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-blue-50">
            <Head title="Login" />

            {/* Cartão de Login */}
            <div className="w-full sm:max-w-md mt-6 px-6 py-10 bg-white shadow-xl overflow-hidden sm:rounded-lg">

                {/* 1. LOGO (Atualizado para o nome do ficheiro correto) */}
                <div className="flex justify-center mb-6">
                    <img 
                        src="/images/Papelock_logo.png" 
                        alt="Papelix Logo" 
                        className="h-40 w-auto mx-auto object-contain" 
                    />
                    <span className="sr-only">Papelix</span>
                </div>

                {/* 2. TÍTULOS */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Bem-vindo
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Faça login para aceder à plataforma de gestão
                    </p>
                </div>

                {/* 3. FORMULÁRIO */}
                <form onSubmit={submit}>
                    
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block font-medium text-sm text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-0 rounded-md py-3 px-4 transition-all"
                            placeholder="seu@email.com"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Password */}
                    <div className="mt-4">
                        <label htmlFor="password" className="block font-medium text-sm text-gray-700">
                            Palavra-passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-0 rounded-md py-3 px-4 transition-all"
                            placeholder="........"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Esqueceu a password */}
                    <div className="flex items-center justify-between mt-4">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-gray-900 font-semibold hover:underline"
                            >
                                Esqueceu a palavra-passe?
                            </Link>
                        )}
                    </div>

                    {/* Botão Entrar */}
                    <div className="mt-6">
                        <button
                            disabled={processing}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-150 ease-in-out disabled:opacity-50"
                        >
                            {processing ? 'A entrar...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}