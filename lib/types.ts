export interface Product {
  id: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
}

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  total: number;
}

export interface Branch {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'seller';
  branchId?: string;
}

export interface CashRegister {
  isOpen: boolean;
  balance: number;
}

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia';

export interface Payment {
  method: PaymentMethod;
  amount: number;
  change: number;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  productId: string;
  quantity: number;
  price: number;
  total: number;
  payment: Payment;
  date: string;
  userId: string;
}

export interface CashMovement {
  id: string;
  type: 'ingreso' | 'egreso' | 'apertura' | 'cierre';
  amount: number;
  description: string;
  date: string;
  userId: string;
}

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    username: 'Admin',
    password: 'Admin123*',
    role: 'admin'
  },
  {
    id: '2',
    username: 'Vendedor1',
    password: 'Vendedor123',
    role: 'seller',
    branchId: '1'
  },
  {
    id: '3',
    username: 'Vendedor2',
    password: 'Vendedor2123',
    role: 'seller',
    branchId: '2'
  }
];