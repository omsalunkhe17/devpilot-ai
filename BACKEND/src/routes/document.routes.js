
import express from "express";
import {
    uploadDocument,
    getWorkspaceDocuments,
    testDocumentChunking
} from "../controllers/document.controller.js";

import upload from "../middleware/upload.middleware.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// 1. Test document chunking
router.get(
    "/chunk/:documentId",
    authUser,
    testDocumentChunking
);

// 2. Get workspace documents
router.get(
    "/:workspaceId",
    authUser,
    getWorkspaceDocuments
);

// 3. Upload a document
router.post(
    "/:workspaceId",
    authUser,
    upload.single("document"),
    uploadDocument
);

export default router;
