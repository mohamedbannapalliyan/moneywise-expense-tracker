import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const categories = await db.category.findMany();
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const category = await db.category.create({
            data: {
                name: json.name,
                type: json.type,
                color: json.color,
                icon: json.icon,
            },
        });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
