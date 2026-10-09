
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

import userModel from "../models/user.model.js";
import redisClient from "../config/redis.js";

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const user = await userModel.create({
            username,
            email,
            password
        });

        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Registration failed"
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                jti: randomUUID()
            },
            process.env.JWT_TOKEN,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Login failed"
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await userModel
            .findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get user"
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        const token = req.cookies?.token;

        if (token) {
            try {
                const decoded = jwt.verify(
                    token,
                    process.env.JWT_TOKEN
                );

                const remainingTime =
                    decoded.exp - Math.floor(Date.now() / 1000);

                if (decoded.jti && remainingTime > 0) {
                    await redisClient.set(
                        `blacklist:${decoded.jti}`,
                        "1",
                        { EX: remainingTime }
                    );
                }
            } catch (error) {
                // Invalid or expired tokens do not need blacklisting.
            }
        }

        res.clearCookie("token", {
            httpOnly: true,
            path: "/"
        });

        return res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Logout failed"
        });
    }
};
