import express from "express";
import {
  createJoinForm,
  getAllJoinForms,
  getFormsByProject,
  getJoinFormById,
  updateJoinForm,
  updateFormStatus,
  deleteJoinForm
} from "../controllers/team.controller.js";

const router = express.Router();

router.post("/", createJoinForm);                // create
router.get("/", getAllJoinForms);                // get all
router.get("/project/:projectId", getFormsByProject); // get by project
router.get("/:id", getJoinFormById);             // get by ID
router.put("/:id", updateJoinForm);              // update form
router.patch("/:id/status", updateFormStatus);   // approve/reject
router.delete("/:id", deleteJoinForm);           // delete

export default router;
