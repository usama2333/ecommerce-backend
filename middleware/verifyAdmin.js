const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next();
    } else {
        return res.status(403).json({ error: 'Access denied, admin only' });
    }
};

module.exports = verifyAdmin;
