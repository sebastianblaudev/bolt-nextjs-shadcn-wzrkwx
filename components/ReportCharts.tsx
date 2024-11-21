"use client";

import { Card } from "@/components/ui/card";
import { Bar, Pie } from "react-chartjs-2";
import { Transaction, CashMovement } from "@/lib/types";
import { formatCLP } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Scale,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface ReportChartsProps {
  transactions: Transaction[];
  cashMovements: CashMovement[];
  dateRange: { from: Date; to: Date };
}

export function ReportCharts({
  transactions,
  cashMovements,
  dateRange
}: ReportChartsProps) {
  const filteredTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= dateRange.from && date <= dateRange.to;
  });

  const salesByDate = filteredTransactions.reduce((acc, t) => {
    const date = format(new Date(t.date), "dd/MM/yyyy", { locale: es });
    if (!acc[date]) {
      acc[date] = { sells: 0, buys: 0 };
    }
    if (t.type === "sell") {
      acc[date].sells += Math.round(t.total);
    } else {
      acc[date].buys += Math.round(t.total);
    }
    return acc;
  }, {} as Record<string, { sells: number; buys: number }>);

  const dates = Object.keys(salesByDate).sort();

  const salesData = {
    labels: dates,
    datasets: [
      {
        label: "Ventas",
        data: dates.map(date => salesByDate[date].sells),
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1
      },
      {
        label: "Compras",
        data: dates.map(date => salesByDate[date].buys),
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 1
      }
    ]
  };

  const paymentMethodsData = {
    labels: ["Efectivo", "Tarjeta", "Transferencia"],
    datasets: [{
      data: [
        filteredTransactions.filter(t => t.payment?.method === "efectivo").length,
        filteredTransactions.filter(t => t.payment?.method === "tarjeta").length,
        filteredTransactions.filter(t => t.payment?.method === "transferencia").length
      ],
      backgroundColor: [
        "rgba(34, 197, 94, 0.5)",
        "rgba(59, 130, 246, 0.5)",
        "rgba(168, 85, 247, 0.5)"
      ],
      borderColor: [
        "rgb(34, 197, 94)",
        "rgb(59, 130, 246)",
        "rgb(168, 85, 247)"
      ],
      borderWidth: 1
    }]
  };

  const filteredCashMovements = cashMovements.filter(m => {
    const date = new Date(m.date);
    return date >= dateRange.from && date <= dateRange.to;
  });

  const cashByDate = filteredCashMovements.reduce((acc, m) => {
    const date = format(new Date(m.date), "dd/MM/yyyy", { locale: es });
    if (!acc[date]) {
      acc[date] = { income: 0, outcome: 0 };
    }
    if (m.type === "ingreso" || m.type === "apertura") {
      acc[date].income += Math.round(m.amount);
    } else {
      acc[date].outcome += Math.round(m.amount);
    }
    return acc;
  }, {} as Record<string, { income: number; outcome: number }>);

  const cashDates = Object.keys(cashByDate).sort();

  const cashData = {
    labels: cashDates,
    datasets: [
      {
        label: "Ingresos",
        data: cashDates.map(date => cashByDate[date].income),
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1
      },
      {
        label: "Egresos",
        data: cashDates.map(date => cashByDate[date].outcome),
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        ticks: {
          callback: function(this: Scale, tickValue: number | string) {
            return formatCLP(Number(tickValue));
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const
      }
    }
  };

  return (
    <div className="grid gap-6 mb-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Ventas vs Compras</h2>
        <div className="h-[400px]">
          <Bar data={salesData} options={chartOptions} />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Métodos de Pago</h2>
          <div className="h-[300px]">
            <Pie data={paymentMethodsData} options={pieOptions} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Movimientos de Caja</h2>
          <div className="h-[300px]">
            <Bar data={cashData} options={chartOptions} />
          </div>
        </Card>
      </div>
    </div>
  );
}
