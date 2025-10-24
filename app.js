const express = require('express');
const path = require('path');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Use routes
app.use('/', indexRouter);
app.use('/', usersRouter);

// Handle 404
app.use((req, res) => {
  res.status(404).render('error', { message: '404 Not Found' });
});

module.exports = app;
