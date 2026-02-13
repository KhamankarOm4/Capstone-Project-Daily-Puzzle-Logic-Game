export const requireAuth = (options = { allowGuest: false }) => {
    return (req, res, next) => {
        // Check if user is authenticated via Passport
        if (req.isAuthenticated && req.isAuthenticated()) {
            return next();
        }

        // If guest mode is allowed, proceed even if not authenticated
        if (options.allowGuest) {
            return next();
        }

        // Otherwise block
        return res.status(401).json({ error: 'Unauthorized' });
    };
};
