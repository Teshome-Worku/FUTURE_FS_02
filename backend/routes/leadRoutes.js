import express from "express";
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
router.get("/", getLeads);
//@route put /api/leads/:id/status
router.put("/:id/status", updateLeadStatus)
// @route POST /api/leads/:leadId/notes
router.post("/:leadId/notes", addNote);
// @route GET /api/leads/:leadId/notes
router.get("/:leadId/notes", getNotesByLead);

export default router;