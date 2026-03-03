import { useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function UpdateCompanyForm({ className = '' }) {
    const { companySettings } = usePage().props;

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        nome:     companySettings?.nome     ?? '',
        morada:   companySettings?.morada   ?? '',
        telefone: companySettings?.telefone ?? '',
        email:    companySettings?.email    ?? '',
        nif:      companySettings?.nif      ?? '',
        logo_url: companySettings?.logo_url ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('settings.company.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Dados da Empresa</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Estas informações aparecem nos PDFs gerados (encomendas a clientes e a editoras).
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="nome" value="Nome da Empresa" />
                    <TextInput
                        id="nome"
                        className="mt-1 block w-full"
                        value={data.nome}
                        onChange={(e) => setData('nome', e.target.value)}
                        required
                        autoComplete="organization"
                    />
                    <InputError className="mt-2" message={errors.nome} />
                </div>

                <div>
                    <InputLabel htmlFor="morada" value="Morada" />
                    <TextInput
                        id="morada"
                        className="mt-1 block w-full"
                        value={data.morada}
                        onChange={(e) => setData('morada', e.target.value)}
                        autoComplete="street-address"
                    />
                    <InputError className="mt-2" message={errors.morada} />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="telefone" value="Telefone" />
                        <TextInput
                            id="telefone"
                            type="tel"
                            className="mt-1 block w-full"
                            value={data.telefone}
                            onChange={(e) => setData('telefone', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.telefone} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="nif" value="NIF" />
                    <TextInput
                        id="nif"
                        className="mt-1 block w-full"
                        value={data.nif}
                        onChange={(e) => setData('nif', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.nif} />
                </div>

                <div>
                    <InputLabel htmlFor="logo_url" value="URL do Logótipo" />
                    <TextInput
                        id="logo_url"
                        className="mt-1 block w-full"
                        value={data.logo_url}
                        onChange={(e) => setData('logo_url', e.target.value)}
                        placeholder="/images/Papelock_logo.png"
                    />
                    <InputError className="mt-2" message={errors.logo_url} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Guardar</PrimaryButton>

                    {recentlySuccessful && (
                        <p className="text-sm text-gray-600">Guardado.</p>
                    )}
                </div>
            </form>
        </section>
    );
}
