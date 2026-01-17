const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Connecting to database...')

    // Create a category
    const category = await prisma.category.create({
        data: {
            name: 'Test Category',
            type: 'EXPENSE',
            color: '#FF0000',
            icon: 'test-icon'
        }
    })
    console.log('Created Category:', category)

    // Create a transaction
    const transaction = await prisma.transaction.create({
        data: {
            amount: 42.00,
            description: 'Test Transaction',
            type: 'EXPENSE',
            categoryId: category.id
        }
    })
    console.log('Created Transaction:', transaction)

    // Query all
    const allTransactions = await prisma.transaction.findMany({
        include: { category: true }
    })
    console.log('All Transactions:', allTransactions)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
