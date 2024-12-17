const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { verifyAdmin, verifySuperAdmin } = require('../middleware/verifyAdmin');
const { roles } = require('../models/user');
const { getAllUsers } = require('../controllers/adminController');
const { deleteUser } = require('../controllers/adminController');

// Admin dashboard (accessible by both Admin and Super Admin)
router.get('/dashboard', verifyToken, verifyAdmin, (req, res) => {
    // Check if the user is super admin
    if (req.user.role === roles.SUPER_ADMIN) {
        return res.status(200).json({ message: 'Welcome to the Super Admin Dashboard' });
    }
    
    // If not super admin, but admin
    return res.status(200).json({ message: 'Welcome to the Admin Dashboard' });
});

// Route to get all users (Admins and Super Admins can access this)
router.get('/users', verifyToken, verifyAdmin, getAllUsers);

// Route to delete a user
router.delete('/users/:id', verifyToken, verifyAdmin, deleteUser);

module.exports = router;
