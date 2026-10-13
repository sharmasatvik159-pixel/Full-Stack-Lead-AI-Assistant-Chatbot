# DroneTV AI Lead Assistant - Video Walkthrough Script (5–10 Minutes)

**Project Name:** `FullStack_Chatbot_Task_Satvik_Sharma`  
**Candidate Name:** Satvik Sharma  
**Email:** `sharmasatvik159@gmail.com`  
**Target Duration:** ~7 to 8 Minutes  
**Recommended Recording Tools:** OBS Studio, Loom, or Windows Game Bar (`Win + Alt + R`)

---

## 🕒 Timestamp Breakdown & Talking Points

### 0:00 – 1:00 | Introduction & Project Architecture Overview
- **Visual:** Display Landing page (`http://localhost:5173/`) and project directory in VS Code.
- **Presenter Script:**
  > "Hello everyone, my name is Satvik Sharma. Welcome to the walkthrough of my full stack submission: **DroneTV AI Support & Lead Assistant Web Application** (`FullStack_Chatbot_Task_Satvik_Sharma`).
  >
  > The problem this application solves is bridging the gap between prospective drone pilot candidates, commercial enterprise clients, and approved Remote Pilot Training Organisations (RPTOs).
  > 
  > The tech stack is:
  > - **Frontend:** React.js 19 with TypeScript and Vite, custom modern CSS design system with glassmorphic cards and micro-animations.
  > - **Chatbot:** Rule-based AI assistant ('AeroBot') equipped with NLP keyword matching, topic recognition, and conversational lead capture.
  > - **Backend:** Node.js and Express with TypeScript, RESTful endpoints, Helmet security, rate limiting, and input sanitization.
  > - **Database:** SQLite with WAL mode via `better-sqlite3`, providing zero-setup persistence and high performance."

---

### 1:00 – 2:30 | Customer Portal & Drone Ecosystem Features
- **Visual:** Scroll through the Hero Section and the 6 Ecosystem Cards.
- **Presenter Script:**
  > "Here on the home portal, users see real-time statistics—such as over 5,000 pilots certified and a 98.4% first-attempt pass rate.
  > 
  > In the Ecosystem Grid, we cover the real pillars of DroneTV India:
  > 1. Small Category DGCA Remote Pilot Certification (5 days)
  > 2. Medium Category Pilot Training (25kg to 150kg heavy lift)
  > 3. Turnkey Commercial Surveying & 3D Topographic GIS Mapping
  > 4. Agricultural Spraying & Multispectral Crop Scouting
  > 5. Industrial & Solar Farm Thermographic Audits
  > 6. College Drone Labs and Student UAV Centres of Excellence.
  >
  > Every card provides a direct action to either enquire or trigger a deep-dive conversation with AeroBot."

---

### 2:30 – 4:15 | AeroBot Functional Rule-Based Chatbot & Lead Capture Flow
- **Visual:** Click the floating AeroBot widget at bottom right; demonstrate chat interaction.
- **Presenter Script:**
  > "Now let's test our rule-based chatbot: **AeroBot**.
  > 
  > Notice the online indicator and quick reply suggestion chips. When I ask: *'What is the syllabus and fees for DGCA small category training?'*, the backend rule engine evaluates keywords, scores the best match, and delivers a formatted breakdown covering theory, simulator flying, DGCA medical requirements, and pricing.
  > 
  > More importantly, AeroBot features **conversational lead capture**. When an intent like 'Register for Pilot Training' or 'Request Callback' is detected, an inline fast-track form activates directly within the chat window.
  > 
  > Let's test submitting an enquiry for Satvik Sharma with phone number and email. Upon submission, the client-side validation runs, the backend records the lead via `/api/chatbot/lead`, celebratory confetti fires, and an enquiry reference number is generated."

---

### 4:15 – 5:15 | Portal Lead Form & Validation Handling
- **Visual:** Click 'Enquire Now' in the navbar to open the modal. Show field validation.
- **Presenter Script:**
  > "Next, let's test our dedicated **Course & Service Enquiry Modal**.
  > 
  > Watch what happens when I try to submit invalid data:
  > - An invalid email or phone number triggers instant inline validation alerts with clear red indicators.
  > - The program dropdown dynamically updates based on the selected category (e.g. selecting 'DGCA Pilot Training' shows RPC courses; selecting 'Commercial Services' shows Topographic Survey and Agri Spraying).
  > - Once submitted, it saves to the SQLite database and issues a confirmed tracking reference."

---

### 5:15 – 6:45 | Admin CRM Dashboard, Search, Filtering & CRUD
- **Visual:** Switch view to **Admin Dashboard**.
- **Presenter Script:**
  > "Now let's switch over to the **Admin Enquiry CRM Dashboard**.
  > 
  > At the top, we have real-time KPI metrics calculated live by the backend: Total Leads, New/Pending Leads, In Progress, Converted/Enrolled, and the dynamic Conversion Rate percentage.
  > 
  > Below, we have high-performance search and filtering:
  > - I can search across names, phone numbers, or cities in real time.
  > - I can filter by Category (e.g., only DGCA Pilot Training), Status (New, Contacted, In Progress, Enrolled, Closed), Priority, or Source channel (AeroBot vs Web Form).
  > 
  > In the leads table, admins have full CRUD capabilities:
  > 1. **Inline Status Updates:** With one click on the dropdown, an enquiry's status changes from 'New' to 'In Progress', instantly updating backend metrics.
  > 2. **Notes & Details Modal:** Clicking Edit opens the counselor notes editor to log call logs or quotes.
  > 3. **Delete:** Safe removal with confirmation dialog.
  > 4. **Export CSV:** Clicking 'Export CSV' generates a clean RFC-compliant spreadsheet with all leads for CRM export."

---

### 6:45 – 7:45 | Codebase Walkthrough & Security Best Practices
- **Visual:** Show backend code in VS Code: `server.ts`, `validation.ts`, `connection.ts`, `chatbotController.ts`.
- **Presenter Script:**
  > "Taking a quick look under the hood:
  > - In `server.ts`, we implement Helmet for secure headers, CORS restrictions, body size limits, and `express-rate-limit` to defend against abuse.
  > - In `validation.ts`, all inputs are sanitized and checked against regex rules before hitting the database.
  > - The SQLite database utilizes WAL mode for ACID compliance and concurrency.
  > - No credentials or secrets are committed; everything is environment-variable driven.
  > 
  > Thank you very much for watching! The complete code, documentation, schema, and screenshots are organized inside `FullStack_Chatbot_Task_Satvik_Sharma`."
