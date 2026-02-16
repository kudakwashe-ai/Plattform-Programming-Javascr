/**
 * Main Application File
 * Production-ready Express server with security middleware
 * Following best practices from top tech companies
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import routes
const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const tokenRoutes = require('./routes/tokenRoutes');

// Import error handlers
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import auth middleware for dashboard protection
const { protect, requireAdmin } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== Security Middleware ==========

// Set security HTTP headers
app.use(helmet({
    contentSecurityPolicy: false, // Disable for now to allow inline scripts
    crossOriginEmbedderPolicy: false,
}));

// Enable CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting - prevent brute force attacks
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// ========== General Middleware ==========

// Body parser
app.use(express.json({ limit: '10kb' })); // Limit body size for security
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Serve static files
app.use(express.static('public'));

// ========== API Routes ==========

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// API routes
app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tokens', tokenRoutes);

// Root route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Protected Dashboard Routes
app.get('/dashboard.html', (req, res, next) => {
    protect(req, res, (err) => {
        if (err) return res.redirect('/auth.html');
        res.sendFile(path.join(__dirname, 'private', 'dashboard.html'));
    });
});

app.get('/admin.html', (req, res, next) => {
    protect(req, res, (err) => {
        if (err) return res.redirect('/auth.html');
        try {
            requireAdmin(req, res, () => {
                res.sendFile(path.join(__dirname, 'private', 'admin.html'));
            });
        } catch (error) {
            res.redirect('/dashboard.html');
        }
    });
});

// ========== Error Handling ==========

// Handle 404 - Not Found
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// ========== Start Server ==========

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
    const server = app.listen(PORT, () => {
        console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎬 Movie App Server                                     ║
║                                                           ║
║   Status: Running                                         ║
║   Port: ${PORT}                                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                                 ║
║   URL: http://localhost:${PORT}                          ║
║                                                           ║
║   API Endpoints:                                          ║
║   - Movies:  http://localhost:${PORT}/api/movies          ║
║   - Auth:    http://localhost:${PORT}/api/auth            ║
║   - Users:   http://localhost:${PORT}/api/users           ║
║   - Reviews: http://localhost:${PORT}/api/reviews         ║
║   - Admin:   http://localhost:${PORT}/api/admin           ║
║   - Tokens:  http://localhost:${PORT}/api/tokens          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('👋 SIGTERM SIGNAL received: closing HTTP server');
        server.close(() => {
            console.log('💥 HTTP server closed');
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        console.log('👋 SIGINT SIGNAL received: closing HTTP server');
        server.close(() => {
            console.log('💥 HTTP server closed');
            process.exit(0);
        });
    });
}

module.exports = app; // Export for testing
