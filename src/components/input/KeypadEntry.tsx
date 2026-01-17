'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Calendar as CalendarIcon, Wallet, Tag, FileText, CheckCircle2, ChevronRight, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const KEYPAD_NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'DEL'];

import { Transaction } from '@/store/useStore';

interface KeypadEntryProps {
    type?: 'income' | 'expense';
    initialData?: Transaction;
    onClose?: () => void;
}

export function KeypadEntry({ type = 'expense', initialData, onClose }: KeypadEntryProps) {
    const { addTransaction, editTransaction, categories, accounts, addCategory, addAccount } = useStore();
    const [isCreating, setIsCreating] = useState<'account' | 'category' | null>(null);
    const [newItemValue, setNewItemValue] = useState('');

    // Theme derived from type (allow override from initialData)
    const effectiveType = initialData ? initialData.type : type;
    const isIncome = effectiveType === 'income';
    const primaryColor = isIncome ? 'text-emerald-400' : 'text-rose-400';
    const buttonGradient = isIncome ? 'from-emerald-500 to-teal-600' : 'from-rose-500 to-pink-600';
    const borderColor = isIncome ? 'focus:border-emerald-500' : 'focus:border-rose-500';
    const ringColor = isIncome ? 'ring-emerald-500/50' : 'ring-rose-500/50';
    const catBgActive = isIncome ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500' : 'bg-rose-600/20 text-rose-300 border-rose-500';

    // Form State
    const [amount, setAmount] = useState(initialData ? initialData.amount.toString() : '');
    const [description, setDescription] = useState(initialData ? initialData.description : '');
    const [category, setCategory] = useState(initialData ? initialData.category : '');
    const [account, setAccount] = useState(initialData ? initialData.account : 'Cash');
    const [note, setNote] = useState(initialData ? initialData.note : '');
    const [date, setDate] = useState(initialData ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]);

    // Smart Categorization Logic
    const [isAutoCategory, setIsAutoCategory] = useState(!initialData); // Disable auto-cat if editing

    const suggestCategory = (text: string) => {
        const lower = text.toLowerCase();
        const map: Record<string, string[]> = {
            'Food': ['coffee', 'burger', 'lunch', 'dinner', 'starbuck', 'mcdonald', 'pizza', 'food', 'cafe', 'restaurant', 'meal', 'snack'],
            'Transport': ['uber', 'lyft', 'taxi', 'bus', 'train', 'metro', 'gas', 'fuel', 'petrol', 'parking'],
            'Utilities': ['rent', 'bill', 'electricity', 'water', 'internet', 'wifi', 'phone', 'mobile'],
            'Entertainment': ['movie', 'netflix', 'cinema', 'game', 'spotify', 'sub'],
            'Health': ['doctor', 'pharmacy', 'meds', 'gym', 'medicine', 'hospital'],
            'Households': ['grocery', 'groceries', 'soap', 'detergent', 'ikea'],
            'Education': ['book', 'course', 'class', 'tuition', 'school']
        };

        for (const [cat, keywords] of Object.entries(map)) {
            if (keywords.some(k => lower.includes(k))) {
                return cat;
            }
        }
        return '';
    };

    // Effect to update category based on note
    const handleNoteChange = (text: string) => {
        setNote(text);
        if (isAutoCategory) {
            const suggested = suggestCategory(text);
            if (suggested && categories.includes(suggested)) {
                setCategory(suggested);
            }
        }
    };

    // Manual category override
    const handleCategorySelect = (cat: string) => {
        setCategory(cat);
        setIsAutoCategory(false);
    };

    // UI State
    const [step, setStep] = useState<'amount' | 'details'>('amount');

    const handlePress = (key: string) => {
        if (key === 'DEL') {
            setAmount(prev => prev.slice(0, -1));
        } else {
            if (key === '.' && amount.includes('.')) return;
            if (amount.length > 8) return;
            setAmount(prev => prev + key);
        }
    };

    const handleNext = () => {
        if (!amount) return;
        setStep('details');
    };

    const handleSubmit = () => {
        if (!amount) return;

        const transactionData = {
            amount: parseFloat(amount),
            description: description || (isIncome ? 'Income' : 'Expense'),
            category: category || 'General',
            account,
            note,
            date: new Date(date).toISOString(),
            type: effectiveType
        };

        if (initialData) {
            editTransaction(initialData.id, transactionData);
            if (onClose) onClose();
        } else {
            addTransaction(transactionData);
            // Reset
            setAmount('');
            setDescription('');
            setCategory('');
            setAccount('Cash');
            setNote('');
            setDate(new Date().toISOString().split('T')[0]);
            setStep('amount');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-slate-900/50 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-6 shadow-2xl relative overflow-hidden">

            <AnimatePresence mode="wait">
                {step === 'amount' ? (
                    <motion.div
                        key="step-amount"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Amount Display */}
                        <div className="flex flex-col items-center justify-center py-4 relative">
                            {onClose && (
                                <button onClick={onClose} className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                            <span className="text-gray-400 text-sm mb-1 uppercase tracking-wider font-medium">
                                {initialData ? 'Edit Amount' : 'Enter Amount'}
                            </span>
                            <div className={cn("flex items-start", primaryColor)}>
                                <span className="text-3xl font-light mt-2">$</span>
                                <span className={cn("text-6xl font-bold tracking-tighter", !amount && "text-gray-700")}>
                                    {amount || '0'}
                                </span>
                            </div>
                        </div>

                        {/* Keypad */}
                        <div className="grid grid-cols-3 gap-3">
                            {KEYPAD_NUMBERS.map((key) => (
                                <button
                                    key={key}
                                    onClick={() => handlePress(key)}
                                    className={cn(
                                        "h-14 rounded-xl bg-white/5 hover:bg-white/10 text-xl font-semibold transition-all active:scale-95 flex items-center justify-center backdrop-blur-md border border-white/5",
                                        key === 'DEL' && "text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
                                    )}
                                >
                                    {key === 'DEL' ? <Delete className="w-6 h-6" /> : key}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={!amount}
                            className={cn(
                                "w-full h-14 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all bg-gradient-to-r",
                                buttonGradient
                            )}
                        >
                            Next <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step-details"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 50, opacity: 0 }}
                        className="flex flex-col gap-5 h-full"
                    >
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                            <div className={cn("text-2xl font-bold", primaryColor)}>${amount}</div>
                            <button onClick={() => setStep('amount')} className="p-2 rounded-full hover:bg-white/10">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">

                            {/* Account Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                    <Wallet className="w-3 h-3" /> Account
                                </label>
                                {isCreating === 'account' ? (
                                    <div className="flex gap-2">
                                        <input
                                            autoFocus
                                            type="text"
                                            value={newItemValue}
                                            onChange={(e) => setNewItemValue(e.target.value)}
                                            placeholder="New Account Name"
                                            className="flex-1 bg-white/5 border border-emerald-500/50 rounded-lg px-3 py-2 text-sm text-white outline-none"
                                        />
                                        <button
                                            onClick={() => {
                                                if (newItemValue) {
                                                    addAccount(newItemValue);
                                                    setAccount(newItemValue);
                                                }
                                                setIsCreating(null);
                                                setNewItemValue('');
                                            }}
                                            className="bg-emerald-500 text-white p-2 rounded-lg"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => setIsCreating(null)} className="p-2 text-gray-500">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none items-center">
                                        {accounts.map(acc => (
                                            <button
                                                key={acc}
                                                onClick={() => setAccount(acc)}
                                                className={cn(
                                                    "px-4 py-2 rounded-lg border text-sm whitespace-nowrap transition-all",
                                                    account === acc
                                                        ? cn(catBgActive, "ring-1", ringColor)
                                                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                                )}
                                            >
                                                {acc}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setIsCreating('account')}
                                            className="px-3 py-2 rounded-lg border border-dashed border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white transition-all whitespace-nowrap text-sm flex items-center gap-1"
                                        >
                                            <Plus className="w-4 h-4" /> New
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Category Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                    <Tag className="w-3 h-3" /> Category
                                </label>
                                {isCreating === 'category' ? (
                                    <div className="flex gap-2">
                                        <input
                                            autoFocus
                                            type="text"
                                            value={newItemValue}
                                            onChange={(e) => setNewItemValue(e.target.value)}
                                            placeholder="New Category Name"
                                            className="flex-1 bg-white/5 border border-emerald-500/50 rounded-lg px-3 py-2 text-sm text-white outline-none"
                                        />
                                        <button
                                            onClick={() => {
                                                if (newItemValue) {
                                                    addCategory(newItemValue);
                                                    handleCategorySelect(newItemValue);
                                                }
                                                setIsCreating(null);
                                                setNewItemValue('');
                                            }}
                                            className="bg-emerald-500 text-white p-2 rounded-lg"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => setIsCreating(null)} className="p-2 text-gray-500">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => handleCategorySelect(cat)}
                                                className={cn(
                                                    "px-2 py-2 rounded-lg border text-xs text-center transition-all truncate",
                                                    category === cat
                                                        ? cn(catBgActive, "ring-1", ringColor)
                                                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setIsCreating('category')}
                                            className="px-2 py-2 rounded-lg border border-dashed border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white transition-all truncate text-xs flex items-center justify-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" /> New
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Date */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                    <CalendarIcon className="w-3 h-3" /> Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className={cn("w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none [color-scheme:dark]", borderColor)}
                                />
                            </div>

                            {/* Note/Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                    <FileText className="w-3 h-3" /> Note
                                </label>
                                <input
                                    type="text"
                                    value={note}
                                    onChange={(e) => handleNoteChange(e.target.value)}
                                    placeholder="Add a note..."
                                    className={cn("w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none", borderColor)}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className={cn(
                                "w-full h-14 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 mt-auto bg-gradient-to-r",
                                buttonGradient
                            )}
                        >
                            <CheckCircle2 className="w-5 h-5" /> {initialData ? 'Update' : 'Save'} {isIncome ? 'Income' : 'Expense'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
