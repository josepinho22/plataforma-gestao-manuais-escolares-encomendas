import React, { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import StatsCards from "@/Components/Orders/Editora/StatsCards";
import OrdersFilters from "@/Components/Orders/Editora/OrdersFilters";
import ToOrderList from "@/Components/Orders/Editora/ToOrderList";
import OrdersHistoryTable from "@/Components/Orders/Editora/OrdersHistoryTable";

import NewOrderModal from "@/Components/Orders/Editora/NewOrderModal";
import ViewOrderModal from "@/Components/Orders/Editora/ViewOrderModal";
import ReceiveOrderModal from "@/Components/Orders/Editora/ReceiveOrderModal";

export default function Index({ auth, stats, toOrderGrouped, orders }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [receiveOrder, setReceiveOrder] = useState(null);

  
  const [newOrderPreset, setNewOrderPreset] = useState(null);
  

  const filteredOrders = useMemo(() => {
    const s = search.trim().toLowerCase();

    return (orders || []).filter((o) => {
      const matchesSearch =
        !s ||
        (o.number || "").toLowerCase().includes(s) ||
        (o.publisher_name || "").toLowerCase().includes(s);

      const matchesStatus =
        statusFilter === "ALL" ? true : o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Encomendas à Editora" />

      <div className="space-y-8">
        
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-gray-900">
            Encomendas à Editora
          </h1>
          <p className="text-sm text-gray-500">
            Gerir encomendas de livros às editoras
          </p>
        </div>

        
        <StatsCards stats={stats} />

        
        <OrdersFilters
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
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

        
        <OrdersHistoryTable
          orders={filteredOrders}
          onView={(o) => setViewOrder(o)}
          onReceive={(o) => setReceiveOrder(o)}
        />
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