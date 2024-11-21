"use client";

import { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductStore } from '@/lib/store';

export function BranchSelector() {
  const { currentUser, branches, currentBranch, setBranch } = useProductStore();

  useEffect(() => {
    if (currentUser && !currentBranch) {
      if (currentUser.role === 'admin') {
        setBranch(branches[0].id);
      } else if (currentUser.branchId) {
        setBranch(currentUser.branchId);
      }
    }
  }, [currentUser, currentBranch, branches, setBranch]);

  if (!currentUser || currentUser.role !== 'admin') return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Sucursal:</span>
      <Select
        value={currentBranch?.id || ''}
        onValueChange={setBranch}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Seleccionar sucursal" />
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}