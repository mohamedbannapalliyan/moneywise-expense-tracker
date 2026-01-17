import { FinancialPulse } from '@/components/dashboard/FinancialPulse';
import { KeypadEntry } from '@/components/input/KeypadEntry';
import { AIForecast } from '@/components/widgets/AIForecast';
import { Analytics } from '@/components/dashboard/Analytics';

export default function Home() {
    return (
        <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden selection:bg-emerald-500/30">
            {/* Background Gradients */}
            <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container max-w-lg mx-auto px-4 py-8 relative z-10 flex flex-col min-h-screen">

                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Money<span className="font-light text-emerald-400">Wise</span>
                        </h1>
                    </div>

                    <div className="flex gap-2">
                        <a href="/income" className="px-3 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                            + Income
                        </a>
                        <a href="/history" className="px-3 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 hover:bg-indigo-500/20 transition-all">
                            History
                        </a>
                        <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700" />
                    </div>
                </header>

                <section className="mb-8">
                    <FinancialPulse />
                    <AIForecast />
                    <Analytics />
                </section>

                <section className="flex-1 flex flex-col justify-end pb-8">
                    <KeypadEntry />
                </section>

            </div>
        </main>
    );
}
