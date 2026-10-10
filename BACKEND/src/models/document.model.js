
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["processing", "completed", "failed"],
            default: "processing"
        },

        extractedText: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const documentModel = mongoose.model("Document", documentSchema);

export default documentModel;
