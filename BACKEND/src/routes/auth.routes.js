
import express from "express";

import {
    registerUser,
    loginUser,
    getMe,
    logoutUser
} from "../controllers/auth.controller.js";

import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-me", authUser, getMe);
router.post("/logout", logoutUser);

export default router;
