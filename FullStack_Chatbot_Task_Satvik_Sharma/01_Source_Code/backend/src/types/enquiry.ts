export type EnquiryCategory = 
  | 'DGCA Pilot Training' 
  | 'Commercial Drone Services' 
  | 'Drone Rentals & Sales' 
  | 'College / Student Academy' 
  | 'Regulatory & DigitalSky Guidance'
  | 'General Enquiry';

export type UserType = 'Student' | 'Customer' | 'Other';

export type EnquiryStatus = 
  | 'New' 
  | 'Contacted' 
  | 'In Progress' 
  | 'Closed';

export type EnquiryPriority = 'Low' | 'Medium' | 'High';

export type EnquirySource = 'chatbot' | 'website_form' | 'direct_portal';

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  user_type: UserType;
  city: string;
  category: EnquiryCategory;
  course_or_service: string;
  message?: string;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  source: EnquirySource;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEnquiryInput {
  name: string;
  email: string;
  phone: string;
  user_type?: UserType;
  city?: string;
  category: EnquiryCategory;
  course_or_service?: string;
  message?: string;
  source?: EnquirySource;
  priority?: EnquiryPriority;
}

export interface UpdateEnquiryInput {
  status?: EnquiryStatus;
  user_type?: UserType;
  priority?: EnquiryPriority;
  admin_notes?: string;
  course_or_service?: string;
  category?: EnquiryCategory;
}

export interface EnquiryFilterParams {
  search?: string;
  category?: string;
  user_type?: string;
  status?: string;
  priority?: string;
  source?: string;
  sortBy?: 'created_at' | 'name' | 'priority' | 'status' | 'id';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}
