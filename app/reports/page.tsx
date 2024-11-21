"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ReportFilters } from "@/components/ReportFilters";
import { ReportCharts } from "@/components/ReportCharts";
import { ReportTables } from "@/components/ReportTables";
import { useProductStore } from "@/lib/store";
import { subDays } from "date-fns";

const ITEMS_PER_PAGE = 10;

export default function Reports() {
  const { 
    transactions, 
    cashMovements, 
    users, 
    currentUser,
    fetchTransactions,
    fetchCashMovements,
    fetchUsers
  } = useProductStore();

  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchTransactions(),
        fetchCashMovements(),
        fetchUsers()
      ]);
    };
    fetchData();
  }, [fetchTransactions, fetchCashMovements, fetchUsers]);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
          <p className="mb-4">No tiene permisos para ver esta página.</p>
          <Link href="/">
            <Button>Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    // TODO: Implementar exportación de reportes
    console.log("Exportar reportes");
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reportes y Estadísticas</h1>
        <Link href="/">
          <Button variant="outline">Volver al Inicio</Button>
        </Link>
      </div>

      <ReportFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onExport={handleExport}
      />

      <ReportCharts
        transactions={transactions}
        cashMovements={cashMovements}
        dateRange={dateRange}
      />

      <ReportTables
        transactions={transactions}
        cashMovements={cashMovements}
        users={users}
        currentPage={currentPage}
        pageSize={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}