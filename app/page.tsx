"use client";

import { Button } from "@/components/ui/button";
import { CashManagement } from "@/components/CashManagement";
import { LoginForm } from "@/components/LoginForm";
import Link from "next/link";
import { Store, ShoppingBag, Settings, BarChart, LogOut } from "lucide-react";
import { useProductStore } from "@/lib/store";
import { useEffect } from "react";

export default function Home() {
  const { currentUser, logout, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Bienvenido, {currentUser.username}
          </h1>
          <Button variant="outline" onClick={logout} className="w-full sm:w-auto">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        <div className="space-y-8">
          {currentUser.role === 'admin' && <CashManagement />}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Link href="/sell" className="w-full">
              <Button 
                className="w-full h-24 sm:h-32 text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0" 
                variant="outline"
              >
                <Store className="mr-2 h-6 w-6" />
                Vender Productos
              </Button>
            </Link>
            
            <Link href="/buy" className="w-full">
              <Button 
                className="w-full h-24 sm:h-32 text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0" 
                variant="outline"
              >
                <ShoppingBag className="mr-2 h-6 w-6" />
                Comprar Productos
              </Button>
            </Link>
            
            {currentUser.role === 'admin' && (
              <>
                <Link href="/admin" className="w-full">
                  <Button 
                    className="w-full h-24 sm:h-32 text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0" 
                    variant="outline"
                  >
                    <Settings className="mr-2 h-6 w-6" />
                    Gestión de Productos
                  </Button>
                </Link>
                
                <Link href="/reports" className="w-full">
                  <Button 
                    className="w-full h-24 sm:h-32 text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0" 
                    variant="outline"
                  >
                    <BarChart className="mr-2 h-6 w-6" />
                    Reportes y Estadísticas
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}