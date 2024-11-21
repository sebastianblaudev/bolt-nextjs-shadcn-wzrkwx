"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseDecimalInput } from "@/lib/utils";

interface QuantityEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  currentQuantity: number;
  maxQuantity?: number;
}

export function QuantityEditDialog({
  isOpen,
  onClose,
  onConfirm,
  currentQuantity,
  maxQuantity,
}: QuantityEditDialogProps) {
  const [quantity, setQuantity] = useState(currentQuantity.toString());

  const handleConfirm = () => {
    const newQuantity = parseDecimalInput(quantity);
    
    if (maxQuantity !== undefined && newQuantity > maxQuantity) {
      return; // Don't allow quantities above max stock for sales
    }
    if (newQuantity > 0) {
      onConfirm(newQuantity);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cantidad</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Cantidad
            </Label>
            <Input
              id="quantity"
              type="text"
              value={quantity}
              onChange={(e) => {
                // Solo permitir números, punto y coma
                const value = e.target.value.replace(/[^0-9.,]/g, '');
                setQuantity(value);
              }}
              className="col-span-3"
            />
          </div>
          {maxQuantity !== undefined && (
            <p className="text-sm text-muted-foreground">
              Stock disponible: {maxQuantity}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}