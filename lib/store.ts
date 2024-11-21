"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, User, INITIAL_USERS, CashRegister, Payment, Branch, Transaction, CashMovement } from './types';
import { supabase } from './supabase';

interface ProductStore {
  products: Product[];
  users: User[];
  transactions: Transaction[];
  cashMovements: CashMovement[];
  currentUser: User | null;
  cashRegister: CashRegister;
  branches: Branch[];
  currentBranch: Branch | null;
  setBranch: (branchId: string) => void;
  fetchProducts: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  addCashMovement: (movement: CashMovement) => Promise<void>;
  openRegister: (initialAmount: number, description: string) => Promise<void>;
  closeRegister: (description: string) => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchCashMovements: () => Promise<void>;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      users: INITIAL_USERS,
      transactions: [],
      cashMovements: [],
      currentUser: null,
      cashRegister: {
        isOpen: false,
        balance: 0
      },
      branches: [
        { id: '1', name: 'Sucursal 1' },
        { id: '2', name: 'Sucursal 2' }
      ],
      currentBranch: null,
      setBranch: (branchId: string) => {
        const branch = get().branches.find(b => b.id === branchId);
        if (branch) {
          set({ currentBranch: branch });
        }
      },
      fetchProducts: async () => {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');
        
        if (data) {
          const mappedProducts: Product[] = data.map(item => ({
            id: item.id,
            name: item.name,
            buyPrice: item.buy_price,
            sellPrice: item.sell_price,
            stock: item.stock
          }));
          set({ products: mappedProducts });
        }
        if (error) {
          console.error('Error fetching products:', error);
          throw error;
        }
      },

      fetchUsers: async () => {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('username');
        
        if (data) {
          const mappedUsers: User[] = data.map(item => ({
            id: item.id,
            username: item.username,
            password: item.password,
            role: item.role,
            branchId: item.branch_id
          }));
          set({ users: mappedUsers });
        }
        if (error) {
          console.error('Error fetching users:', error);
          throw error;
        }
      },

      addProduct: async (product) => {
        const { data, error } = await supabase
          .from('products')
          .insert([{
            name: product.name,
            buy_price: product.buyPrice,
            sell_price: product.sellPrice,
            stock: product.stock
          }])
          .select()
          .single();

        if (data && !error) {
          await get().fetchProducts();
        } else {
          console.error('Error adding product:', error);
          throw error;
        }
      },

      updateProduct: async (product) => {
        const { error } = await supabase
          .from('products')
          .update({
            name: product.name,
            buy_price: product.buyPrice,
            sell_price: product.sellPrice,
            stock: product.stock
          })
          .eq('id', product.id);

        if (!error) {
          await get().fetchProducts();
        } else {
          console.error('Error updating product:', error);
          throw error;
        }
      },

      deleteProduct: async (id) => {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (!error) {
          set(state => ({
            products: state.products.filter(p => p.id !== id)
          }));
        } else {
          console.error('Error deleting product:', error);
          throw error;
        }
      },

      addTransaction: async (transaction) => {
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert([{
            type: transaction.type,
            product_id: transaction.productId,
            quantity: transaction.quantity,
            price: transaction.price,
            total: transaction.total,
            date: transaction.date,
            user_id: transaction.userId,
            payment_method: transaction.payment.method,
            payment_amount: transaction.payment.amount,
            payment_change: transaction.payment.change || 0
          }]);

        if (!transactionError) {
          const movement: CashMovement = {
            id: Date.now().toString(),
            type: transaction.type === 'sell' ? 'ingreso' : 'egreso',
            amount: transaction.total,
            description: `${transaction.type === 'sell' ? 'Venta' : 'Compra'} de productos`,
            date: transaction.date,
            userId: transaction.userId
          };

          await get().addCashMovement(movement);
          
          set((state) => ({
            transactions: [...state.transactions, transaction]
          }));
          
          await get().fetchTransactions();
        } else {
          console.error('Error adding transaction:', transactionError);
          throw transactionError;
        }
      },

