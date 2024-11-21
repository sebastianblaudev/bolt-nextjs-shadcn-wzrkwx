"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useProductStore } from '@/lib/store';
import { CashMovement } from '@/lib/types';
import { generateUniqueId, formatCLP } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function CashManagement() {
  const { 
    currentUser, 
    cashRegister,
    addCashMovement,
    openRegister,
    closeRegister
  } = useProductStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [movementType, setMovementType] = useState<'ingreso' | 'egreso'>('ingreso');
  const { toast } = useToast();

  if (!currentUser) return null;

  const handleOpenRegister = async () => {
    if (!amount || !description) {
      toast({
        title: "Error",
        description: "Por favor ingrese el monto inicial y la descripción",
        variant: "destructive",
      });
      return;
    }

    try {
      await openRegister(parseFloat(amount), description);
      setAmount('');
      setDescription('');
      toast({
        title: "Éxito",
        description: "Caja abierta exitosamente",
      });
    } catch (error) {
      console.error('Error al abrir caja:', error);
      toast({
        title: "Error",
        description: "No se pudo abrir la caja",
        variant: "destructive",
      });
    }
  };

  const handleCloseRegister = async () => {
    if (!description) {
      toast({
        title: "Error",
        description: "Por favor ingrese una descripción para el cierre",
        variant: "destructive",
      });
      return;
    }

    try {
      await closeRegister(description);
      setDescription('');
      toast({
        title: "Éxito",
        description: "Caja cerrada exitosamente",
      });
    } catch (error) {
      console.error('Error al cerrar caja:', error);
      toast({
        title: "Error",
        description: "No se pudo cerrar la caja",
        variant: "destructive",
      });
    }
  };

  const handleCashMovement = async () => {
    if (!amount || !description) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      });
      return;
    }

    try {
      const movement: CashMovement = {
        id: generateUniqueId(),
        type: movementType,
        amount: parseFloat(amount),
        description,
        date: new Date().toISOString(),
        userId: currentUser.id
      };

      await addCashMovement(movement);
      setAmount('');
      setDescription('');
      setIsDialogOpen(false);
      toast({
        title: "Éxito",
        description: `${movementType === 'ingreso' ? 'Ingreso' : 'Egreso'} registrado exitosamente`,
      });
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar el movimiento",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm shadow-lg">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Caja</h2>
          <div className="text-xl font-semibold text-gray-900 bg-gray-100 px-4 py-2 rounded-lg">
            Saldo actual: {formatCLP(cashRegister.balance)}
          </div>
        </div>

        {!cashRegister.isOpen ? (
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Monto inicial"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-11"
            />
            <Textarea
              placeholder="Descripción de la apertura"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
            <Button 
              onClick={handleOpenRegister} 
              className="w-full h-11 bg-green-600 hover:bg-green-700"
            >
              Abrir Caja
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea
              placeholder="Descripción del cierre"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setIsDialogOpen(true)} 
                variant="outline" 
                className="flex-1 h-11"
              >
                Registrar Movimiento
              </Button>
              <Button 
                onClick={handleCloseRegister} 
                variant="destructive"
                className="flex-1 h-11"
              >
                Cerrar Caja
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Movimiento de Caja</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <RadioGroup
              defaultValue="ingreso"
              onValueChange={(value) => setMovementType(value as 'ingreso' | 'egreso')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ingreso" id="ingreso" />
                <Label htmlFor="ingreso">Ingreso</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="egreso" id="egreso" />
                <Label htmlFor="egreso">Egreso</Label>
              </div>
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCashMovement}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}