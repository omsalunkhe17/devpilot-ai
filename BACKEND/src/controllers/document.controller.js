
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import workspaceModel from "../models/workspace.model.js";
import documentModel from "../models/document.model.js";

export const uploadDocument = async (req, res) => {
    try {
        // 1. Check whether a file was uploaded
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a PDF file"
            });
        }

        // 2. Get workspace ID from the URL
        const { workspaceId } = req.params;

        // 3. Verify that this workspace belongs to the logged-in user
        const workspace = await workspaceModel.findOne({
            _id: workspaceId,
            owner: req.user.userId
        });

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        // 4. Extract text from the PDF buffer in RAM
        const pdfData = await pdfParse(req.file.buffer);
        const extractedText = pdfData.text.trim();

        if (!extractedText) {
            return res.status(400).json({
                message: "No readable text found in this PDF"
            });
        }

        // 5. Save document metadata and extracted text in MongoDB
        const document = await documentModel.create({
            name: req.file.originalname,
            workspace: workspace._id,
            owner: req.user.userId,
            status: "completed",
            extractedText
        });

        // 6. Send a successful response
        return res.status(201).json({
            message: "Document uploaded successfully",
            document: {
                _id: document._id,
                name: document.name,
                workspace: document.workspace,
                status: document.status,
                createdAt: document.createdAt
            }
        });
    } catch (error) {
        console.error("Document upload error:", error.message);

        return res.status(500).json({
            message: "Failed to upload document"
        });
    }
};
