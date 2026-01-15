/**
 * Middleware to check if the user has a specific role.
 * @param {string} role - The required role (e.g., 'ADMIN', 'USER')
 */
function checkRole(role) {
    return (req, res, next) => {
        if (req.session.user && req.session.user.role === role) {
            return next();
        }

        // If user is not logged in, redirect to login
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        // If user is logged in but doesn't have permission
        res.status(403).render('error', {
            message: 'Access Denied',
            error: { status: 403, stack: 'You do not have permission to view this resource.' }
        });
    };
}

module.exports = { checkRole };
