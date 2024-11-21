"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction, CashMovement } from "@/lib/types";
import { User } from "@/lib/types";
import { formatCLP } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { DataTablePagination } from "./DataTablePagination";

interface ReportTablesProps {
  transactions: Transaction[];
  cashMovements: CashMovement[];
  users: User[];
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function ReportTables({
  transactions,
  cashMovements,
  users,
  currentPage,
  pageSize,
  onPageChange
}: ReportTablesProps) {
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTransactions = transactions.slice(startIndex, startIndex + pageSize);
  const paginatedCashMovements = cashMovements.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Transacciones</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Método de Pago</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction) => {
              const user = users.find(u => u.id === transaction.userId);
              return (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(new Date(transaction.date), "dd/MM/yyyy HH:mm", { locale: es })}
                  </TableCell>
                  <TableCell>{user?.username || "Usuario desconocido"}</TableCell>
                  <TableCell>
                    {transaction.type === "sell" ? "Venta" : "Compra"}
                  </TableCell>
                  <TableCell>{formatCLP(transaction.total)}</TableCell>
                  <TableCell className="capitalize">
                    {transaction.payment?.method || "No especificado"}
                    {transaction.payment?.change && transaction.payment.change > 0 && (
                      <span className="block text-sm text-muted-foreground">
                        Cambio: {formatCLP(transaction.payment.change)}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <DataTablePagination
          currentPage={currentPage}
          totalItems={transactions.length}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Movimientos de Caja</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCashMovements.map((movement) => {
              const user = users.find(u => u.id === movement.userId);
              return (
                <TableRow key={movement.id}>
                  <TableCell>
                    {format(new Date(movement.date), "dd/MM/yyyy HH:mm", { locale: es })}
                  </TableCell>
                  <TableCell>{user?.username || "Usuario desconocido"}</TableCell>
                  <TableCell>
                    {movement.type === "ingreso" ? "Ingreso" :
                     movement.type === "egreso" ? "Egreso" :
                     movement.type === "apertura" ? "Apertura" : "Cierre"}
                  </TableCell>
                  <TableCell>{movement.description}</TableCell>
                  <TableCell>{formatCLP(movement.amount)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <DataTablePagination
          currentPage={currentPage}
          totalItems={cashMovements.length}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </Card>
    </div>
  );
}