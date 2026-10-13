-- DroneTV AI Support & Lead Assistant Database Schema (SQLite 3.x)
-- Author: Satvik Sharma (sharmasatvik159@gmail.com)
-- Project: FullStack_Chatbot_Task_Satvik_Sharma

DROP TABLE IF EXISTS enquiries;

CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  user_type TEXT DEFAULT 'Customer' CHECK(user_type IN ('Student', 'Customer', 'Other')),
  city TEXT DEFAULT 'Not Specified',
  category TEXT NOT NULL CHECK(category IN (
    'DGCA Pilot Training',
    'Commercial Drone Services',
    'Drone Rentals & Sales',
    'College / Student Academy',
    'Regulatory & DigitalSky Guidance',
    'General Enquiry'
  )),
  course_or_service TEXT DEFAULT 'General Inquiry',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'New' CHECK(status IN (
    'New',
    'Contacted',
    'In Progress',
    'Closed'
  )),
  priority TEXT DEFAULT 'Medium' CHECK(priority IN (
    'Low',
    'Medium',
    'High'
  )),
  source TEXT DEFAULT 'website_form' CHECK(source IN (
    'chatbot',
    'website_form',
    'direct_portal'
  )),
  admin_notes TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_enquiries_category ON enquiries(category);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_user_type ON enquiries(user_type);
CREATE INDEX IF NOT EXISTS idx_enquiries_priority ON enquiries(priority);
CREATE INDEX IF NOT EXISTS idx_enquiries_source ON enquiries(source);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at);
