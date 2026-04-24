import express from "express";
import { createLead,getLeads } from "../controllers/leadController.js";

const router = express.Router();

// @route POST /api/leads
router.post("/", createLead);
// @route GET /api/leads
router.get("/", getLeads);

export default router;