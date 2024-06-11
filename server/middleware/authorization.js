const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        const jwtToken = req.header("token");
        const jwtFarmToken = req.header("farmtoken");

        if (!jwtToken && !jwtFarmToken) {
            return res.status(403).json("Not Authorized: No token provided");
        }

        if (jwtToken) {
            const payload = jwt.verify(jwtToken, process.env.jwtSecret);
            req.user = payload.user;
            return next();
        }

        if (jwtFarmToken) {
            const payload = jwt.verify(jwtFarmToken, process.env.JwtSecret);
            req.farmUser = payload.user;
            return next();
        }

        return res.status(403).json("Not Authorized: Invalid token");
    } catch (err) {
        console.error(err.message);
        return res.status(403).json("Not Authorized: Token verification failed");
    }
};
