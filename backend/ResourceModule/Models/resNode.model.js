import mongoose from "mongoose";

// Main schema for a node (everything inline, no separate sub-schemas)
const nodeSchema = new mongoose.Schema({
    type: { type: String, required: true }, // "resource", "start", "end", etc.

    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    },

    data: {
        label: { type: String, required: true },
        isRoot: { type: Boolean, default: false },
        isEditing: { type: Boolean, default: false },

        resources: {
            type: [{
                name: { type: String, required: true },
                type: {
                    type: String,
                    enum: ["notes", "video", "assignment", "quiz"],
                    required: true
                },
                url: { type: String, required: true },
                completed: { type: Boolean, default: false }
                // No `{ _id: false }` → each resource gets its own _id automatically
            }],
            default: []
        }
    },

    draggable: { type: Boolean, default: true },

    subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    }
}, { timestamps: true });

const NodeModel = mongoose.model("NodeModel", nodeSchema);
export default NodeModel;
