import { create } from 'zustand';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  type: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: Category | null;
  categoryId?: string | null;
  account?: string | null;
  note?: string | null;
  date: string;
  type: TransactionType;
}

interface AppState {
  transactions: Transaction[];
  budget: number;
  categories: Category[];
  accounts: string[];
  isLoading: boolean;
  error: string | null;

  fetchTransactions: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'category'>) => Promise<void>;
  editTransaction: (id: string, updates: Partial<Omit<Transaction, 'id' | 'category'>>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setBudget: (budget: number) => void;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  addAccount: (account: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  transactions: [],
  budget: 2000,
  categories: [],
  accounts: ['Cash', 'Bank Account', 'Credit Card'],
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      set({ transactions: data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch transactions', isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      set({ categories: data });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  addTransaction: async (newTransaction) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });
      if (!response.ok) throw new Error('Failed to add transaction');
      const savedTransaction = await response.json();
      set((state) => ({
        transactions: [savedTransaction, ...state.transactions],
      }));
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  },

  editTransaction: async (id, updates) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update transaction');
      const updatedTransaction = await response.json();
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? updatedTransaction : t
        ),
      }));
    } catch (error) {
      console.error('Failed to edit transaction:', error);
    }
  },

  deleteTransaction: async (id) => {
    try {
      await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  },

  setBudget: (budget) => set({ budget }),

  addCategory: async (category) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (!response.ok) throw new Error('Failed to add category');
      const savedCategory = await response.json();
      set((state) => ({ categories: [...state.categories, savedCategory] }));
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  },

  addAccount: (account) => set((state) => ({ accounts: [...state.accounts, account] })),
}));
