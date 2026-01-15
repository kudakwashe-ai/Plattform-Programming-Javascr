const bcrypt = require('bcrypt');
const prisma = require('../prisma/client');

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.render('auth/register', { message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Ensure only valid roles are assigned. For safety, default to USER if not explicit in a controlled environment, 
        // but keeping existing logic with safer check. 
        // Realistically, we shouldn't allow 'role' to be passed directly from body for ADMIN in production without checks,
        // but adhering to current specific requirements.
        const userRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: userRole,
                // Create empty profile for Job Seekers
                profile: userRole === 'USER' ? {
                    create: {}
                } : undefined
            }
        });

        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        if (error.code === 'P2002') {
            return res.render('auth/register', { message: 'Email already exists' });
        }
        res.render('auth/register', { message: 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('auth/login', { message: 'Invalid email or password' });
        }

        // Set session
        req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
        res.redirect(user.role === 'ADMIN' ? '/admin' : '/member/dashboard');
    } catch (error) {
        console.error(error);
        res.render('auth/login', { message: 'Login failed' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};
