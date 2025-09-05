import express from 'express';
import Subject from '../Models/subject.model.js';
import ResourceNode from '../Models/resNode.model.js';
import Edge from '../Models/edge.model.js';
import { requireAuth } from "@clerk/express";

const router = express.Router();

// Create a Subject
router.post('/', requireAuth(), async (req, res) => {
    try {
        const bodyData = req.body;
        const nodes = [];
        const edges = [];

        // Validate required fields
        if (!bodyData.name || !bodyData.creatorId || !bodyData.deptId) {
            return res.status(400).json({ message: 'Missing required fields: name, creatorId, or deptId' });
        }

        const subject = new Subject({ ...bodyData, nodes, edges });
        await subject.save();

        res.status(201).json(subject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Get all Subjects
router.get('/', requireAuth(), async (req, res) => {
    try {
        const subjects = await Subject.find().populate('nodes').populate('edges');
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Subject by ID
router.get('/:id', async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id).populate('nodes').populate('edges');
        if (!subject) return res.status(404).json({ message: 'Subject not found' });
        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Increment Views
router.post('/:id/views', requireAuth(), async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!subject) return res.status(404).json({ message: 'Subject not found' });
        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Toggle Star
router.post('/:id/star', requireAuth(), async (req, res) => {
    try {
        const { userId } = req.auth;
        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        const isStarred = subject.stars.includes(userId);
        if (isStarred) {
            subject.stars = subject.stars.filter(id => id !== userId);
        } else {
            subject.stars.push(userId);
        }
        await subject.save();
        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add Comment
router.post('/:id/comments', requireAuth(), async (req, res) => {
    try {
        const { userId } = req.auth;
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Comment text is required' });

        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        subject.comments.push({ userId, text });
        await subject.save();
        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Subject by ID
router.put('/:id', async (req, res) => {
    try {
        const { name, nodes, edges } = req.body;

        // Validate nodes if provided
        if (nodes && nodes.length > 0) {
            const validNodes = await ResourceNode.find({ _id: { $in: nodes } });
            if (validNodes.length !== nodes.length) {
                return res.status(404).json({ message: 'One or more nodes not found' });
            }
        }

        // Validate edges if provided
        if (edges && edges.length > 0) {
            const validEdges = await Edge.find({ _id: { $in: edges } });
            if (validEdges.length !== edges.length) {
                return res.status(404).json({ message: 'One or more edges not found' });
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (nodes) updateData.nodes = nodes;
        if (edges) updateData.edges = edges;

        const updatedSubject = await Subject.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        ).populate('nodes').populate('edges');

        if (!updatedSubject) return res.status(404).json({ message: 'Subject not found' });
        res.json(updatedSubject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Subject by ID
router.delete('/:id', requireAuth(), async (req, res) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
        if (!deletedSubject) return res.status(404).json({ message: 'Subject not found' });

        // Optionally, delete associated nodes and edges
        if (deletedSubject.nodes.length > 0) {
            await ResourceNode.deleteMany({ _id: { $in: deletedSubject.nodes } });
        }
        if (deletedSubject.edges.length > 0) {
            await Edge.deleteMany({ _id: { $in: deletedSubject.edges } });
        }

        res.json({ message: 'Subject and associated nodes/edges deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;