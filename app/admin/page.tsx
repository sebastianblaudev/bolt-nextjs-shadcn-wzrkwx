"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProductStore } from "@/lib/store";
import { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { generateUniqueId, formatCLP, parseCLPInput } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, fetchProducts } = useProductStore();
  const [name, setName] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSubmit = async () => {
    if (!name || !buyPrice || !sellPrice || !stock) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      });
      return;
    }

    try {
      const product: Product = {
        id: editingProduct?.id || generateUniqueId(),
        name,
        buyPrice: parseCLPInput(buyPrice),
        sellPrice: parseCLPInput(sellPrice),
        stock: parseInt(stock),
      };

      if (editingProduct) {
        await updateProduct(product);
        toast({
          title: "Éxito",
          description: "Producto actualizado exitosamente",
        });
      } else {
        await addProduct(product);
        toast({
          title: "Éxito",
          description: "Producto agregado exitosamente",
        });
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el producto",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setBuyPrice(product.buyPrice.toString());
    setSellPrice(product.sellPrice.toString());
    setStock(product.stock.toString());
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      toast({
        title: "Éxito",
        description: "Producto eliminado exitosamente",
      });
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setName("");
    setBuyPrice("");
    setSellPrice("");
    setStock("");
    setEditingProduct(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
        <div className="flex gap-4">
          <Link href="/admin/users">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Gestionar Usuarios
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Volver al Inicio</Button>
          </Link>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <div className="grid gap-4 md:grid-cols-5">
          <Input
            placeholder="Nombre del Producto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="md:col-span-2"
          />
          <Input
            type="text"
            placeholder="Precio de Compra"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            onBlur={(e) => setBuyPrice(parseCLPInput(e.target.value).toString())}
          />
          <Input
            type="text"
            placeholder="Precio de Venta"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            onBlur={(e) => setSellPrice(parseCLPInput(e.target.value).toString())}
          />
          <Input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <Button onClick={handleSubmit} className="w-full mt-4">
          <Plus className="mr-2 h-4 w-4" />
          {editingProduct ? "Actualizar Producto" : "Agregar Producto"}
        </Button>
      </Card>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Precio de Compra</TableHead>
              <TableHead>Precio de Venta</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatCLP(product.buyPrice)}</TableCell>
                <TableCell>{formatCLP(product.sellPrice)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setProductToDelete(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el producto y todas sus transacciones asociadas.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}