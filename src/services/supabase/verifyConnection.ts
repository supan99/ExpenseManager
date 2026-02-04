import { supabase } from './index';

/**
 * Verify Supabase connection and configuration
 * This function can be called during app initialization to ensure Supabase is properly configured
 * 
 * @returns Promise<boolean> - Returns true if connection is successful, false otherwise
 */
export const verifySupabaseConnection = async (): Promise<boolean> => {
  try {
    // Check if supabase is available
    if (!supabase) {
      console.error('❌ Supabase client is not initialized');
      return false;
    }

    // Try to get the current session (this will fail gracefully if not configured)
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      if (error.message.includes('Invalid API key')) {
        console.error('❌ Supabase connection failed: Invalid API key');
        return false;
      }
      // Other errors might be okay (e.g., no session)
      console.warn('⚠️ Supabase session check warning:', error.message);
    }
    
    // If we get here, Supabase is configured correctly
    // (session might be null, which is fine - it just means no user is logged in)
    console.log('✅ Supabase connection verified successfully');
    return true;
  } catch (error: any) {
    const errorMessage = error?.message || 'Unknown error';
    console.error('❌ Supabase connection failed:', errorMessage);
    
    // Check if it's an initialization error
    if (errorMessage.includes('Missing Supabase environment variables')) {
      console.error('💡 Make sure your .env file contains SUPABASE_URL and SUPABASE_ANON_KEY');
      console.error('💡 You may need to restart Metro bundler after adding .env variables');
    }
    
    return false;
  }
};

/**
 * Get Supabase configuration status
 * Useful for debugging configuration issues
 */
export const getSupabaseConfigStatus = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  
  return {
    urlConfigured: Boolean(url && url !== ''),
    keyConfigured: Boolean(key && key !== ''),
    urlPreview: url ? `${url.substring(0, 20)}...` : 'Not configured',
    keyPreview: key ? `${key.substring(0, 20)}...` : 'Not configured',
  };
};
