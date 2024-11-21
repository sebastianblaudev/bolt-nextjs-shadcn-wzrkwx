"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProductStore } from "@/lib/store";
import { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { UserDialog } from "@/components/UserDialog";
import { Pencil, Trash2, UserPlus } from "lucide-react";

export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser, currentUser } = useProductStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (user?: User) => {
    setEditingUser(user || null);
    setIsDialogOpen(true);
  };

  const handleSaveUser = (userData: Omit<User, 'id'>) => {
    try {
      if (editingUser) {
        updateUser({ ...userData, id: editingUser.id });
        toast({
          title: "Éxito",
          description: "Usuario actualizado exitosamente",
        });
      } else {
        addUser(userData);
        toast({
          title: "Éxito",
          description: "Usuario creado exitosamente",
        });
      }
      setIsDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el usuario",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = (id: string) => {
    if (users.length <= 1) {
      toast({
        title: "Error",
        description: "Debe existir al menos un usuario administrador",
        variant: "destructive",
      });
      return;
    }

    const userToDelete = users.find(u => u.id === id);
    if (userToDelete?.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1) {
      toast({
        title: "Error",
        description: "Debe existir al menos un usuario administrador",
        variant: "destructive",
      });
      return;
    }

    if (id === currentUser?.id) {
      toast({
        title: "Error",
        description: "No puedes eliminar tu propio usuario",
        variant: "destructive",
      });
      return;
    }

    deleteUser(id);
    toast({
      title: "Éxito",
      description: "Usuario eliminado exitosamente",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <div className="flex gap-4">
          <Link href="/admin">
            <Button variant="outline">Volver a Administración</Button>
          </Link>
          <Button onClick={() => handleOpenDialog()}>
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  {user.role === 'admin' ? 'Administrador' : 'Vendedor'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.id === currentUser?.id}
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

      <UserDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        user={editingUser}
      />
    </div>
  );
}