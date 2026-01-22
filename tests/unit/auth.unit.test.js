const { register, login } = require('../../controllers/authController');
const { prismaMock } = require('./helpers/prismaMock');
const bcrypt = require('bcrypt');

describe('Auth Unit Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            session: {
                destroy: jest.fn((cb) => cb())
            }
        };
        res = {
            render: jest.fn(),
            redirect: jest.fn(),
            locals: {}
        };
    });

    describe('register', () => {
        it('should return error if fields are missing', async () => {
            req.body = { name: 'Test' };
            await register(req, res);
            expect(res.render).toHaveBeenCalledWith('auth/register', { message: 'All fields are required' });
        });

        it('should hash password and create user', async () => {
            req.body = { name: 'Test', email: 'test@example.com', password: 'password123' };
            prismaMock.user.create.mockResolvedValue({ id: 1, ...req.body });

            await register(req, res);

            expect(prismaMock.user.create).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('/auth/login');
        });
    });

    describe('login', () => {
        it('should return error if invalid credentials', async () => {
            req.body = { email: 'test@example.com', password: 'wrong' };
            prismaMock.user.findUnique.mockResolvedValue(null);

            await login(req, res);

            expect(res.render).toHaveBeenCalledWith('auth/login', { message: 'Invalid email or password' });
        });

        it('should login and redirect on success', async () => {
            const password = 'password123';
            const hashedPassword = await bcrypt.hash(password, 10);
            req.body = { email: 'test@example.com', password };

            const user = { id: 1, name: 'Test', email: 'test@example.com', password: hashedPassword, role: 'USER' };
            prismaMock.user.findUnique.mockResolvedValue(user);

            await login(req, res);

            expect(req.session.user).toEqual({ id: 1, name: 'Test', email: 'test@example.com', role: 'USER' });
            expect(res.redirect).toHaveBeenCalledWith('/member/dashboard');
        });
    });
});
