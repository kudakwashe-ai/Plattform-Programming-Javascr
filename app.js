require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout'); // Default layout

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session Setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key_jobit',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// User Middleware (Make user available in templates)
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.path = req.path;
    next();
});

// Routes
// const indexRouter = require('./routes/index'); // If we have one
// app.use('/', indexRouter);
app.use('/', require('./routes/api/vacancies')); // Public Job Search
app.use('/auth', require('./routes/api/auth'));
app.use('/admin', require('./routes/api/admin'));
app.use('/member', require('./routes/api/member'));

// Redirect /dashboard to /member/dashboard for backward compatibility
app.get('/dashboard', (req, res) => res.redirect('/member/dashboard'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
