import express from 'express';
import Subject from '../Models/subject.model.js';

const router = express.Router();

// Create a new subject
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const subject = new Subject({ name });
        await subject.save();
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read all subjects
router.get('/', async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read a subject by ID
router.get('/:id', async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ message: 'subject not found' });
        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a subject by ID
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;
        const updatedsubject = await Subject.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );
        if (!updatedsubject) return res.status(404).json({ message: 'subject not found' });
        res.json(updatedsubject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a subject by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
        if (!deletedSubject) return res.status(404).json({ message: 'Subject not found' });
        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
