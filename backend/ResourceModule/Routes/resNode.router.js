import express from 'express';
import ResourceNode from '../Models/resNode.model.js';

const router = express.Router();

// Create a new ResourceNode
router.post('/', async (req, res) => {
    try {
        const { label, isRoot, resources } = req.body;
        const resourceNode = new ResourceNode({ label, isRoot, resources });
        await resourceNode.save();
        res.status(201).json(resourceNode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read all ResourceNodes
router.get('/', async (req, res) => {
    try {
        const nodes = await ResourceNode.find();
        res.json(nodes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read a ResourceNode by ID
router.get('/:id', async (req, res) => {
    try {
        const node = await ResourceNode.findById(req.params.id);
        if (!node) return res.status(404).json({ message: 'ResourceNode not found' });
        res.json(node);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a ResourceNode by ID
router.put('/:id', async (req, res) => {
    try {
        const { label, isRoot, resources } = req.body;
        const updatedNode = await ResourceNode.findByIdAndUpdate(
            req.params.id,
            { label, isRoot, resources },
            { new: true }
        );
        if (!updatedNode) return res.status(404).json({ message: 'ResourceNode not found' });
        res.json(updatedNode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a ResourceNode by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedNode = await ResourceNode.findByIdAndDelete(req.params.id);
        if (!deletedNode) return res.status(404).json({ message: 'ResourceNode not found' });
        res.json({ message: 'ResourceNode deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
