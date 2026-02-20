module.exports = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ message: 'Auth Failed', success: false });
        }
        if (roles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).send({ message: 'Access Denied', success: false });
        }
    };
};
