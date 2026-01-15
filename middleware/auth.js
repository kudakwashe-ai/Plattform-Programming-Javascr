function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
}

function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'ADMIN') {
        return next();
    }
    res.status(403).render('error', {
        message: 'Access Denied',
        error: { status: 403, stack: 'You do not have permission to view this page' }
    });
}

function isGuest(req, res, next) {
    if (!req.session.user) {
        return next();
    }
    res.redirect(req.session.user.role === 'ADMIN' ? '/admin' : '/dashboard');
}

module.exports = { isAuthenticated, isAdmin, isGuest };
