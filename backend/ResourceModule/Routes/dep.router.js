// routes/departmentRoutes.js
import express from 'express';
import Department from '../Models/dep.model.js';

const router = express.Router();

// CREATE a new department
router.post('/', async (req, res) => {
    try {
        const department = new Department(req.body);
        await department.save();
        res.status(201).json(department);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// READ all departments
router.get('/', async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ a single department by ID
router.get('/:id', async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) return res.status(404).json({ message: 'Department not found' });
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE a department by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedDepartment = await Department.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedDepartment) return res.status(404).json({ message: 'Department not found' });
        res.json(updatedDepartment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a department by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedDepartment = await Department.findByIdAndDelete(req.params.id);
        if (!deletedDepartment) return res.status(404).json({ message: 'Department not found' });
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
