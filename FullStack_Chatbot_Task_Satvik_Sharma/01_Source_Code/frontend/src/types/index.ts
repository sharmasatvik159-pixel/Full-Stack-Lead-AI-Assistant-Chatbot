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

export interface EnquiryStats {
  total: number;
  new: number;
  contacted: number;
  inProgress: number;
  closed: number;
  byCategory: { category: string; count: number }[];
  byUserType: { user_type: string; count: number }[];
  bySource: { source: string; count: number }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  actionPrompt?: string;
  isLeadCapturePrompt?: boolean;
}
