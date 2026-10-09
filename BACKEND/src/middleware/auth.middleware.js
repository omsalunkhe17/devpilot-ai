
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";

export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_TOKEN
        );

        if (!decoded.jti) {
            return res.status(401).json({
                message: "Please log in again"
            });
        }

        const isBlacklisted = await redisClient.get(
            `blacklist:${decoded.jti}`
        );

        if (isBlacklisted) {
            return res.status(401).json({
                message: "Token revoked. Please log in again."
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        // Redis or another unexpected failure:
        // do not allow the protected request through.
        return res.status(503).json({
            message: "Authentication service temporarily unavailable"
        });
    }
};
