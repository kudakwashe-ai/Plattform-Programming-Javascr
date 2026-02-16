const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Testing MongoDB connection...');
    try {
        const count = await prisma.user.count();
        console.log(` Connection successful! Total users in MongoDB: ${count}`);
    } catch (err) {
        console.error(' Connection failed:', err.message);
        console.log('\nTip: Make sure your MongoDB URL in .env is correct and your IP is whitelisted in MongoDB Atlas.');
    } finally {
        await prisma.$disconnect();
    }
}

main();
