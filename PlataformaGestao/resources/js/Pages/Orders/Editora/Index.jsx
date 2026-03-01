import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

import StatsCards from "@/Components/Orders/Editora/StatsCards";
import OrdersFilters from "@/Components/Orders/Editora/OrdersFilters";
import ToOrderList from "@/Components/Orders/Editora/ToOrderList";
import OrdersHistoryTable from "@/Components/Orders/Editora/OrdersHistoryTable";
import Pagination from "@/Components/Pagination";

import NewOrderModal from "@/Components/Orders/Editora/NewOrderModal";
import ViewOrderModal from "@/Components/Orders/Editora/ViewOrderModal";
import ReceiveOrderModal from "@/Components/Orders/Editora/ReceiveOrderModal";

export default function Index({ auth, stats, toOrderGrouped, orders, initialStatus = "ALL", initialSearch = "" }) {
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [receiveOrder, setReceiveOrder] = useState(null);

  const [newOrderPreset, setNewOrderPreset] = useState(null);

  // Debounce search → backend
  useEffect(() => {
    const t = setTimeout(() => {
      router.get(
        route("orders.editora.index"),
        { search: search || undefined, status: statusFilter !== "ALL" ? statusFilter : undefined },
        { preserveState: true, replace: true, preserveScroll: true }
      );
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  // Status change → backend (imediato)
  const handleStatusChange = (val) => {
    setStatusFilter(val);
    router.get(
      route("orders.editora.index"),
      { search: search || undefined, status: val !== "ALL" ? val : undefined },
      { preserveState: true, replace: true, preserveScroll: true }
    );
  };

  const orderRows = orders?.data || [];

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Encomendas à Editora" />

      <div className="-m-8 min-h-screen bg-gray-50/80 font-sans flex flex-col">
       <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 py-8 space-y-6">

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Encomendas à Editora
            </h1>
            <p className="text-sm text-gray-500/80 font-medium">
              Gerir encomendas de livros às editoras
            </p>
          </div>
          <a
            href="/encomendas/editora/export"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white/60 hover:bg-white text-gray-800 font-bold text-sm transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Exportar Excel
          </a>
        </div>

        <StatsCards stats={stats} />

        <OrdersFilters
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={handleStatusChange}
        />

        <ToOrderList
          groups={toOrderGrouped}

          onNewOrder={() => {
            setNewOrderPreset(null);
            setIsNewOpen(true);
          }}

          onCreateForPublisher={(group) => {
            setNewOrderPreset({
              publisherId: group.publisher?.id,
              publisherName: group.publisher?.name,
              items: group.items || [],
            });
            setIsNewOpen(true);
          }}
        />

        <div>
          <OrdersHistoryTable
            orders={orderRows}
            onView={(o) => setViewOrder(o)}
            onReceive={(o) => setReceiveOrder(o)}
          />
          <Pagination
            items={orders}
            params={{
              search: search || undefined,
              status: statusFilter !== "ALL" ? statusFilter : undefined,
            }}
          />
        </div>

       </div>
      </div>

      <NewOrderModal
        open={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        preset={newOrderPreset}
      />
      <ViewOrderModal order={viewOrder} onClose={() => setViewOrder(null)} />
      <ReceiveOrderModal
        order={receiveOrder}
        onClose={() => setReceiveOrder(null)}
      />
    </AuthenticatedLayout>
  );
}
