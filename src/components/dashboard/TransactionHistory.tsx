'use client';

import { useStore, Transaction } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { KeypadEntry } from '@/components/input/KeypadEntry';

export function TransactionHistory() {
    const { transactions, deleteTransaction } = useStore();
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => filter === 'all' || t.type === filter)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, filter]);

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `moneywise_backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // Group by Date
    const grouped = filteredTransactions.reduce((acc, t) => {
        const date = t.date.split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(t);
        return acc;
    }, {} as Record<string, Transaction[]>);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        if (isToday) return 'Today';
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl w-fit">
                {['all', 'expense', 'income'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
                            filter === f
                                ? "bg-indigo-500 text-white shadow-lg"
                                : "text-gray-400 hover:text-gray-200"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <button
                onClick={handleExport}
                className="absolute top-0 right-0 text-xs text-indigo-400 hover:text-indigo-300 font-medium px-3 py-1.5 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/10 transition-colors"
            >
                Export Data
            </button>

            <div className="space-y-8">
                {Object.entries(grouped).map(([date, items]) => (
                    <div key={date}>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">
                            {formatDate(date)}
                        </h3>
                        <div className="space-y-3">
                            {items.map((t) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => setEditingTransaction(t)}
                                    className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-slate-800/40 transition-colors cursor-pointer active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center border",
                                            t.type === 'income'
                                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                        )}>
                                            {t.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white">{t.category}</div>
                                            <div className="text-xs text-gray-400 flex items-center gap-2">
                                                <span>{t.description}</span>
                                                {t.note && (
                                                    <span className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded text-gray-500">
                                                        <FileText className="w-3 h-3" /> {t.note}
                                                    </span>
                                                )}
                                                {t.account && (
                                                    <span className="flex items-center gap-1 text-gray-600">
                                                        • {t.account}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className={cn(
                                            "font-bold",
                                            t.type === 'income' ? "text-emerald-400" : "text-white"
                                        )}>
                                            {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Delete this transaction?')) deleteTransaction(t.id);
                                            }}
                                            className="text-xs text-rose-500/50 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredTransactions.length === 0 && (
                    <div className="text-center py-10 text-gray-500 text-sm">
                        No transactions found.
                    </div>
                )}
            </div>

            {/* Edit Modal / Overlay */}
            <AnimatePresence>
                {editingTransaction && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setEditingTransaction(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <KeypadEntry
                                type={editingTransaction.type}
                                initialData={editingTransaction}
                                onClose={() => setEditingTransaction(null)}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
