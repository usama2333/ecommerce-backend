const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const verifyToken = require('./middleware/authMiddleware');  // Import token verification middleware
const verifyAdmin = require('./middleware/verifyAdmin');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch(err => console.log('Database connection failed', err));

// Routes
app.use('/api/auth', authRoutes);  // Register and login routes

// Example of a protected route
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

// Middleware and other routes here...
app.use('/admin', adminRoutes);

module.exports = app;
