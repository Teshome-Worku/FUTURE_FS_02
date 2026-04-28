import express from "express";
import {
    protect
} from "../middleware/authMiddleware.js";
import {
    createLead,
    getLeads,
    updateLeadStatus,
    deleteLead
} from "../controllers/leadController.js";


const router = express.Router();

// @route POST /api/leads
router.post("/", createLead);
// @route GET /api/leads
router.get("/", protect, getLeads);
//@route put /api/leads/:id/status
router.put("/:id/status", protect, updateLeadStatus)
// @desc Delete a lead
// @route DELETE /api/leads/:id
// @access Private
router.delete("/:id", protect, deleteLead);


export default router;