"use client";

import { useState } from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/lib/types';
import { formatCLP } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface ThermalReceiptProps {
  items: CartItem[];
  total: number;
  showPrintDialog: boolean;
  onClosePrintDialog: () => void;
}

export function ThermalReceipt({ items, total, showPrintDialog, onClosePrintDialog }: ThermalReceiptProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const { toast } = useToast();

  const handlePrint = async () => {
    if (isPrinting) return;

    try {
      setIsPrinting(true);
      
      const receiptContent = `
        <html>
          <head>
            <title>Recibo de Venta</title>
            <style>
              body {
                font-family: monospace;
                padding: 20px;
                width: 80mm;
                margin: 0 auto;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font-size: 12px;
              }
              .total {
                margin-top: 20px;
                font-weight: bold;
                text-align: right;
                border-top: 1px solid #000;
                padding-top: 10px;
              }
              @media print {
                body { 
                  width: 80mm;
                  margin: 0;
                }
                @page {
                  size: 80mm auto;
                  margin: 0;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Recibo de Venta</h2>
              <p>${new Date().toLocaleString('es-CL')}</p>
            </div>
            ${items.map(item => `
              <div class="item">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatCLP(item.total)}</span>
              </div>
            `).join('')}
            <div class="total">
              Total: ${formatCLP(total)}
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(receiptContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }

      toast({
        title: "Éxito",
        description: "Recibo enviado a imprimir",
      });
    } catch (error) {
      console.error('Error al imprimir recibo:', error);
      toast({
        title: "Error",
        description: "No se pudo imprimir el recibo",
        variant: "destructive",
      });
    } finally {
      setIsPrinting(false);
      onClosePrintDialog();
    }
  };

  return (
    <Dialog open={showPrintDialog} onOpenChange={onClosePrintDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Desea imprimir el recibo?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClosePrintDialog}>
            No
          </Button>
          <Button onClick={handlePrint} disabled={isPrinting}>
            <Printer className="mr-2 h-4 w-4" />
            {isPrinting ? 'Imprimiendo...' : 'Sí, imprimir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}