      addCashMovement: async (movement) => {
        const { error } = await supabase
          .from('cash_movements')
          .insert([{
            type: movement.type,
            amount: movement.amount,
            description: movement.description,
            date: movement.date,
            user_id: movement.userId
          }]);

        if (!error) {
          set((state) => {
            const newBalance = state.cashRegister.balance + (
              movement.type === 'ingreso' || movement.type === 'apertura'
                ? movement.amount
                : -movement.amount
            );

            return {
              cashMovements: [...state.cashMovements, movement],
              cashRegister: {
                ...state.cashRegister,
                balance: newBalance
              }
            };
          });
          await get().fetchCashMovements();
        } else {
          console.error('Error adding cash movement:', error);
          throw error;
        }
      },

      openRegister: async (initialAmount: number, description: string) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const movement = {
          id: Date.now().toString(),
          type: 'apertura' as const,
          amount: initialAmount,
          description,
          date: new Date().toISOString(),
          userId: currentUser.id
        };

        await get().addCashMovement(movement);
        set((state) => ({
          cashRegister: {
            ...state.cashRegister,
            isOpen: true
          }
        }));
      },

      closeRegister: async (description: string) => {
        const currentUser = get().currentUser;
        const { balance } = get().cashRegister;
        if (!currentUser) return;

        const movement = {
          id: Date.now().toString(),
          type: 'cierre' as const,
          amount: balance,
          description,
          date: new Date().toISOString(),
          userId: currentUser.id
        };

        await get().addCashMovement(movement);
        set({
          cashRegister: {
            isOpen: false,
            balance: 0
          }
        });
      },

      login: async (username, password) => {
        await get().fetchUsers();
        const user = get().users.find(
          (u) => u.username === username && u.password === password
        );
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },

      logout: () => set({ 
        currentUser: null,
        // Remove the cashRegister reset to maintain its state
      }),

      addUser: async (userData) => {
        const { data, error } = await supabase
          .from('users')
          .insert([{
            id: Date.now().toString(),
            ...userData
          }])
          .select()
          .single();

        if (data && !error) {
          await get().fetchUsers();
        } else {
          console.error('Error adding user:', error);
          throw error;
        }
      },

      updateUser: async (user) => {
        const { error } = await supabase
          .from('users')
          .update({
            username: user.username,
            password: user.password,
            role: user.role
          })
          .eq('id', user.id);

        if (!error) {
          await get().fetchUsers();
        } else {
          console.error('Error updating user:', error);
          throw error;
        }
      },

      deleteUser: async (id) => {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', id);

        if (!error) {
          await get().fetchUsers();
        } else {
          console.error('Error deleting user:', error);
          throw error;
        }
      },

      fetchTransactions: async () => {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });
        
        if (data && !error) {
          const mappedTransactions: Transaction[] = data.map(item => ({
            id: item.id,
            type: item.type,
            productId: item.product_id,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
            date: item.date,
            userId: item.user_id,
            payment: {
              method: item.payment_method,
              amount: item.payment_amount,
              change: item.payment_change
            }
          }));
          set({ transactions: mappedTransactions });
        } else {
          console.error('Error fetching transactions:', error);
          throw error;
        }
      },

      fetchCashMovements: async () => {
        const { data, error } = await supabase
          .from('cash_movements')
          .select('*')
          .order('date', { ascending: false });
        
        if (data && !error) {
          const mappedMovements: CashMovement[] = data.map(item => ({
            id: item.id,
            type: item.type,
            amount: item.amount,
            description: item.description,
            date: item.date,
            userId: item.user_id
          }));
          set({ cashMovements: mappedMovements });
        } else {
          console.error('Error fetching cash movements:', error);
          throw error;
        }
      }
    }),
    {
      name: 'product-store',
    }
  )
);
