
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import workspaceModel from "../models/workspace.model.js";
import documentModel from "../models/document.model.js";
import splitTextIntoChunks from "../utils/textSplitter.js";

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



export const getWorkspaceDocuments = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        // Verify that the workspace belongs to the logged-in user
        const workspace = await workspaceModel.findOne({
            _id: workspaceId,
            owner: req.user.userId
        });

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        // Fetch documents belonging to this workspace and user
        const documents = await documentModel
            .find({
                workspace: workspace._id,
                owner: req.user.userId
            })
            .select("-extractedText")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            documents
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid workspace ID"
            });
        }

        console.error("Fetch documents error:", error.message);

        return res.status(500).json({
            message: "Failed to fetch documents"
        });
    }
};


export const testDocumentChunking = async (req, res) => {
    try {
        const { documentId } = req.params;

        // 1. Find the document owned by the logged-in user
        const document = await documentModel.findOne({
            _id: documentId,
            owner: req.user.userId
        });

        if (!document) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        // 2. Get the extracted text saved in MongoDB
        const extractedText = document.extractedText;

        if (!extractedText) {
            return res.status(400).json({
                message: "No extracted text available"
            });
        }

        // 3. Split the extracted text into chunks
        const chunks = await splitTextIntoChunks(extractedText);

        // 4. Return the chunks for testing
        return res.status(200).json({
            message: "Document chunked successfully",
            documentName: document.name,
            totalChunks: chunks.length,
            chunks
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid document ID"
            });
        }

        console.error("Document chunking error:", error.message);

        return res.status(500).json({
            message: "Failed to chunk document"
        });
    }
};

