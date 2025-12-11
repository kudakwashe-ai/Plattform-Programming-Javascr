const { PrismaClient } = require('@prisma/client');

// Singleton pattern to ensure Prisma Client is only instantiated once
let prisma;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    // In development, use a global variable to preserve the Prisma Client across hot reloads
    if (!global.prisma) {
        global.prisma = new PrismaClient({
            log: ['query', 'error', 'warn'],
        });
    }
    prisma = global.prisma;
}

module.exports = prisma;