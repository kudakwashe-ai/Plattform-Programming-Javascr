const prisma = require('./prisma');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
    const email = 'admin@example.com';
    const password = 'password123';
    const name = 'Admin User';

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.log(`User ${email} already exists. Updating role and password...`);
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { email },
                data: {
                    role: 'admin',
                    password: hashedPassword
                }
            });
            console.log('Role and password updated.');
        } else {
            console.log(`Creating new admin user ${email}...`);
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: 'admin'
                }
            });
            console.log('Admin user created.');
        }
    } catch (e) {
        console.error('Error creating admin:', e);
    } finally {
        await prisma.$disconnect();
    }
};

createAdmin();
