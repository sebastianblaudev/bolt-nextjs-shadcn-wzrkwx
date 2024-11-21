"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useProductStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useProductStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(username, password);
    if (success) {
      toast({
        title: "Éxito",
        description: "Inicio de sesión exitoso",
      });
    } else {
      toast({
        title: "Error",
        description: "Usuario o contraseña incorrectos",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 sm:p-8 shadow-xl bg-white/80 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sistema POS</h1>
          <p className="text-gray-500">Ingrese sus credenciales para continuar</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Usuario
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full h-11 text-base">
          Ingresar
        </Button>
      </form>
    </Card>
  );
}