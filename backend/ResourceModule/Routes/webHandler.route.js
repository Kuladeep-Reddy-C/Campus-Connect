import express from 'express';
import User from '../Models/webHandler.model.js';

const router = express.Router();

// Create - Add new user
router.post('/', async (req, res) => {
    try {
        const { id, fullName, emailAddress, imageUrl } = req.body;

        const userExists = await User.findOne({ id });
        if (userExists) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const user = new User({ id, fullName, emailAddress, imageUrl });
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read - Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read - Get user by id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user by id
router.put('/:id', async (req, res) => {
    try {
        const { fullName, emailAddress, imageUrl } = req.body;
        const user = await User.findOneAndUpdate(
            { id: req.params.id },
            { fullName, emailAddress, imageUrl },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user by id
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ id: req.params.id });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
