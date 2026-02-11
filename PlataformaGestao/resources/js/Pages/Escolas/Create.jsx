import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { FaSchool, FaSave } from "react-icons/fa";


import ResultPopup from "@/Components/ResultPopup";

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-black text-gray-900 mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

export default function Create({ auth, concelhos = [] }) {
  const { flash } = usePage().props;

  const form = useForm({
    concelho_id: "",
    nome: "",
    codigo: "",
    isAtivo: true,
  });

  
  const [popup, setPopup] = React.useState({
    open: false,
    type: "success", 
    title: "",
    message: "",
  });

  
  React.useEffect(() => {
    if (flash?.success) {
      setPopup({
        open: true,
        type: "success",
        title: "Validado",
        message: flash.success,
      });
    } else if (flash?.error) {
      setPopup({
        open: true,
        type: "error",
        title: "Recusado",
        message: flash.error,
      });
    }
  }, [flash?.success, flash?.error]);

  const submit = (e) => {
    e.preventDefault();

    form.post(route("escolas.store"), {
      preserveScroll: true,
      onError: () => {
        
        setPopup({
          open: true,
          type: "error",
          title: "Recusado",
          message: "Verifica os campos assinalados a vermelho.",
        });
      },
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Inserção de Escolas" />

      <div className="space-y-6">
        
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FaSchool /> Inserção de Escolas
          </h1>
          <p className="text-sm text-gray-500">
            Adiciona uma nova escola ao sistema.
          </p>
        </div>

        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-900">Dados da Escola</h2>
            <p className="text-sm text-gray-500">
              Campos com * são obrigatórios.
            </p>
          </div>

          <form onSubmit={submit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <Field label="Nome" required error={form.errors.nome}>
                <input
                  value={form.data.nome}
                  onChange={(e) => form.setData("nome", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
                  placeholder="Ex: Escola Básica ..."
                />
              </Field>

              
              <Field label="Código" required error={form.errors.codigo}>
                <input
                  value={form.data.codigo}
                  onChange={(e) => form.setData("codigo", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
                  placeholder="Ex: EB-001"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <Field label="Concelho" required error={form.errors.concelho_id}>
                <select
                  value={form.data.concelho_id}
                  onChange={(e) => form.setData("concelho_id", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">(Sem concelho)</option>
                  {concelhos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </Field>

              
              <Field label="Estado" required error={form.errors.isAtivo}>
                <select
                  value={form.data.isAtivo ? "1" : "0"}
                  onChange={(e) =>
                    form.setData("isAtivo", e.target.value === "1")
                  }
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="1">Ativa</option>
                  <option value="0">Inativa</option>
                </select>
              </Field>
            </div>

            
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={form.processing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-black"
              >
                <FaSave />
                Guardar Escola
              </button>
            </div>
          </form>
        </div>
      </div>

      
      <ResultPopup
        open={popup.open}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />
    </AuthenticatedLayout>
  );
}