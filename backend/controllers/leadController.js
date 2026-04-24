import Lead from "../models/Lead.js";

// @desc Create new lead
export const createLead = async (req, res) => {
  try {
    const { name, email, message, source } = req.body;

    const lead = new Lead({
      name,
      email,
      message,
      source,
    });

    const savedLead = await lead.save();

    res.status(201).json(savedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc Get all leads
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update lead status
export const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    if(!['new','contacted','converted'].includes(status)){
      return res.status(400).json({ message: "Invalid status" });   
    }

    lead.status = status;
    
    const updatedLead = await lead.save();

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};