const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        await prisma.$connect();
        console.log('Connected successfully!');

        console.log('Attempting to create user...');
        try {
            const user = await prisma.user.create({
                data: {
                    email: `test_db_${Date.now()}@example.com`,
                    password: 'password',
                    name: 'Test DB',
                },
            });
            console.log('User created:', user);
        } catch (createError) {
            console.error('Create failed:', createError.message);
        }

        const count = await prisma.user.count();
        console.log(`User count: ${count}`);

        await prisma.$disconnect();
    } catch (e) {
        console.error('Connection failed:');
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();
