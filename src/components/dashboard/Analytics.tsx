'use client';

import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#eab308', '#6366f1'];

export function Analytics() {
    const { transactions } = useStore();
    const [view, setView] = useState<'chart' | 'calendar'>('chart');

    // Prepare Chart Data
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryData = expenses.reduce((acc, curr) => {
        if (!acc[curr.category]) acc[curr.category] = 0;
        acc[curr.category] += curr.amount;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(categoryData).map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
    }));

    // Prepare Calendar Data (Simple heatmap)
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const dailySpend = expenses.reduce((acc, curr) => {
        const day = new Date(curr.date).getDate();
        if (!acc[day]) acc[day] = 0;
        acc[day] += curr.amount;
        return acc;
    }, {} as Record<number, number>);

    return (
        <div className="mt-8 bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Analytics</h3>
                <div className="flex bg-white/5 rounded-lg p-1">
                    <button
                        onClick={() => setView('chart')}
                        className={cn("px-3 py-1 text-xs rounded-md transition-all", view === 'chart' ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300")}
                    >
                        Chart
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={cn("px-3 py-1 text-xs rounded-md transition-all", view === 'calendar' ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300")}
                    >
                        Calendar
                    </button>
                </div>
            </div>

            {view === 'chart' ? (
                <div className="h-[250px] w-full relative">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value: number | undefined) => [`$${(value || 0).toFixed(2)}`, '']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                            No expenses to display
                        </div>
                    )}

                    {/* Legend */}
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                        {chartData.map((entry) => (
                            <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-7 gap-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={i} className="text-center text-xs text-gray-600 font-bold mb-2">{d}</div>
                    ))}
                    {calendarDays.map((day) => {
                        const amount = dailySpend[day] || 0;
                        let bg = "bg-white/5";
                        if (amount > 0) bg = "bg-emerald-500/20";
                        if (amount > 50) bg = "bg-emerald-500/40";
                        if (amount > 100) bg = "bg-emerald-500/60";

                        return (
                            <div key={day} className={cn("aspect-square rounded-lg flex items-center justify-center text-xs text-white relative group", bg)}>
                                {day}
                                {amount > 0 && (
                                    <div className="absolute -top-6 bg-slate-800 text-xs px-2 py-1 rounded hidden group-hover:block z-20 whitespace-nowrap border border-white/10">
                                        ${amount}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
