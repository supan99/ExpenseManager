export interface Contact {
  id: number;
  userid: number;
  client_id: number;
  role_id: number;
  firstname: string;
  lastname: string;
  phonenumber: string;
  title: string;
  email: string;
  profile_image: string | null;
  direction: string | null;
  email_verified_at: string | null;
  is_primary: number;
  created_by: number;
  updated_by: number | null;
  invoice_emails: number;
  estimate_emails: number;
  credit_note_emails: number;
  contract_emails: number;
  task_emails: number;
  project_emails: number;
  ticket_emails: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  firstname?: string;
  lastname?: string;
  phonenumber?: string;
  title?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  contact: Contact;
  access_token: string;
  token_type: string;
}

export interface LoginResponse {
  data: LoginResponseData;
}

export interface Lead {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  avatar?: string | null;
  lead_source_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LeadsResponse {
  data: Lead[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ExpenseFormData {
  title: string;
  amount: string;
  date: string;
  category: string;
  receiptImage: string | null;
  notes: string;
}

export interface OCRResult {
  amount?: string;
  date?: string;
  merchant?: string;
  category?: string;
  success: boolean;
  error?: string;
}
