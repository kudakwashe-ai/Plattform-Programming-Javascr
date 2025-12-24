const express = require('express');
const cors = require('cors');
const movieRoutes = require('./routes/movieRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('public')); // Serve static files if needed, though we act as API primarily or serve client directly
app.use(express.json());

// Routes
app.use('/api', movieRoutes);

// Root route to serve the HTML file (convenience)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/movie.html');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
