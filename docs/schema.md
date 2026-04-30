# CRM – Database Schema

This document defines the structure of the database for the CRM system.

## 👤 Lead
```javascript
{
  _id,
  name,
  email,
  message,
  source,        // "website", "linkedin", "Manual Entry", etc.
  status,        // "new", "contacted", "converted"
  followUpDate,
  createdAt,
  updatedAt
}
```

## 📝 Note (for follow-ups & history)
```javascript
{
  _id,
  leadId,        // reference to Lead
  content,
  createdAt,
  updatedAt
}
```

## 🔐 Admin/User
```javascript
{
  _id,
  name,
  email,
  password,      // hashed
  createdAt,
  updatedAt
}
```