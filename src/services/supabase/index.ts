// Ensure URL polyfill is loaded before Supabase imports
import 'react-native-url-polyfill/auto';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Initialize Supabase client
 * This function ensures the client is only created once and handles errors gracefully
 */
const initializeSupabase = (): SupabaseClient => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Access environment variables - react-native-dotenv should have loaded them
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage =
      'Missing Supabase environment variables. Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in your .env file.';
    console.error('❌', errorMessage);
    console.error('SUPABASE_URL:', supabaseUrl ? `Set (${supabaseUrl.substring(0, 30)}...)` : 'Missing');
    console.error('SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
    console.error('💡 Tip: Restart Metro bundler after adding/updating .env file');
    throw new Error(errorMessage);
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // React Native doesn't use URLs
      },
    });
    return supabaseInstance;
  } catch (error: any) {
    console.error('❌ Failed to create Supabase client:', error.message);
    throw error;
  }
};

// Initialize Supabase client
export const supabase: SupabaseClient = initializeSupabase();
