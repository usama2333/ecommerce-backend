const { roles } = require('../models/user');

const verifyAdmin = (req, res, next) => {
    // Check if the user is an admin or super admin
    if (req.user && (req.user.role === roles.ADMIN || req.user.role === roles.SUPER_ADMIN)) {
        return next();
    } else {
        return res.status(403).json({ error: 'Access denied, admin or super admin only' });
    }
};

// Middleware to ensure only super admins can access super admin routes
const verifySuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === roles.SUPER_ADMIN) {
        return next();
    } else {
        return res.status(403).json({ error: 'Access denied, super admin only' });
    }
};

module.exports = { verifyAdmin, verifySuperAdmin };
