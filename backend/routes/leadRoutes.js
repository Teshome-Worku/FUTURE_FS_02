import express from "express";
import {
    protect
} from "../middleware/authMiddleware.js";
import {
    createLead,
    getLeads,
    updateLeadStatus
} from "../controllers/leadController.js";
import {
    addNote,
    getNotesByLead
} from "../controllers/noteController.js";

const router = express.Router();

// @route POST /api/leads
router.post("/", createLead);
// @route GET /api/leads
router.get("/", protect, getLeads);
//@route put /api/leads/:id/status
router.put("/:id/status", protect, updateLeadStatus)
// @route POST /api/leads/:leadId/notes
router.post("/:leadId/notes", addNote);
// @route GET /api/leads/:leadId/notes
router.get("/:leadId/notes", getNotesByLead);

export default router;