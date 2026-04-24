# CRM – Database Schema

This document defines the structure of the database for the CRM system.

## Lead
{
  _id,
  name,
  email,
  message,
  source,        // "website", "linkedin", etc.
  status,        // "new", "contacted", "converted"
  followUpDate,
  createdAt,
  updatedAt
}

📝 Note (for follow-ups & history)
{
  _id,
  leadId,        // reference to Lead
  content,
  createdAt
}

🔐 Admin/User
{
  _id,
  email,
  password,      // hashed
  createdAt
}