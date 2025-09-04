// models/department.js
import mongoose from 'mongoose';

// Schema for individual subjects
const subjectSchema = new mongoose.Schema({
    subject_id: { type: String, required: true },
    subject_name: { type: String, required: true }
});

// Schema for a department
const departmentSchema = new mongoose.Schema({
    departmentName: { type: String, required: true },
    subjects: [subjectSchema] // array of subject objects
});

// Export the model so it can be imported anywhere
const Department = mongoose.model('Department', departmentSchema);
export default Department;
