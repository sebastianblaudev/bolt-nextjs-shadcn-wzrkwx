"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentMethod, Payment } from "@/lib/types";
import { formatCLP, parseCLPInput } from "@/lib/utils";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payment: Payment) => void;
  total: number;
  type: 'buy' | 'sell';
}

export function PaymentDialog({
  isOpen,
  onClose,
  onConfirm,
  total,
  type,
}: PaymentDialogProps) {
  const [method, setMethod] = useState<PaymentMethod>('efectivo');
  const [amount, setAmount] = useState(Math.round(total).toString());
  const [change, setChange] = useState(0);

  const handleMethodChange = (value: PaymentMethod) => {
    setMethod(value);
    setAmount(Math.round(total).toString());
    setChange(0);
  };

  const handleAmountChange = (value: string) => {
    const numValue = parseCLPInput(value);
    setAmount(value);
    
    if (method === 'efectivo' && type === 'sell') {
      const changeAmount = numValue - total;
      setChange(changeAmount >= 0 ? Math.round(changeAmount) : 0);
    }
  };

  const handleConfirm = () => {
    const payment: Payment = {
      method,
      amount: parseCLPInput(amount),
      change: method === 'efectivo' && type === 'sell' ? change : 0
    };

    onConfirm(payment);
    onClose();
  };

  const isValid = () => {
    const numAmount = parseCLPInput(amount);
    if (method === 'efectivo' && type === 'sell') {
      return numAmount >= total;
    }
    return numAmount === total;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'sell' ? 'Procesar Pago' : 'Registrar Pago'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Total a {type === 'sell' ? 'cobrar' : 'pagar'}</Label>
            <div className="text-2xl font-bold">{formatCLP(total)}</div>
          </div>

          <div className="grid gap-2">
            <Label>Método de pago</Label>
            <Select value={method} onValueChange={handleMethodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {method === 'efectivo' && type === 'sell' && (
            <>
              <div className="grid gap-2">
                <Label>Monto recibido</Label>
                <Input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  onBlur={(e) => setAmount(parseCLPInput(e.target.value).toString())}
                />
              </div>

              <div className="grid gap-2">
                <Label>Cambio a devolver</Label>
                <div className="text-xl font-semibold text-green-600">
                  {formatCLP(change)}
                </div>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid()}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
