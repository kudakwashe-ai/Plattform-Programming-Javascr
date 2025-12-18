const prisma = require('./prisma');
const bcrypt = require('bcryptjs');

const verifyAdmin = async () => {
    const email = 'admin@example.com';
    const password = 'password123';

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.log('User not found in DB!');
            return;
        }

        console.log('User found:', user.email, user.role);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);

    } catch (e) {
        console.error('Error verifying:', e);
    } finally {
        await prisma.$disconnect();
    }
};

verifyAdmin();
