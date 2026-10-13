-- DroneTV AI Support & Lead Assistant Database Schema (PostgreSQL)
-- Author: Satvik Sharma (sharmasatvik159@gmail.com)
-- Project: FullStack_Chatbot_Task_Satvik_Sharma

DROP TABLE IF EXISTS enquiries CASCADE;

CREATE TABLE enquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  user_type VARCHAR(20) DEFAULT 'Customer' CHECK(user_type IN ('Student', 'Customer', 'Other')),
  city VARCHAR(100) DEFAULT 'Not Specified',
  category VARCHAR(100) NOT NULL CHECK(category IN (
    'DGCA Pilot Training',
    'Commercial Drone Services',
    'Drone Rentals & Sales',
    'College / Student Academy',
    'Regulatory & DigitalSky Guidance',
    'General Enquiry'
  )),
  course_or_service VARCHAR(255) DEFAULT 'General Inquiry',
  message TEXT DEFAULT '',
  status VARCHAR(20) DEFAULT 'New' CHECK(status IN (
    'New',
    'Contacted',
    'In Progress',
    'Closed'
  )),
  priority VARCHAR(10) DEFAULT 'Medium' CHECK(priority IN (
    'Low',
    'Medium',
    'High'
  )),
  source VARCHAR(30) DEFAULT 'website_form' CHECK(source IN (
    'chatbot',
    'website_form',
    'direct_portal'
  )),
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX idx_pg_enquiries_category ON enquiries(category);
CREATE INDEX idx_pg_enquiries_status ON enquiries(status);
CREATE INDEX idx_pg_enquiries_user_type ON enquiries(user_type);
CREATE INDEX idx_pg_enquiries_created_at ON enquiries(created_at);
