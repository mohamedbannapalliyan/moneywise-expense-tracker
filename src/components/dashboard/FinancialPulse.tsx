'use client';

import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
// import { Progress } from "@/components/ui/progress"
// Using standard accessible HTML for progress first to avoid dependency on uninstalled shadcn component
// Will replace with shadcn Progress once installed

export function FinancialPulse() {
    const { transactions, budget } = useStore();

    // Calculate total spent today
    const today = new Date().toISOString().split('T')[0];
    const spentToday = transactions
        .filter(t => t.date.startsWith(today) && t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const totalSpent = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl"
        >
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-sm font-medium text-gray-400">Total Spent</h2>
                    <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-orange-500">
                        ${totalSpent.toFixed(2)}
                    </div>
                </div>
                <div className="text-right">
                    <h3 className="text-xs text-emerald-400 font-semibold mb-1">Total Income</h3>
                    <span className="text-xl font-mono text-white">${totalIncome.toFixed(2)}</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                    <span className="text-gray-400">Today:</span> ${spentToday.toFixed(2)}
                </div>
                {/* Placeholder for future sparkline or small stat */}
            </div>
        </motion.div>
    );
}
