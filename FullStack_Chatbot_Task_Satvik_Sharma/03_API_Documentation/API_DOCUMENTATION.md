# DroneTV API Documentation

**Project:** `FullStack_Chatbot_Task_Satvik_Sharma`  
**Candidate:** Satvik Sharma (`sharmasatvik159@gmail.com`)  
**Base URL:** `http://localhost:5000/api`  
**Protocol:** RESTful JSON over HTTP  

---

## 1. System Overview & Security Best Practices

Built with **Node.js, Express, and TypeScript**, supporting **SQLite** (out-of-the-box zero setup), **PostgreSQL**, **MySQL**, and **MongoDB**.

### Security & Error Handling (PDF Parts 7 & 8):
1. **Input Validation on Both Frontend & Backend:** All endpoints validate required fields, RFC email structure, 10+ digit phone numbers, and whitelisted enum categories/user types.
2. **Sensitive Error Masking:** Stack traces and database internals are never returned in client HTTP responses. Internal exceptions log safely to the server console and return a clean error description with appropriate HTTP status codes (400, 404, 500).
3. **Non-Existing Resource Protection:** `GET /api/enquiries/:id`, `PUT /api/enquiries/:id`, `PATCH /api/enquiries/:id`, and `DELETE /api/enquiries/:id` return standard `404 Not Found` when passed a non-existing ID.
4. **Helmet Security Headers:** Defends against clickjacking, MIME sniffing, and XSS.
5. **Rate Limiting:** Protects against abuse (300 requests / 15 minutes window via `express-rate-limit`).
6. **No Hardcoded Credentials:** Managed strictly via `.env` configuration.

---

## 2. API Endpoints Reference

### 2.1 Health Check
#### `GET /api/health`
Checks server and database connection health.

- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "timestamp": "2026-10-13T14:15:00.000Z",
  "service": "DroneTV AI Lead Assistant Backend",
  "version": "1.0.0",
  "developer": "Satvik Sharma <sharmasatvik159@gmail.com>"
}
```

---

### 2.2 Enquiries REST Endpoints (CRUD)

#### `GET /api/enquiries`
Retrieves a paginated list of leads with search and multi-criteria filters.

- **Query Parameters:**
  - `search` *(string, optional)*: Search across Name, Email, Phone, City, Notes.
  - `user_type` *(string, optional)*: Filter by `Student`, `Customer`, or `Other`.
  - `category` *(string, optional)*: Filter by category (e.g., `DGCA Pilot Training`).
  - `status` *(string, optional)*: Filter by `New`, `Contacted`, `In Progress`, or `Closed`.
  - `priority` *(string, optional)*: Filter by `Low`, `Medium`, or `High`.
  - `source` *(string, optional)*: Filter by `chatbot`, `website_form`, or `direct_portal`.
  - `page` *(number, default: `1`)*: Page number.
  - `limit` *(number, default: `50`)*: Records per page.

- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Rohan Deshmukh",
      "email": "rohan.deshmukh@gmail.com",
      "phone": "+91 98234 56789",
      "user_type": "Student",
      "city": "Pune",
      "category": "DGCA Pilot Training",
      "course_or_service": "Small Category RPC Certification (5 Days)",
      "message": "Looking to get DGCA certified for aerial mapping.",
      "status": "New",
      "priority": "High",
      "source": "chatbot",
      "admin_notes": "Urgent: Candidate wants to join upcoming weekend batch.",
      "created_at": "2026-10-13T12:00:00.000Z",
      "updated_at": "2026-10-13T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 50,
    "totalPages": 1
  }
}
```

---

#### `GET /api/enquiries/:id`
Retrieves a single enquiry by its unique ID.

- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Rohan Deshmukh",
    "email": "rohan.deshmukh@gmail.com",
    "phone": "+91 98234 56789",
    "user_type": "Student",
    "status": "New"
  }
}
```

- **Response `404 Not Found` (when ID does not exist)**:
```json
{
  "success": false,
  "message": "Enquiry with ID 999999 not found."
}
```

---

#### `POST /api/enquiries`
Creates a new customer, student, or corporate enquiry.

- **Request Body:**
```json
{
  "name": "Satvik Sharma",
  "email": "sharmasatvik159@gmail.com",
  "phone": "+91 98765 43210",
  "user_type": "Student",
  "city": "Bengaluru",
  "category": "DGCA Pilot Training",
  "course_or_service": "Small Category RPC Certification (5 Days)",
  "message": "Interested in October batch registration.",
  "priority": "Medium",
  "source": "website_form"
}
```

- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Enquiry submitted successfully! A DroneTV advisor will connect with you shortly.",
  "data": {
    "id": 9,
    "name": "Satvik Sharma",
    "email": "sharmasatvik159@gmail.com",
    "phone": "+91 98765 43210",
    "user_type": "Student",
    "status": "New",
    "created_at": "2026-10-13T14:15:00.000Z"
  }
}
```

---

#### `PUT /api/enquiries/:id` AND `PATCH /api/enquiries/:id`
Updates an enquiry's status, notes, priority, or user type.

- **Request Body:**
```json
{
  "status": "In Progress",
  "user_type": "Student",
  "admin_notes": "Conducted orientation call. Sent fee breakdown via WhatsApp."
}
```

- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Enquiry updated successfully",
  "data": {
    "id": 1,
    "status": "In Progress",
    "user_type": "Student",
    "admin_notes": "Conducted orientation call. Sent fee breakdown via WhatsApp."
  }
}
```

---

#### `DELETE /api/enquiries/:id`
Deletes an enquiry record permanently.

- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Enquiry #1 deleted successfully.",
  "deletedId": 1
}
```

---

#### `GET /api/enquiries/stats`
Provides aggregated statistics for the Admin CRM dashboard.

- **Response `200 OK`**:
```json
{
  "success": true,
  "stats": {
    "total": 8,
    "new": 2,
    "contacted": 2,
    "inProgress": 3,
    "closed": 1,
    "byUserType": [
      { "user_type": "Student", "count": 3 },
      { "user_type": "Customer", "count": 4 },
      { "user_type": "Other", "count": 1 }
    ],
    "byCategory": [
      { "category": "DGCA Pilot Training", "count": 2 },
      { "category": "Commercial Drone Services", "count": 4 }
    ]
  }
}
```

---

#### `GET /api/enquiries/export/csv`
Downloads an RFC-compliant `.csv` file with all database records.

---

### 2.3 Chatbot Rule Engine & Fast-Track Lead Endpoints

#### `POST /api/chatbot/message`
Processes questions against the knowledge base and the exact 7 predefined questions from the assessment brief.

- **Request Body:**
```json
{
  "message": "What services does DroneTV provide?"
}
```

- **Response `200 OK`**:
```json
{
  "success": true,
  "type": "match",
  "data": {
    "id": "services_overview",
    "title": "Commercial Drone Services Overview",
    "category": "Commercial Drone Services",
    "response": "🛰️ **DroneTV Commercial Drone Services:**\n\n1. Aerial Surveying & 3D GIS Mapping...",
    "quickReplies": [
      "I am interested in a service.",
      "What courses / training are available?",
      "How can I register?",
      "How can I contact DroneTV?"
    ],
    "actionPrompt": "lead_capture:service"
  }
}
```

---

#### `POST /api/chatbot/lead`
Captures enquiries directly from the chat interface.

- **Request Body:**
```json
{
  "name": "Satvik Sharma",
  "email": "sharmasatvik159@gmail.com",
  "phone": "+91 98765 43210",
  "user_type": "Student",
  "category": "DGCA Pilot Training",
  "course_or_service": "Small Category RPC Certification (5 Days)",
  "message": "Interested in pilot training"
}
```

- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Thank you Satvik Sharma! Your enquiry (#10) as a Student has been registered.",
  "lead": {
    "id": 10,
    "name": "Satvik Sharma",
    "user_type": "Student",
    "status": "New",
    "source": "chatbot"
  }
}
```
