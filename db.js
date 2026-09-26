import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables (.env)
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_API_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Creates and returns a Supabase client safely.
 * @param {string} [url] - Optional Supabase Project URL
 * @param {string} [key] - Optional Supabase Anon/API Key
 * @returns {import('@supabase/supabase-js').SupabaseClient | null}
 */
export function getSupabaseClient(url = supabaseUrl, key = supabaseKey) {
  if (!url || !key) {
    return null;
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: true,
    },
  });
}

// Default client instance (if credentials exist)
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Simple test function
export async function testConnection(url = supabaseUrl, key = supabaseKey) {
  const client = getSupabaseClient(url, key);
  if (!client) {
    console.warn('⚠️ Supabase credentials missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env or pass them directly.');
    return { success: false, message: 'Missing URL or Key' };
  }

  try {
    const { data, error } = await client.from('appointments').select('*').limit(1);
    if (error) {
      console.log('ℹ️ Connected to Supabase, query status:', error.message);
      return { success: true, message: error.message };
    }
    console.log('✅ Connected to Supabase successfully! Sample data:', data);
    return { success: true, data };
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    return { success: false, error: err.message };
  }
}

// Auto-run test if invoked directly via CLI (node db.js)
if (process.argv[1]?.endsWith('db.js')) {
  console.log('🔍 Testing Supabase connection...');
  testConnection();
}

export default supabase;
