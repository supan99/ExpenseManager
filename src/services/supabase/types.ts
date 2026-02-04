/**
 * Supabase-specific types for the ExpenseManager application
 */

export interface SupabaseUser {
  id: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at?: string;
  app_metadata?: Record<string, any>;
  user_metadata?: {
    firstname?: string;
    lastname?: string;
    avatar?: string;
    phonenumber?: string;
    title?: string;
  };
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: SupabaseUser;
}
