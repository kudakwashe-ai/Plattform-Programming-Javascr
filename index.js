require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

const prisma = require('./utils/prisma');

// Connect to MongoDB (Prisma connects lazily, but we can log)
// mongoose.connect... removed
console.log('Using Prisma for DB connection');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', require('./routes/articleRoutes'));

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});