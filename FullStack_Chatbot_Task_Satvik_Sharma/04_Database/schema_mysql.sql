-- DroneTV AI Support & Lead Assistant Database Schema (MySQL 8.x)
-- Author: Satvik Sharma (sharmasatvik159@gmail.com)
-- Project: FullStack_Chatbot_Task_Satvik_Sharma

DROP TABLE IF EXISTS enquiries;

CREATE TABLE enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  user_type ENUM('Student', 'Customer', 'Other') DEFAULT 'Customer',
  city VARCHAR(100) DEFAULT 'Not Specified',
  category ENUM(
    'DGCA Pilot Training',
    'Commercial Drone Services',
    'Drone Rentals & Sales',
    'College / Student Academy',
    'Regulatory & DigitalSky Guidance',
    'General Enquiry'
  ) NOT NULL,
  course_or_service VARCHAR(255) DEFAULT 'General Inquiry',
  message TEXT,
  status ENUM('New', 'Contacted', 'In Progress', 'Closed') DEFAULT 'New',
  priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  source ENUM('chatbot', 'website_form', 'direct_portal') DEFAULT 'website_form',
  admin_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_mysql_category (category),
  INDEX idx_mysql_status (status),
  INDEX idx_mysql_user_type (user_type),
  INDEX idx_mysql_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
