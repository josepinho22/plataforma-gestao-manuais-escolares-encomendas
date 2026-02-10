import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
  FaBoxOpen,
  FaBook,
  FaHistory,
  FaPlus,
  FaFileAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTruck,
  FaClipboardList,
} from "react-icons/fa";
import SectionHeader from "@/Components/Dashboard/SectionHeader";
import StatCard from "@/Components/Dashboard/StatCard";
import QuickAction from "@/Components/Dashboard/QuickAction";
import QuickLink from "@/Components/Dashboard/QuickLink";
import FeatureCard from "@/Components/Dashboard/FeatureCard";

export default function Dashboard({ auth }) {
  const customerStats = [
    {
      label: "Pronto p/ levantar",
      value: "24",
      icon: <FaCheckCircle />,
      href: route("orders.clientes.index"),
      color: "text-green-700 ",
      btnColor: "bg-green-600 hover:bg-green-700",
    },
    {
      label: "Faltam Livros",
      value: "8",
      icon: <FaExclamationTriangle />,
      href: route("orders.clientes.index"),
      color: "text-red-700",
      btnColor: "bg-red-600 hover:bg-red-700",
    },
    {
      label: "Aguarda Encapamento",
      value: "12",
      icon: <FaBoxOpen />,
      href: route("orders.clientes.index"),
      color: "text-yellow-700",
      btnColor: "bg-yellow-600 hover:bg-yellow-700",
    },
  ];

  const publisherStats = [
    {
      label: "Para encomendar",
      value: "24",
      icon: <FaClipboardList />,
      href: route("orders.editora.index"),
      color: "text-orange-700",
      btnColor: "bg-orange-600 hover:bg-orange-700",
    },
    {
      label: "Já Encomendadas",
      value: "8",
      icon: <FaTruck />,
      href: route("orders.editora.index"),
      color: "text-blue-700",
      btnColor: "bg-blue-600 hover:bg-blue-700",
    },
  ];

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Dashboard" />

      <div className="space-y-8">
        {/* Barra de ações rápidas */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Olá, {auth.user.name} 👋
            </h2>
            <p className="text-sm text-gray-500">O que pretende fazer hoje?</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Nova encomenda cliente */}
            <QuickAction
              icon={<FaPlus />}
              label="Nova Encomenda Cliente"
              primary
              href={route("orders.create")}
            />

            {/* Mantém só relatórios */}
            <QuickLink icon={<FaFileAlt />} label="Relatórios Clientes" href="#" />
            <QuickLink icon={<FaFileAlt />} label="Relatórios Editoras" href="#" />
          </div>
        </div>

        {/* Secções */}
        <div className="space-y-8">
          {/* Encomendas Clientes */}
          <div className="space-y-4">
            <SectionHeader
              title="Encomendas Clientes"
              icon={<FaBoxOpen className="text-blue-600" />}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customerStats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>
          </div>

          {/* Encomendas Editora */}
          <div className="space-y-4">
            <SectionHeader
              title="Encomendas Editora"
              icon={<FaTruck className="text-purple-600" />}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {publisherStats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>
          </div>
        </div>

        {/* Gestão da Plataforma */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">
            Gestão da Plataforma
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Listas de Manuais"
              desc="Gerir manuais por escola e ano"
              icon={<FaBook />}
              color="bg-blue-600"
              href="#"
            />

            <FeatureCard
              title="Gestão de Encomendas"
              desc="Painel completo de encomendas"
              icon={<FaBoxOpen />}
              color="bg-green-600"
              href={route("orders.clientes.index")}
            />

            <FeatureCard
              title="Histórico Completo"
              desc="Consultar anos anteriores"
              icon={<FaHistory />}
              color="bg-purple-600"
              href="#"
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}