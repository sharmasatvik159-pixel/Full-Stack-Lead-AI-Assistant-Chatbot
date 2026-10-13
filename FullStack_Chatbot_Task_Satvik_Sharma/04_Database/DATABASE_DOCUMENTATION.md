# DroneTV Database Documentation & Schema Specifications

**Project:** `FullStack_Chatbot_Task_Satvik_Sharma`  
**Candidate:** Satvik Sharma (`sharmasatvik159@gmail.com`)  
**Assessment:** IPAGE Group Full Stack Developer Intern — Technical Assignment (Part 5)  

---

## 1. Database Overview & Technology Support

In accordance with **Part 5 — Database** of the technical assignment brief:
> *"Use one database technology — PostgreSQL, MySQL, or MongoDB — with an appropriate structure for storing enquiries. Candidates should demonstrate a working database connection, full CRUD operations, input validation, and appropriate error handling."*

To ensure the evaluator can run and inspect the application immediately without requiring local PostgreSQL/MySQL database server installation or Docker daemon setups, the application runs on **SQLite 3.x (with WAL mode)** out-of-the-box, and includes ready-to-run schema definitions for **PostgreSQL**, **MySQL**, and **MongoDB**.

All implementations enforce the exact fields required by Part 3 & Part 6:
- `id` (Primary Key)
- `name` (String, required)
- `email` (String, required)
- `phone` (String, required)
- `user_type` (`Student` / `Customer` / `Other`)
- `course_or_service` (Service or course of interest)
- `category` (DGCA Training / Commercial Services / etc.)
- `city` (Location)
- `message` (Inquiry notes)
- `status` (`New`, `Contacted`, `In Progress`, `Closed`)
- `priority` (`Low`, `Medium`, `High`)
- `source` (`chatbot`, `website_form`, `direct_portal`)
- `admin_notes` (Counselor tracking notes)
- `created_at` & `updated_at` (Timestamps)

---

## 2. Included Database Files

| File | Purpose |
| :--- | :--- |
| `dronetv_leads.sqlite` | Active, pre-seeded SQLite database with 8 sample leads |
| `schema.sql` | DDL table creation and index script for SQLite |
| `seed.sql` | SQL seed script populating realistic sample leads |
| `schema_postgresql.sql` | Production PostgreSQL DDL schema with check constraints & indexes |
| `schema_mysql.sql` | Production MySQL 8.x schema with InnoDB engine and ENUM definitions |
| `mongodb_schema.js` | Production Mongoose schema for MongoDB with schema indexes |

---

## 3. Database Table Definition: `enquiries`

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` / `SERIAL` | PRIMARY KEY AUTOINCREMENT | Unique ID |
| `name` | `VARCHAR(150)` | NOT NULL | Full Name |
| `email` | `VARCHAR(150)` | NOT NULL | Verified Email |
| `phone` | `VARCHAR(50)` | NOT NULL | Phone / WhatsApp |
| `user_type` | `VARCHAR(20)` | `CHECK(user_type IN ('Student', 'Customer', 'Other'))` | User Classification |
| `city` | `VARCHAR(100)` | DEFAULT 'Not Specified' | Location |
| `category` | `VARCHAR(100)` | NOT NULL | Business Category |
| `course_or_service` | `VARCHAR(255)` | DEFAULT 'General Inquiry' | Specific Program / Package |
| `message` | `TEXT` | DEFAULT '' | User Inquiry Message |
| `status` | `VARCHAR(20)` | `CHECK(status IN ('New', 'Contacted', 'In Progress', 'Closed'))` | Enquiry Pipeline Status |
| `priority` | `VARCHAR(10)` | `CHECK(priority IN ('Low', 'Medium', 'High'))` | Triage Priority |
| `source` | `VARCHAR(30)` | `CHECK(source IN ('chatbot', 'website_form', 'direct_portal'))` | Channel |
| `admin_notes` | `TEXT` | DEFAULT '' | Internal Counselor Notes |
| `created_at` | `TIMESTAMP` | DEFAULT CURRENT_TIMESTAMP | Created Date |
| `updated_at` | `TIMESTAMP` | DEFAULT CURRENT_TIMESTAMP | Modified Date |

---

## 4. Query & Inspection Instructions

### SQLite (Current Runtime)
```bash
sqlite3 dronetv_leads.sqlite
SELECT id, name, user_type, category, status FROM enquiries ORDER BY id DESC;
```

### PostgreSQL Setup
```bash
psql -U postgres -d dronetv_db -f schema_postgresql.sql
```

### MySQL Setup
```bash
mysql -u root -p dronetv_db < schema_mysql.sql
```
