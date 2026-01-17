'use client';

import { useStore } from '@/store/useStore';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    const fetchTransactions = useStore((state) => state.fetchTransactions);
    const fetchCategories = useStore((state) => state.fetchCategories);

    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    }, [fetchTransactions, fetchCategories]);

    return <>{children}</>;
}
