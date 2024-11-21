"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseCLPInput } from "@/lib/utils";

interface PriceEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (price: number) => void;
  currentPrice: number;
  type: "buy" | "sell";
}

export function PriceEditDialog({
  isOpen,
  onClose,
  onConfirm,
  currentPrice,
  type,
}: PriceEditDialogProps) {
  const [price, setPrice] = useState(Math.round(currentPrice).toString());

  const handleConfirm = () => {
    onConfirm(parseCLPInput(price));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Editar Precio de {type === "buy" ? "Compra" : "Venta"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Precio
            </Label>
            <Input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onBlur={(e) => setPrice(parseCLPInput(e.target.value).toString())}
              className="col-span-3"
            />
          </div>
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