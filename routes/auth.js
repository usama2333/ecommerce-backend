const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { resetPasswordRequest, resetPassword, updatePassword } = require('../controllers/passwordController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Reset Password (Request)
router.post('/reset-password-request', resetPasswordRequest);

// Reset Password (Finalize)
router.post('/reset-password', resetPassword);

// Update Password (For logged-in users)
router.post('/update-password', verifyToken, updatePassword);

module.exports = router;
