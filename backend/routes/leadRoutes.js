import express from "express";
import { createLead,getLeads,updateLeadStatus } from "../controllers/leadController.js";

const router = express.Router();

// @route POST /api/leads
router.post("/", createLead);
// @route GET /api/leads
router.get("/", getLeads);
//@route put /api/leads/:id/status
router.put("/:id/status",updateLeadStatus)

export default router;