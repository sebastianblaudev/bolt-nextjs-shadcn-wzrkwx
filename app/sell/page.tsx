"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, DollarSign, Trash2, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProductStore } from "@/lib/store";
import { CartItem, Payment } from "@/lib/types";
import { PriceEditDialog } from "@/components/PriceEditDialog";
import { PaymentDialog } from "@/components/PaymentDialog";
import { QuantityEditDialog } from "@/components/QuantityEditDialog";
import { useToast } from "@/hooks/use-toast";
import { generateUniqueId } from "@/lib/utils";
import { ThermalReceipt } from "@/components/ThermalReceipt";
import { parseDecimalInput } from "@/lib/utils";

export default function Sell() {
  const { products, addTransaction, updateProduct, currentUser, cashRegister } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPriceEditOpen, setIsPriceEditOpen] = useState(false);
  const [isQuantityEditOpen, setIsQuantityEditOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const { toast } = useToast();

  if (!currentUser || !cashRegister.isOpen) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {!currentUser ? "Debe iniciar sesión" : "La caja debe estar abierta"}
          </h2>
          <Link href="/">
            <Button>Volver al Inicio</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleAddToCart = () => {
    const product = products.find((p) => p.id === selectedProduct);
    if (!product || !quantity || parseDecimalInput(quantity) <= 0) {
      toast({
        title: "Error",
        description: "Por favor seleccione un producto y cantidad válida",
        variant: "destructive",
      });
      return;
    }

    const parsedQuantity = parseDecimalInput(quantity);
    
    if (parsedQuantity > product.stock) {
      toast({
        title: "Error",
        description: "No hay suficiente stock disponible",
        variant: "destructive",
      });
      return;
    }

    const cartId = generateUniqueId();
    const newItem: CartItem = {
      ...product,
      cartId,
      quantity: parsedQuantity,
      total: product.sellPrice * parsedQuantity,
    };

    setCart([...cart, newItem]);
    setSelectedProduct("");
    setQuantity("1");
  };

  const removeFromCart = (cartId: string) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  const handleEditPrice = (item: CartItem) => {
    setEditingItem(item);
    setIsPriceEditOpen(true);
  };

  const handleEditQuantity = (item: CartItem) => {
    setEditingItem(item);
    setIsQuantityEditOpen(true);
  };

  const handlePriceConfirm = (newPrice: number) => {
    if (!editingItem) return;

    setCart(
      cart.map((item) =>
        item.cartId === editingItem.cartId
          ? {
              ...item,
              sellPrice: newPrice,
              total: newPrice * item.quantity,
            }
          : item
      )
    );
  };

  const handleQuantityConfirm = (newQuantity: number) => {
    if (!editingItem) return;
    const product = products.find(p => p.id === editingItem.id);
    
    if (product && newQuantity > product.stock) {
      toast({
        title: "Error",
        description: "No hay suficiente stock disponible",
        variant: "destructive",
      });
      return;
    }

    setCart(
      cart.map((item) =>
        item.cartId === editingItem.cartId
          ? {
              ...item,
              quantity: newQuantity,
              total: item.sellPrice * newQuantity,
            }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const handlePaymentConfirm = async (payment: Payment) => {
    try {
      for (const item of cart) {
        const product = products.find((p) => p.id === item.id);
        if (product) {
          await updateProduct({
            ...product,
            stock: product.stock - item.quantity,
          });

          await addTransaction({
            id: generateUniqueId(),
            type: "sell",
            productId: item.id,
            quantity: item.quantity,
            price: item.sellPrice,
            total: item.total,
            payment,
            date: new Date().toISOString(),
            userId: currentUser.id
          });
        }
      }

      toast({
        title: "Éxito",
        description: "Venta completada exitosamente",
      });
      
      setShowPrintDialog(true);
    } catch (error) {
      console.error('Error al procesar la venta:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la venta",
        variant: "destructive",
      });
    }
  };

  const handleClosePrintDialog = () => {
    setShowPrintDialog(false);
    setCart([]);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vender Productos</h1>
        <Link href="/">
          <Button variant="outline">Volver al Inicio</Button>
        </Link>
      </div>

      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar producto" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - ${product.sellPrice} (Stock: {product.stock})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Cantidad"
            value={quantity}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.,]/g, '');
              setQuantity(value);
            }}
          />
          <Button onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Agregar al Carrito
          </Button>
        </div>

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.cartId}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    ${item.sellPrice.toFixed(2)}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditPrice(item)}
                      className="h-6 w-6"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    {item.quantity}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditQuantity(item)}
                      className="h-6 w-6"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </TableCell>
                  <TableCell>${item.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.cartId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="text-2xl font-bold">
            Total: ${calculateTotal().toFixed(2)}
          </div>
          <Button 
            onClick={() => setIsPaymentOpen(true)} 
            size="lg" 
            className="px-8"
            disabled={cart.length === 0}
          >
            <DollarSign className="mr-2 h-5 w-5" />
            Procesar Pago
          </Button>
        </div>
      </Card>

      <PriceEditDialog
        isOpen={isPriceEditOpen}
        onClose={() => {
          setIsPriceEditOpen(false);
          setEditingItem(null);
        }}
        onConfirm={handlePriceConfirm}
        currentPrice={editingItem?.sellPrice || 0}
        type="sell"
      />

      <QuantityEditDialog
        isOpen={isQuantityEditOpen}
        onClose={() => {
          setIsQuantityEditOpen(false);
          setEditingItem(null);
        }}
        onConfirm={handleQuantityConfirm}
        currentQuantity={editingItem?.quantity || 0}
        maxQuantity={editingItem ? products.find(p => p.id === editingItem.id)?.stock : undefined}
      />

      <PaymentDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onConfirm={handlePaymentConfirm}
        total={calculateTotal()}
        type="sell"
      />

      <ThermalReceipt 
        items={cart} 
        total={calculateTotal()} 
        showPrintDialog={showPrintDialog}
        onClosePrintDialog={handleClosePrintDialog}
      />
    </div>
  );
}
