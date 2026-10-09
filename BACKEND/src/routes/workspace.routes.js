
import express from "express";

import {
    createWorkspace,
    getWorkspaces,
    getWorkspaceById
} from "../controllers/workspace.controller.js";

import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a workspace
router.post("/", authUser, createWorkspace);

// Get all workspaces belonging to the logged-in user
router.get("/", authUser, getWorkspaces);

// Get one specific workspace
router.get("/:workspaceId", authUser, getWorkspaceById);

export default router;
