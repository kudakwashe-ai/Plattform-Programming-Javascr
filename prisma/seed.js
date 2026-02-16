/**
 * Database Seeding Script
 * Creates initial admin user and sample data
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create admin user
    const adminPassword = await bcrypt.hash('Admin@123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@movieapp.com' },
        update: {},
        create: {
            email: 'admin@movieapp.com',
            username: 'admin',
            password: adminPassword,
            role: 'ADMIN',
            firstName: 'System',
            lastName: 'Administrator',
        },
    });

    console.log('✅ Admin user created:', admin.email);

    // Create sample premium user
    const premiumPassword = await bcrypt.hash('Premium@123', 12);
    const premium = await prisma.user.upsert({
        where: { email: 'premium@movieapp.com' },
        update: {},
        create: {
            email: 'premium@movieapp.com',
            username: 'premiumuser',
            password: premiumPassword,
            role: 'PREMIUM',
            firstName: 'Premium',
            lastName: 'User',
        },
    });

    console.log('✅ Premium user created:', premium.email);

    // Create sample free user
    const freePassword = await bcrypt.hash('Free@123', 12);
    const freeUser = await prisma.user.upsert({
        where: { email: 'free@movieapp.com' },
        update: {},
        create: {
            email: 'free@movieapp.com',
            username: 'freeuser',
            password: freePassword,
            role: 'FREE',
            firstName: 'Free',
            lastName: 'User',
        },
    });

    console.log('✅ Free user created:', freeUser.email);

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\nTest Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:   admin@movieapp.com / Admin@123');
    console.log('Premium: premium@movieapp.com / Premium@123');
    console.log('Free:    free@movieapp.com / Free@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
