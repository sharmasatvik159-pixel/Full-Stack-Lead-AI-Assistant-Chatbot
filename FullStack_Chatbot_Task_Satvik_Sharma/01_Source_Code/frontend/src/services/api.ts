import { Enquiry, CreateEnquiryInput, EnquiryStats, UserType } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function fetchEnquiries(params?: {
  search?: string;
  category?: string;
  user_type?: string;
  status?: string;
  priority?: string;
  source?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Enquiry[]; pagination: any }> {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
  }

  const response = await fetch(`${API_BASE}/enquiries?${query.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch enquiries: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchEnquiryStats(): Promise<{ stats: EnquiryStats }> {
  const response = await fetch(`${API_BASE}/enquiries/stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.statusText}`);
  }
  return response.json();
}

export async function createEnquiry(input: CreateEnquiryInput): Promise<{ success: boolean; data: Enquiry; message: string }> {
  const response = await fetch(`${API_BASE}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || (data.errors && data.errors.join(', ')) || 'Failed to submit enquiry');
  }
  return data;
}

export async function updateEnquiry(
  id: number,
  updates: Partial<Enquiry>
): Promise<{ success: boolean; data: Enquiry; message: string }> {
  const response = await fetch(`${API_BASE}/enquiries/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update enquiry');
  }
  return data;
}

export async function deleteEnquiry(id: number): Promise<{ success: boolean; deletedId: number }> {
  const response = await fetch(`${API_BASE}/enquiries/${id}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete enquiry');
  }
  return data;
}

export function getExportCsvUrl(): string {
  return `${API_BASE}/enquiries/export/csv`;
}

export async function sendChatMessage(message: string): Promise<any> {
  const response = await fetch(`${API_BASE}/chatbot/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  if (!response.ok) {
    throw new Error('Failed to communicate with DroneTV chat assistant');
  }
  return response.json();
}

export async function submitChatLead(leadData: {
  name: string;
  email: string;
  phone: string;
  user_type?: UserType;
  city?: string;
  category?: string;
  course_or_service?: string;
  message?: string;
}): Promise<any> {
  const response = await fetch(`${API_BASE}/chatbot/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to submit chat lead');
  }
  return data;
}
