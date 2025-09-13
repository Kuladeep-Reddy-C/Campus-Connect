import TeamJoinForm from "../models/Team.Schema.js";

// Create join form (submit request)
export const createJoinForm = async (req, res) => {
  try {
    const form = new TeamJoinForm(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all join forms
export const getAllJoinForms = async (req, res) => {
  try {
    const forms = await TeamJoinForm.find().populate("projectId"); // populate project details
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get join forms by projectId
export const getFormsByProject = async (req, res) => {
  try {
    const forms = await TeamJoinForm.find({ projectId: req.params.projectId });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single form by ID
export const getJoinFormById = async (req, res) => {
  try {
    const form = await TeamJoinForm.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update form (e.g., user edits submission before approval)
export const updateJoinForm = async (req, res) => {
  try {
    const form = await TeamJoinForm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.status(200).json(form);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Approve / Reject form
export const updateFormStatus = async (req, res) => {
  try {
    const form = await TeamJoinForm.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.status(200).json(form);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete form
export const deleteJoinForm = async (req, res) => {
  try {
    const form = await TeamJoinForm.findByIdAndDelete(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
