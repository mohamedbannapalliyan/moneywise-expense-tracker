import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const json = await request.json();
        const transaction = await db.transaction.update({
            where: {
                id: id,
            },
            data: {
                amount: json.amount,
                description: json.description,
                date: json.date ? new Date(json.date) : undefined,
                type: json.type,
                category: json.categoryId ? { connect: { id: json.categoryId } } : undefined,
                account: json.account,
                note: json.note,
            },
        });
        return NextResponse.json(transaction);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        await db.transaction.delete({
            where: {
                id: id,
            },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
    }
}
