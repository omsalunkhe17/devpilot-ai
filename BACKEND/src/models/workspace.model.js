import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const workspaceModel = mongoose.model(
    "Workspace",
    workspaceSchema
)

export default workspaceModel;