import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  description: string; // "What for?" or Title
  category: string;
  account: string; // 'Cash', 'Bank', 'Card', etc.
  note: string; // Extra details
  date: string; // ISO string
  type: TransactionType;
}

interface AppState {
  transactions: Transaction[];
  budget: number;
  categories: string[]; // List of available categories
  accounts: string[];   // List of available accounts

  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, updates: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  setBudget: (budget: number) => void;
  addCategory: (category: string) => void;
  addAccount: (account: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: [],
      budget: 2000,
      categories: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Households', 'Fuel', 'Education', 'General'],
      accounts: ['Cash', 'Bank Account', 'Credit Card'],

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            { ...transaction, id: crypto.randomUUID() },
            ...state.transactions,
          ],
        })),
      editTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      setBudget: (budget) => set({ budget }),
      addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
      addAccount: (account) => set((state) => ({ accounts: [...state.accounts, account] })),
    }),
    {
      name: 'money-wise-storage',
    }
  )
);
