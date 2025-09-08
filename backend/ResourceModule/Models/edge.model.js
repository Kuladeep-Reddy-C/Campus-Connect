import mongoose from 'mongoose';

const edgeSchema = new mongoose.Schema({
    source: { type: String, required: true },
    target: { type: String, required: true },
    sourceHandle: { type: String },
    targetHandle: { type: String },
    type: { type: String, default: 'default' },
    style: {
        stroke: { type: String },
        strokeWidth: { type: Number },
    }
}, { timestamps: true });

const Edge = mongoose.model('Edge', edgeSchema);
export default Edge;
