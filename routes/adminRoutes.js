const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/verifyAdmin');

// Example admin dashboard route
router.get('/dashboard', verifyToken, verifyAdmin, (req, res) => {
    res.status(200).json({ message: 'Welcome to the Admin Dashboard' });
});

module.exports = router;
