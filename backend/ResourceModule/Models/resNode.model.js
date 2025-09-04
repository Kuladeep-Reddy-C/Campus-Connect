import mongoose from 'mongoose';

// Resource subdocument schema
const resourceSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['notes', 'video', 'assignment', 'quiz'], required: true },
    link: { type: String, required: false }
});

// Main ResourceNode schema
const resourceNodeSchema = new mongoose.Schema({
    label: { type: String, required: true },
    isRoot: { type: Boolean, default: false },
    resources: [resourceSchema]
}, { timestamps: true });

const ResourceNode = mongoose.model('ResourceNode', resourceNodeSchema);
export default ResourceNode;
