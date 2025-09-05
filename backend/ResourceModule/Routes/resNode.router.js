import express from 'express';
import NodeModel from '../Models/resNode.model.js';
import Subject from '../Models/subject.model.js'; 

const router = express.Router();

// Create a NodeModel
router.post('/', async (req, res) => {
    try {
        const { subject_id, type, position, data } = req.body;

        // Validate required fields
        if (!subject_id || !type || !position || !data || !data.label) {
            return res.status(400).json({ message: 'Missing required fields: subject_id, type, position, or data.label' });
        }

        const node = new NodeModel({ subject_id, type, position, data });
        await node.save();

        // Add node to Subject's nodes array
        const subject = await Subject.findById(subject_id);
        if (subject) {
            subject.nodes.push(node._id);
            await subject.save();
        } else {
            return res.status(404).json({ message: 'Subject not found' });
        }

        res.status(201).json(node);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all NodeModels
router.get('/', async (req, res) => {
    try {
        const nodes = await NodeModel.find();
        res.json(nodes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get NodeModel by ID
router.get('/:id', async (req, res) => {
    try {
        const node = await NodeModel.findById(req.params.id);
        if (!node) return res.status(404).json({ message: 'Node not found' });
        res.json(node);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update NodeModel by ID
router.put('/:id', async (req, res) => {
    try {
        const { data, position } = req.body;
        const updatedNode = await NodeModel.findByIdAndUpdate(
            req.params.id,
            { $set: { data, position } },
            { new: true }
        );
        if (!updatedNode) return res.status(404).json({ message: 'Node not found' });
        res.json(updatedNode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete NodeModel by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedNode = await NodeModel.findByIdAndDelete(req.params.id);
        if (!deletedNode) return res.status(404).json({ message: 'Node not found' });

        // Remove node from Subject's nodes array
        const subject = await Subject.findOne({ nodes: req.params.id });
        if (subject) {
            subject.nodes = subject.nodes.filter(nodeId => nodeId.toString() !== req.params.id);
            await subject.save();
        }

        res.json({ message: 'Node deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;