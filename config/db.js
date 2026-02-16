/**
 * Database Configuration
 * Singleton Prisma Client with connection pooling and graceful shutdown
 * Following Prisma best practices for production environments
 */

const { PrismaClient } = require('@prisma/client');

// Singleton pattern for Prisma Client
let prisma;

/**
 * Get Prisma Client instance
 * Uses singleton pattern to prevent multiple instances in development
 */
const getPrismaClient = () => {
    if (!prisma) {
        prisma = new PrismaClient({
            log: process.env.NODE_ENV === 'development'
                ? ['query', 'error', 'warn']
                : ['error'],
            errorFormat: 'pretty',
        });
    }
    return prisma;
};

/**
 * Graceful shutdown handler
 * Ensures all DB connections are properly closed
 */
const disconnectDB = async () => {
    if (prisma) {
        await prisma.$disconnect();
        console.log('Database disconnected gracefully');
    }
};

// Handle shutdown signals
process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await disconnectDB();
    process.exit(0);
});

module.exports = {
    prisma: getPrismaClient(),
    disconnectDB,
};
