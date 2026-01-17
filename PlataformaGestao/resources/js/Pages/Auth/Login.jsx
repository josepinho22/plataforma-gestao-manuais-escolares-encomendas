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
            <Head title="Login - Papelix" />

            {/* Cartão de Login */}
            <div className="w-full sm:max-w-md mt-6 px-6 py-10 bg-white shadow-xl overflow-hidden sm:rounded-lg">
                
                {/* 1. LOGO */}
                <div className="flex justify-center mb-6">
                    {/* Certifica-te que a imagem está em public/images/logo_papelix.png */}
                    <img 
                        src="/images/papelix.png" 
                        alt="Papelix Logo" 
                        className="h-50 w-auto mx-auto" 
                    />
                    {/* Se a imagem não carregar, aparece texto temporário */}
                    <span className="sr-only">Papelix</span>
                </div>

                {/* 2. TÍTULOS */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Bem-vindo
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Faça login para acessar a plataforma de gestão de manuais escolares
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
                            className="mt-1 block w-full bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 rounded-md py-3 px-4"
                            placeholder="seu@email.com"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
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
                            className="mt-1 block w-full bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 rounded-md py-3 px-4"
                            placeholder="........"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
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
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition duration-150 ease-in-out"
                        >
                            Entrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}