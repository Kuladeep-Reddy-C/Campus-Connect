import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", createProject);         // Create
router.get("/", getProjects);            // Get all
router.get("/:id", getProjectById);      // Get by ID
router.put("/:id", updateProject);       // Update by ID
router.delete("/:id", deleteProject);    // Delete by ID

export default router;
