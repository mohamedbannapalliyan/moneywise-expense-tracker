'use client';

import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle } from 'lucide-react';

export function AIForecast() {
    const { transactions, budget } = useStore();

    const today = new Date();
    const dayOfMonth = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    const totalSpent = transactions
        .filter(t => {
            const tDate = new Date(t.date);
            return t.type === 'expense' &&
                tDate.getMonth() === today.getMonth() &&
                tDate.getFullYear() === today.getFullYear();
        })
        .reduce((acc, t) => acc + t.amount, 0);

    // Predictive Logic
    const averageDailySpend = totalSpent / Math.max(dayOfMonth, 1);
    const projectedSpend = averageDailySpend * daysInMonth;
    const isOverBudget = projectedSpend > budget;

    const message = isOverBudget
        ? `At this rate, you'll exceed your budget by ~$${(projectedSpend - budget).toFixed(0)} by month's end.`
        : `You're on track! Predicted savings: ~$${(budget - projectedSpend).toFixed(0)}.`;

    if (transactions.length < 3) return null; // Need data to predict

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 backdrop-blur-md flex items-start gap-3"
        >
            <div className="p-2 bg-indigo-500/20 rounded-full">
                <Sparkles className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
                <h4 className="text-sm font-semibold text-indigo-200">AI Insight</h4>
                <p className="text-xs text-indigo-100/80 mt-1 leading-relaxed">
                    {message}
                </p>
            </div>
        </motion.div>
    );
}
