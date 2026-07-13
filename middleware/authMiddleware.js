require('dotenv').config();

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.get("Authorization");

        if (! authHeader) {
            return res.status(401).json({
                error: "Authorization Hader is Missing"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                error: "Token is missing",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            error: "Invalid or expired token",
        });
    }
}

module.exports = authMiddleware;