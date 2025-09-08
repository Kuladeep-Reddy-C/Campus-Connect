import express from 'express';
import Edge from '../Models/edge.model.js';
import ResourceNode from '../Models/resNode.model.js';
import Subject from '../Models/subject.model.js';


const router = express.Router();

// Create an Edge
router.post('/', async (req, res) => {
    try {
        const { subject_id, source, target, sourceHandle, targetHandle, type, style } = req.body;

        // Validate source and target nodes exist
        const sourceNode = await ResourceNode.findById(source);
        const targetNode = await ResourceNode.findById(target);
        if (!sourceNode || !targetNode) {
            return res.status(404).json({ message: 'Source or target node not found' });
        }

        const edge = new Edge({ source, target, sourceHandle, targetHandle, type, style });
        await edge.save();

        // Optionally, update subject's edges array (assuming Subject model exists)
        const subject = await Subject.findById(subject_id);
        if (subject) {
            subject.edges.push(edge._id);
            await subject.save();
        }

        res.status(201).json(edge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all Edges
router.get('/', async (req, res) => {
    try {
        const edges = await Edge.find();
        res.json(edges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Edge by ID
router.get('/:id', async (req, res) => {
    try {
        const edge = await Edge.findById(req.params.id);
        if (!edge) return res.status(404).json({ message: 'Edge not found' });
        res.json(edge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Edge by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedEdge = await Edge.findByIdAndDelete(req.params.id);
        if (!deletedEdge) return res.status(404).json({ message: 'Edge not found' });

        // Optionally, remove edge from subject's edges array
        // const subject = await Subject.findOne({ edges: req.params.id });
        // if (subject) {
        //     subject.edges = subject.edges.filter(edgeId => edgeId.toString() !== req.params.id);
        //     await subject.save();
        // }

        res.json({ message: 'Edge deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;