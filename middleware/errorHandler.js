/**
 * Centralized Error Handler Middleware
 * Following Express best practices and production-ready error handling
 * Used by companies like Meta, Anthropic for consistent error responses
 */

const { AppError } = require('../utils/errors');

/**
 * Error handler for development environment
 * Provides detailed error information for debugging
 */
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

/**
 * Error handler for production environment
 * Hides implementation details from clients
 */
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // Programming or unknown error: don't leak error details
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }
};

/**
 * Handle Prisma errors
 */
const handlePrismaError = (err) => {
    if (err.code === 'P2002') {
        const field = err.meta?.target?.[0] || 'field';
        return new AppError(`${field} already exists`, 409);
    }
    if (err.code === 'P2025') {
        return new AppError('Resource not found', 404);
    }
    return new AppError('Database error occurred', 500);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () =>
    new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401);

/**
 * Handle validation errors from Joi
 */
const handleValidationError = (err) => {
    const message = err.details?.map(el => el.message).join('. ') || err.message;
    return new AppError(message, 400);
};

/**
 * Global error handling middleware
 * This is the last middleware in the chain
 */
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;

        // Handle specific error types
        if (err.name === 'PrismaClientKnownRequestError') error = handlePrismaError(err);
        if (err.name === 'JsonWebTokenError') error = handleJWTError();
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
        if (err.name === 'ValidationError') error = handleValidationError(err);

        sendErrorProd(error, res);
    }
};

/**
 * Handle 404 - Not Found
 */
const notFound = (req, res, next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err);
};

module.exports = {
    errorHandler,
    notFound,
};
