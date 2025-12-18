const authService = require('../services/authService');

const register = async (req, res, next) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(409).json({ message: error.message });
        }
        if (error.message === 'Email and password are required') {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({ message: error.message });
        }
        if (error.message === 'Email and password are required') {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};

module.exports = {
    register,
    login,
};