import Note from "../models/Note.js";
import Lead from "../models/Lead.js";

// @desc Add note to a lead
export const addNote = async (req, res) => {
    try {
        const {
            content
        } = req.body;

        // check if lead exists
        const lead = await Lead.findById(req.params.leadId);
        if (!lead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        const note = new Note({
            lead: lead._id,
            content,
        });

        const savedNote = await note.save();

        res.status(201).json(savedNote);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc Get all notes for a lead
export const getNotesByLead = async (req, res) => {
    try {
        const notes = await Note.find({
                lead: req.params.leadId
            })
            .sort({
                createdAt: -1
            })
            .lean();

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};