const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { roles } = require('../models/user');

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

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
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
