'use client';

import { KeypadEntry } from '@/components/input/KeypadEntry';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function IncomePage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
            {/* Background Gradients (Green-ish for income) */}
            <div className="fixed top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container max-w-lg mx-auto px-4 py-8 relative z-10 flex flex-col min-h-screen">

                <header className="mb-8 flex items-center">
                    <Link href="/" className="p-2 rounded-full hover:bg-white/10 transition-colors mr-4">
                        <ArrowLeft className="w-6 h-6 text-gray-400" />
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Add Income
                    </h1>
                </header>

                <section className="flex-1 flex flex-col justify-center pb-8">
                    <KeypadEntry type="income" />
                </section>

            </div>
        </main>
    );
}
