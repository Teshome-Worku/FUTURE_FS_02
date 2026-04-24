# 🚀 LeadFlow CRM

A modern **Client Lead Management System (Mini CRM)** built to help businesses capture, manage, and convert leads efficiently.

This system simulates how real agencies and freelancers track potential clients from first contact to conversion.

---

## 📌 Overview

LeadFlow CRM is designed as a **SaaS-style application** that allows admins to:

* Capture leads from website contact forms
* Track lead status across a sales pipeline
* Manage and organize client interactions
* Prepare leads for conversion into real clients

---

## ✨ Features

### ✅ Core Features

* Create new leads (name, email, message, source)
* View all leads in a structured format
* Update lead status:

  * `new`
  * `contacted`
  * `converted`
* Timestamp tracking (`createdAt`, `updatedAt`)

### 🔄 CRM Workflow

```
New Lead → Contacted → Converted
```

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### Tools

* REST API
* Postman / Thunder Client (for testing)

---

## 📁 Project Structure

```
leadflow-crm/
│
├── backend/
│   ├── config/        # Database connection
│   ├── controllers/   # Business logic
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   ├── middleware/    # Auth & security (planned)
│   ├── utils/         # Helper functions
│   └── server.js      # Entry point
│
├── docs/
│   └── schema.md      # Database design
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/your-username/leadflow-crm.git
cd leadflow-crm/backend
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Configure environment variables

Create a `.env` file inside `/backend`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### 4. Run the server

```
npm run dev
```

Server will run on:

```
http://localhost:5000
```

---

## 📡 API Endpoints

### ➕ Create Lead

```
POST /api/leads
```

### 📥 Get All Leads

```
GET /api/leads
```

### 🔄 Update Lead Status

```
PUT /api/leads/:id/status
```

---

## 🧠 Real-World Use Case

This CRM system reflects how businesses:

* Handle incoming client inquiries
* Track communication progress
* Improve conversion rates through follow-ups

---

## 🚧 Upcoming Features

* 🔐 Admin Authentication (JWT)
* 📝 Notes & Follow-up system
* 🔍 Search & filtering
* 📊 Analytics dashboard
* 📅 Follow-up reminders

---

## 💼 Why This Project Matters

This project demonstrates:

* Full-stack development skills
* RESTful API design
* Real-world business logic implementation
* Scalable backend architecture

---

## 📢 Author

Developed by **Teshome Worku**
Aspiring Full Stack Developer

---

## ⭐ Final Note

> “This is not just a project — it’s a system designed to solve real business problems.”
