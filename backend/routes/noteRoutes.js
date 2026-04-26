import express from "express";
import {
    addNote,
    getNotesByLead
} from "../controllers/noteController.js";

const router = express.Router();

// @route POST /api/notes/:leadId
router.post("/:leadId", addNote);
// @route GET /api/notes/:leadId
router.get("/:leadId", getNotesByLead);

export default router;