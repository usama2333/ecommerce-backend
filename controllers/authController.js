const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { roles } = require('../models/user');

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log('Entered Email:', email);
console.log('Entered Password:', password);

        // Default role to 'USER' if not provided
        const userRole = role !== undefined ? role : roles.USER;

        // Ensure the role is valid
        if (![roles.USER, roles.ADMIN, roles.SUPER_ADMIN].includes(userRole)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const user = await User.create({ name, email, password, role: userRole });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email... or password' });
        }

        // Proceed with login (JWT token generation, etc.)
        res.status(200).json({ message: 'Login successful' });

    } catch (err) {
        console.error('Login error: ', err);
        res.status(500).json({ error: 'Error during login' });
    }
};
