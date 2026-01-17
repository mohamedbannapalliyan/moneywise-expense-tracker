'use client';

import { TransactionHistory } from '@/components/dashboard/TransactionHistory';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white relative">
            <div className="container max-w-lg mx-auto px-4 py-8 relative z-10">

                <header className="mb-8 flex items-center">
                    <Link href="/" className="p-2 rounded-full hover:bg-white/10 transition-colors mr-4">
                        <ArrowLeft className="w-6 h-6 text-gray-400" />
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        History
                    </h1>
                </header>

                <TransactionHistory />

            </div>
        </main>
    );
}
