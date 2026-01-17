import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const transactions = await db.transaction.findMany({
            orderBy: {
                date: 'desc',
            },
            include: {
                category: true,
            },
        });
        return NextResponse.json(transactions);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const transaction = await db.transaction.create({
            data: {
                amount: json.amount,
                description: json.description,
                date: new Date(json.date),
                type: json.type,
                category: json.categoryId ? { connect: { id: json.categoryId } } : undefined,
                account: json.account,
                note: json.note,
            },
        });
        return NextResponse.json(transaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
    }
}
