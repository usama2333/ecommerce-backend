const User = require('../models/user');
const { roles } = require('../models/user');

// Soft delete (mark as deleted)

// Soft delete a user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the user to be deleted
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Only Super Admin can delete Admins
        if (user.role === 1 && req.user.role !== 2) {
            return res.status(403).json({ error: 'Only Super Admin can delete Admins' });
        }

        // Soft delete by setting the 'deleted' flag to true
        user.deleted = true;
        await user.save();

        res.status(200).json({ message: 'User successfully deleted (soft delete)', user });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};

// Get all users excluding those marked as deleted
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ deleted: false }).select('-password'); // Exclude the password field
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving users' });
    }
};
