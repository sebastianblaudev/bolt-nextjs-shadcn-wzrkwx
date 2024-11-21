export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          buy_price: number
          sell_price: number
          stock: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          buy_price: number
          sell_price: number
          stock: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          buy_price?: number
          sell_price?: number
          stock?: number
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          type: 'buy' | 'sell'
          product_id: string
          quantity: number
          price: number
          total: number
          date: string
          user_id: string
          payment_method: 'efectivo' | 'tarjeta' | 'transferencia'
          payment_amount: number
          payment_change: number
        }
        Insert: {
          id?: string
          type: 'buy' | 'sell'
          product_id: string
          quantity: number
          price: number
          total: number
          date?: string
          user_id: string
          payment_method?: 'efectivo' | 'tarjeta' | 'transferencia'
          payment_amount?: number
          payment_change?: number
        }
        Update: {
          id?: string
          type?: 'buy' | 'sell'
          product_id?: string
          quantity?: number
          price?: number
          total?: number
          date?: string
          user_id?: string
          payment_method?: 'efectivo' | 'tarjeta' | 'transferencia'
          payment_amount?: number
          payment_change?: number
        }
      }
      cash_movements: {
        Row: {
          id: string
          type: 'ingreso' | 'egreso' | 'apertura' | 'cierre'
          amount: number
          description: string
          date: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          type: 'ingreso' | 'egreso' | 'apertura' | 'cierre'
          amount: number
          description: string
          date?: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'ingreso' | 'egreso' | 'apertura' | 'cierre'
          amount?: number
          description?: string
          date?: string
          user_id?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          username: string
          password: string
          role: 'admin' | 'seller'
          created_at: string
        }
        Insert: {
          id: string
          username: string
          password: string
          role: 'admin' | 'seller'
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          password?: string
          role?: 'admin' | 'seller'
          created_at?: string
        }
      }
    }
  }
}