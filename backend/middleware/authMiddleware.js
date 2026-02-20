const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).send({ message: 'Auth Failed: No Token', success: false });
        }
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: 'Auth Failed: Invalid Token', success: false });
            } else {
                req.userId = decoded.id;
                try {
                    const user = await User.findById(decoded.id);
                    if (!user) {
                        return res.status(401).send({ message: 'User not found', success: false });
                    }
                    req.user = user;
                    next();
                } catch (error) {
                    return res.status(500).send({ message: 'Auth Error', success: false });
                }
            }
        });
    } catch (error) {
        return res.status(401).send({ message: 'Auth Failed', success: false });
    }
};
