
import express from "express";
import { uploadDocument ,
    getWorkspaceDocuments
} from "../controllers/document.controller.js";
import upload from "../middleware/upload.middleware.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
    "/:workspaceId",
    authUser,
    upload.single("document"),
    uploadDocument
);

router.get(
    "/:workspaceId",
    authUser,
    getWorkspaceDocuments
);

export default router;
