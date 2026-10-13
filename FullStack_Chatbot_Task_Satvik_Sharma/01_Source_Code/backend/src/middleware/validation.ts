import { Request, Response, NextFunction } from 'express';
import { EnquiryCategory, EnquiryStatus, EnquiryPriority, UserType } from '../types/enquiry';

const VALID_CATEGORIES: EnquiryCategory[] = [
  'DGCA Pilot Training',
  'Commercial Drone Services',
  'Drone Rentals & Sales',
  'College / Student Academy',
  'Regulatory & DigitalSky Guidance',
  'General Enquiry'
];

const VALID_USER_TYPES: UserType[] = ['Student', 'Customer', 'Other'];

const VALID_STATUSES: EnquiryStatus[] = [
  'New',
  'Contacted',
  'In Progress',
  'Closed'
];

const VALID_PRIORITIES: EnquiryPriority[] = ['Low', 'Medium', 'High'];

// RFC 5322 standard compatible email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Minimum 10 digits phone regex supporting +91, spaces, hyphens
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{8,15}$/;

export function validateCreateEnquiry(req: Request, res: Response, next: NextFunction): void {
  const { name, email, phone, category, user_type } = req.body;
  const errors: string[] = [];

  // 1. Validate & Sanitize Name
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters.');
  }

  // 2. Validate Email
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required (e.g. name@example.com).');
  }

  // 3. Validate Phone
  if (!phone || typeof phone !== 'string' || !PHONE_REGEX.test(phone.trim())) {
    errors.push('A valid phone or WhatsApp number is required (at least 10 digits).');
  }

  // 4. Validate Category
  if (!category || !VALID_CATEGORIES.includes(category as EnquiryCategory)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  // 5. Validate User Type
  if (user_type && !VALID_USER_TYPES.includes(user_type as UserType)) {
    errors.push(`User type must be one of: ${VALID_USER_TYPES.join(', ')}`);
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed for enquiry submission.',
      errors
    });
    return;
  }

  // Sanitize inputs onto req.body
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.phone = phone.trim();
  req.body.user_type = VALID_USER_TYPES.includes(user_type) ? user_type : 'Customer';
  req.body.city = (req.body.city || 'Not Specified').trim();
  req.body.course_or_service = (req.body.course_or_service || 'General Inquiry').trim();
  req.body.message = (req.body.message || '').trim();
  req.body.priority = VALID_PRIORITIES.includes(req.body.priority) ? req.body.priority : 'Medium';
  req.body.source = ['chatbot', 'website_form', 'direct_portal'].includes(req.body.source) ? req.body.source : 'website_form';

  next();
}

export function validateUpdateEnquiry(req: Request, res: Response, next: NextFunction): void {
  const { status, priority, user_type } = req.body;
  const errors: string[] = [];

  if (status && !VALID_STATUSES.includes(status as EnquiryStatus)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (priority && !VALID_PRIORITIES.includes(priority as EnquiryPriority)) {
    errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }

  if (user_type && !VALID_USER_TYPES.includes(user_type as UserType)) {
    errors.push(`User type must be one of: ${VALID_USER_TYPES.join(', ')}`);
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed for update.',
      errors
    });
    return;
  }

  next();
}
