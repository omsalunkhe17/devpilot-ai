
import workspaceModel from "../models/workspace.model.js";

// Create a new workspace
export const createWorkspace = async (req, res) => {
    try {
        const { name, description = "" } = req.body;

        // Validate workspace name
        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                message: "Workspace name is required"
            });
        }

        const workspace = await workspaceModel.create({
            name: name.trim(),
            description,
            owner: req.user.userId
        });

        return res.status(201).json({
            message: "Workspace created successfully",
            workspace
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create workspace"
        });
    }
};

// Get workspaces belonging to the logged-in user
export const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await workspaceModel
            .find({ owner: req.user.userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            workspaces
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch workspaces"
        });
    }
};


export const getWorkspaceById = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const workspace = await workspaceModel.findOne({
            _id: workspaceId,
            owner: req.user.userId
        });

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        return res.status(200).json({
            workspace
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid workspace ID"
            });
        }

        return res.status(500).json({
            message: "Failed to fetch workspace"
        });
    }
};
