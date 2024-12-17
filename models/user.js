const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Enum for role management
const roles = {
    USER: 0,
    ADMIN: 1,
    SUPER_ADMIN: 2
};

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, default: roles.USER, enum: [roles.USER, roles.ADMIN, roles.SUPER_ADMIN] }, // default to USER
}, { timestamps: true });

// Password hashing before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Export the user model
module.exports = mongoose.model('User', userSchema);

// Export role constants for easier usage
module.exports.roles = roles;
