const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Generate Transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});


// Reset Password Request
exports.resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        console.log('Email received:', email); // Log email
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found'); // Log user not found
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate reset token
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('reset: ',resetToken);
        console.log('Reset token generated:', resetToken); // Log token generation

        // Send email
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `Click this link to reset your password: ${resetLink}`,
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        });

        console.log('Email sent successfully'); // Log email sent
        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (err) {
        console.error('Error in resetPasswordRequest:', err); // Log the error
        res.status(500).json({ error: 'Error processing request' });
    }
};


// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const resetToken = req.query.token;

        if (!resetToken) {
            return res.status(400).json({ error: 'Token is required' });
        }

        // Verify token
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
       

        user.password = hashedPassword;
       
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error('JWT Error: ', err);
        res.status(400).json({ error: 'Invalid or expired token', details: err.message });
    }
};

// Update Password
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Update password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error updating password' });
    }
};
