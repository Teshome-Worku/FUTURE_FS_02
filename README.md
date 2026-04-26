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
* Admin login with JWT authentication
* View all leads in a structured dashboard
* Lead detail page with:
  * Status updates (`new`, `contacted`, `converted`)
  * Follow-up date scheduling
  * Notes timeline and note creation
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
* JWT authentication middleware

### Database

* MongoDB (Mongoose)

### Frontend

* Next.js (App Router)
* React
* Tailwind CSS

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
│   ├── middleware/    # Auth middleware
│   └── server.js      # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── app/                   # Next.js routes/pages
│   │   │   ├── login/             # Login page
│   │   │   └── dashboard/         # Dashboard + lead detail pages
│   │   ├── components/            # Reusable UI components
│   │   └── services/              # API helper functions
│   ├── public/                    # Static assets
│   └── package.json
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
cd leadflow-crm
```

---

### 2. Install dependencies (backend + frontend)

```
cd backend
npm install

cd ../frontend
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

Create a `.env` file inside `/frontend`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### 4. Run backend server

```
cd backend
npm run dev
```

Server will run on:

```
http://localhost:5000
```

---

### 5. Run frontend app

```
cd frontend
npm run dev
```

Frontend will run on:

```
http://localhost:3000
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

### 📝 Notes

```
GET /api/notes/:leadId
POST /api/notes/:leadId
```

### 🔐 Auth

```
POST /api/auth/register
POST /api/auth/login
```

---

## 🧠 Real-World Use Case

This CRM system reflects how businesses:

* Handle incoming client inquiries
* Track communication progress
* Improve conversion rates through follow-ups

---

## 🚧 Upcoming Features

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
