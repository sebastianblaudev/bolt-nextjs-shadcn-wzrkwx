import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseDecimalInput = (value: string): number => {
  // Replace comma with dot for proper parsing
  const normalizedValue = value.replace(',', '.');
  const parsed = parseFloat(normalizedValue);
  return isNaN(parsed) ? 0 : parsed;
};

export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function parseCLPInput(value: string): number {
  return Math.round(parseInt(value.replace(/\D/g, '')) || 0);
}