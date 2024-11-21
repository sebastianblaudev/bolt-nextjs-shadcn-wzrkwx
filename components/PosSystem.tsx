"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShoppingCart, Package, DollarSign, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
}

interface CartItem extends Product {
  total: number;
}

export default function PosSystem() {
  const [activeTab, setActiveTab] = useState('sell');
  const [productName, setProductName] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!productName || !buyPrice || !sellPrice || !quantity) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const newItem: CartItem = {
      id: Date.now().toString(),
      name: productName,
      buyPrice: parseFloat(buyPrice),
      sellPrice: parseFloat(sellPrice),
      quantity: parseInt(quantity),
      total: parseFloat(activeTab === 'sell' ? sellPrice : buyPrice) * parseInt(quantity)
    };

    setCart([...cart, newItem]);
    resetForm();
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const resetForm = () => {
    setProductName('');
    setBuyPrice('');
    setSellPrice('');
    setQuantity('1');
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: `${activeTab === 'sell' ? 'Sale' : 'Purchase'} completed successfully!`,
    });
    setCart([]);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card className="p-6">
        <Tabs defaultValue="sell" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sell" className="text-lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Sell Products
            </TabsTrigger>
            <TabsTrigger value="buy" className="text-lg">
              <Package className="mr-2 h-5 w-5" />
              Buy Products
            </TabsTrigger>
          </TabsList>

          <div className="grid gap-4 md:grid-cols-5">
            <Input
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="md:col-span-2"
            />
            <Input
              type="number"
              placeholder="Buy Price"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Sell Price"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <Button onClick={handleAddToCart} className="w-full">
            Add to Cart
          </Button>

          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Buy Price</TableHead>
                  <TableHead>Sell Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>${item.buyPrice.toFixed(2)}</TableCell>
                    <TableCell>${item.sellPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
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
              Total: ${calculateTotal()}
            </div>
            <Button onClick={handleCheckout} size="lg" className="px-8">
              <DollarSign className="mr-2 h-5 w-5" />
              {activeTab === 'sell' ? 'Complete Sale' : 'Complete Purchase'}
            </Button>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}