const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Connecting to database...');
    try {
        // 1. Connect
        await prisma.$connect();
        console.log('✅ Connected successfully!');

        // 2. Test Write
        console.log('🔄 Testing write operation...');
        const testUser = await prisma.user.create({
            data: {
                email: 'test_connection@example.com',
                username: 'test_connection_user',
                password: 'dummy_password', // In real app this would be hashed
                role: 'FREE'
            }
        });
        console.log(`✅ User created with ID: ${testUser.id}`);

        // 3. Test Read
        console.log('🔄 Testing read operation...');
        const fetchedUser = await prisma.user.findUnique({
            where: { id: testUser.id }
        });

        if (fetchedUser) {
            console.log(`✅ User fetched: ${fetchedUser.username}`);
        } else {
            throw new Error('User not found after creation');
        }

        // 4. Test Delete (Cleanup)
        console.log('🔄 Cleaning up...');
        await prisma.user.delete({
            where: { id: testUser.id }
        });
        console.log('✅ Test user deleted.');

        console.log('🎉 DATABASE CONNECTION VERIFIED!');
    } catch (error) {
        console.error('❌ Connection verification failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
