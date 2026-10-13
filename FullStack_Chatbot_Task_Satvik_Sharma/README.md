# DroneTV - Full Stack AI Support & Lead Assistant Web Application

**Assignment:** IPAGE Group Full Stack Developer Intern — Technical Assignment  
**Project Name:** `FullStack_Chatbot_Task_Satvik_Sharma`  
**Candidate Name:** Satvik Sharma  
**Email:** `sharmasatvik159@gmail.com`  
**GitHub Repository:** [https://github.com/sharmasatvik159-pixel/Full-Stack-Lead-AI-Assistant-Chatbot](https://github.com/sharmasatvik159-pixel/Full-Stack-Lead-AI-Assistant-Chatbot)  
**Reference Website (Context only):** [DroneTV.in](http://dronetv.in/)  

---

## 📌 1. Project Description
**DroneTV AI Support & Lead Assistant** is an end-to-end full-stack web application designed for India's drone training and commercial UAV industry. Built in response to the IPAGE Group technical evaluation, this application features:

1. **AeroBot (Rule-Based Chatbot):** Answers predefined inquiries, supports session conversation history, handles unmatched queries gracefully with suggested prompts, provides conversation reset, and collects student/customer leads inline.
2. **Customer & Student Lead Enquiry Form:** Multi-field modal with client-side validation, capturing name, email, phone, user type (`Student` / `Customer` / `Other`), course/service of interest, and messages.
3. **Backend REST API:** Node.js + Express with TypeScript, implementing full CRUD (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) with input validation, rate limiting, and safe error masking.
4. **Persistent Database:** SQLite 3.x with WAL mode for out-of-the-box local execution, along with complete production DDL schemas for PostgreSQL, MySQL, and MongoDB.
5. **Admin Enquiry CRM Dashboard:** Supports live search, filtering by **Student / Customer**, status updates (`New`, `Contacted`, `In Progress`, `Closed`), lead deletion with confirmation, counselor notes logging, and CSV export.

---

## 💻 2. Technologies Used

### Frontend (Part 1)
- **Framework:** React.js 19 with TypeScript
- **Tooling:** Vite
- **Styling:** Custom Vanilla CSS Design System (dark aviation tech theme, glassmorphic cards, micro-animations, fully responsive across desktop, tablet, and mobile)
- **Icons:** `lucide-react`
- **Celebration Effects:** `canvas-confetti`

### Backend & API (Part 4)
- **Runtime & Language:** Node.js (v24.x) & TypeScript
- **Framework:** Express.js 4.x
- **Middleware:** Helmet, CORS, Express-Rate-Limit (300 req / 15 min), Custom Error Handler
- **Validation:** Strict regex sanitization and validation on both frontend and backend

### Database (Part 5)
- **Primary Engine:** SQLite 3.x via `better-sqlite3` driver with WAL mode
- **Additional Engine Schemas Provided:** PostgreSQL, MySQL, MongoDB (Mongoose)

---

## 🤖 3. Chatbot Implementation (Part 2 & Part 3)

### Predefined Questions Supported:
1. `What services does DroneTV provide?`
2. `What courses / training are available?`
3. `How can I contact DroneTV?`
4. `How can I register?`
5. `I am interested in a service.`
6. `I am a student.`
7. `I want to speak with someone.`

### Key Chatbot Capabilities:
- **Conversation History:** Maintains chronological message log for the user's session.
- **Graceful Fallback:** Unmatched questions receive an overview of DroneTV services and relevant quick reply prompt chips.
- **Conversation Reset:** A dedicated reset button restarts the session.
- **Conversational Lead Capture:** Automatically captures `Name`, `Email`, `Phone`, `User type (Student / Customer / Other)`, `Service or course of interest`, and `Message` directly inside the chat window.

---

## 📊 4. Admin Dashboard (Part 6)

- **Search & Filtering:**
  - Real-time debounced keyword search across Name, Email, Phone, City, Notes.
  - **Filter by Student / Customer:** One-click filter for `Student`, `Customer`, or `Other`.
  - Filter by Category and Status (`New`, `Contacted`, `In Progress`, `Closed`).
- **Full CRUD Actions:**
  - View full enquiry details modal with user message and metadata.
  - Inline status update dropdown (`New` → `Contacted` → `In Progress` → `Closed`).
  - Edit counselor notes and priority.
  - Delete enquiry with safety confirmation dialog.
  - One-click RFC-compliant CSV export.

---

## 🛡️ 5. Error Handling & Security (Part 7 & Part 8)

- **Empty Required Fields:** Highlighted with red inline warnings on frontend; rejected with HTTP 400 on backend.
- **Invalid Formats:** Regex validation for RFC-compliant email and 10+ digit phone numbers.
- **Non-Existing Enquiry ID:** Returns clean HTTP 404 JSON response (`Enquiry with ID :id not found`).
- **Information Masking:** Stack traces and sensitive database errors are never exposed in HTTP responses.
- **Rate Limiting & Helmet:** Restricts automated spam and enforces secure headers.
- **Parameterized Queries:** Protects against SQL injection vulnerabilities.
- **Environment Variables:** All configurations managed via `.env` with `.env.example` templates provided.

---

## 📁 6. Submission Package Structure (Part 9)

```
FullStack_Chatbot_Task_Satvik_Sharma/
├── 📁 01_Source_Code/
│   ├── 📁 backend/                # Express.js + TypeScript + SQLite REST API
│   │   ├── src/controllers/      # Enquiry CRUD & Chatbot Rule Engine
│   │   ├── src/db/               # SQLite Connection & Seed data
│   │   ├── src/middleware/       # Input Sanitization, Validation & Error Handling
│   │   ├── src/routes/           # REST Endpoints (GET, POST, PUT, PATCH, DELETE)
│   │   ├── server.ts             # Express Server with Helmet, Rate Limiter, CORS
│   │   └── package.json & tsconfig.json
│   └── 📁 frontend/               # React 19 + TypeScript + Vite Client
│       ├── src/components/       # AeroBot, EnquiryModal, AdminDashboard, Navbar, Hero, Ecosystem
│       ├── src/services/api.ts   # REST API Client
│       ├── src/index.css         # Modern Aviation Tech Design System
│       └── package.json & vite.config.ts
├── 📁 02_Screenshots/             # High-Resolution UI Screenshots
│   ├── 01_Landing_Hero_Section.png
│   ├── 02_Services_Ecosystem_Grid.png
│   ├── 03_AeroBot_Chatbot_Interaction.png
│   ├── 04_Lead_Enquiry_Modal_Form.png
│   ├── 05_Admin_CRM_Dashboard.png
│   └── 06_Lead_Details_And_Notes_Modal.png
├── 📁 03_API_Documentation/
│   ├── API_DOCUMENTATION.md       # Comprehensive Endpoint Reference & Payloads
│   └── DroneTV_Postman_Collection.json
├── 📁 04_Database/
│   ├── dronetv_leads.sqlite       # Pre-seeded SQLite Database (8 sample records)
│   ├── schema.sql                 # SQLite DDL Table Schema & Indexes
│   ├── seed.sql                   # SQL Seed Script
│   ├── schema_postgresql.sql      # PostgreSQL DDL Schema
│   ├── schema_mysql.sql           # MySQL 8.x Schema
│   ├── mongodb_schema.js          # Mongoose Schema
│   └── DATABASE_DOCUMENTATION.md  # Multi-Database Documentation
├── 📁 05_Video_Walkthrough/
│   ├── WALKTHROUGH_SCRIPT.md      # Minute-by-minute speaking script & cues (5-10 min)
│   └── VIDEO_RECORDING_GUIDE.md   # Recording & Google Drive sharing instructions
├── 📁 06_GitHub/
│   ├── GITHUB_SETUP.md            # Git commit and push guide
│   ├── REPOSITORY_LINK.txt        # Repository URL format & instructions
│   └── .gitignore
└── 📁 07_Resume/
    ├── RESUME_SATVIK_SHARMA.md    # Tailored ATS-friendly Full Stack AI Resume
    └── INSTRUCTIONS_RESUME.md     # PDF export & submission instructions
```

---

## ⚙️ 7. Setup & Run Instructions

### 1. Run the Backend
```bash
cd FullStack_Chatbot_Task_Satvik_Sharma/01_Source_Code/backend
npm install
npm run seed      # Populates database with sample leads
npm run dev       # Starts backend on http://localhost:5000
```

### 2. Run the Frontend
```bash
cd FullStack_Chatbot_Task_Satvik_Sharma/01_Source_Code/frontend
npm install
npm run dev       # Starts frontend on http://localhost:5173
```

---

## 📡 8. API Endpoints Table (Part 4)

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/enquiries` | Get all enquiries (with search & filters) |
| `GET` | `/api/enquiries/:id` | Get a single enquiry (404 on invalid ID) |
| `POST` | `/api/enquiries` | Create a new enquiry |
| `PUT` | `/api/enquiries/:id` | Update an enquiry |
| `PATCH` | `/api/enquiries/:id` | Update an enquiry |
| `DELETE` | `/api/enquiries/:id` | Delete an enquiry |
| `GET` | `/api/enquiries/stats` | Aggregated dashboard metrics |
| `GET` | `/api/enquiries/export/csv` | Export all leads as CSV |
| `POST` | `/api/chatbot/message` | Query predefined chatbot rules |
| `POST` | `/api/chatbot/lead` | Fast-track conversational lead capture |

---

## 👨‍💻 Candidate Details
- **Name:** Satvik Sharma
- **Email:** `sharmasatvik159@gmail.com`
- **Submission:** Full Stack Developer Intern — Technical Assignment (IPAGE Group)
