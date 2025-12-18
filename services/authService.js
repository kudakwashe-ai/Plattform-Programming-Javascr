const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (userData) => {
    const { email, password, name, role } = userData; // Allow role setting? Maybe.

    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: role || 'member' // Default to member if not provided
        }
    });

    const token = jwt.sign(
        { id: user.id, role: user.role }, // Include role!
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Remove password from returned user object
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
};

const loginUser = async (loginData) => {
    const { email, password } = loginData;

    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { id: user.id, role: user.role }, // Include role!
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
};

module.exports = {
    registerUser,
    loginUser,
};