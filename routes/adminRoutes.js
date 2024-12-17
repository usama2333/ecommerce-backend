const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { verifyAdmin, verifySuperAdmin } = require('../middleware/verifyAdmin');

// Super Admin Dashboard route
router.get('/super-admin-dashboard', verifyToken, verifySuperAdmin, (req, res) => {
    res.status(200).json({ message: 'Welcome to the Super Admin Dashboard' });
});

// Admin Dashboard route (Admin or Super Admin access)
router.get('/dashboard', verifyToken, verifyAdmin, (req, res) => {
    res.status(200).json({ message: 'Welcome to the Admin Dashboard' });
});

module.exports = router;
