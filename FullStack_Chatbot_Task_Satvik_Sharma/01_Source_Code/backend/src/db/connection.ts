import Database from 'better-sqlite3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DATABASE_FILE 
  ? path.resolve(process.cwd(), process.env.DATABASE_FILE)
  : path.resolve(process.cwd(), 'dronetv_leads.sqlite');

export const db = new Database(dbPath);

// Enable WAL mode for high performance & reliability
db.pragma('journal_mode = WAL');

// Initialize database schema
export function initDatabase() {
  const tableSchema = `
    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      user_type TEXT DEFAULT 'Customer' CHECK(user_type IN ('Student', 'Customer', 'Other')),
      city TEXT DEFAULT 'Not Specified',
      category TEXT NOT NULL,
      course_or_service TEXT DEFAULT 'General Inquiry',
      message TEXT DEFAULT '',
      status TEXT DEFAULT 'New' CHECK(status IN ('New', 'Contacted', 'In Progress', 'Closed')),
      priority TEXT DEFAULT 'Medium' CHECK(priority IN ('Low', 'Medium', 'High')),
      source TEXT DEFAULT 'website_form' CHECK(source IN ('chatbot', 'website_form', 'direct_portal')),
      admin_notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.exec(tableSchema);

  // Safe column migration: if enquiries existed from previous schema without user_type
  const columns = db.pragma('table_info(enquiries)') as { name: string }[];
  const hasUserType = columns.some(c => c.name === 'user_type');
  if (!hasUserType) {
    try {
      db.exec("ALTER TABLE enquiries ADD COLUMN user_type TEXT DEFAULT 'Customer'");
      console.log("[DB] Added missing 'user_type' column to enquiries table.");
    } catch (e: any) {
      console.warn('[DB] Migration note:', e.message);
    }
  }

  // Create performance indexes after verifying columns exist
  const indexSchema = `
    CREATE INDEX IF NOT EXISTS idx_enquiries_category ON enquiries(category);
    CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
    CREATE INDEX IF NOT EXISTS idx_enquiries_user_type ON enquiries(user_type);
    CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at);
  `;
  db.exec(indexSchema);

  console.log(`[DB] Database verified successfully at ${dbPath}`);
}
