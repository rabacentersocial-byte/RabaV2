// CommonJS version for Node.js scripts using require('@supabase/supabase-js')
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_API_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Creates and returns a Supabase client safely.
 * @param {string} [url]
 * @param {string} [key]
 * @returns {import('@supabase/supabase-js').SupabaseClient | null}
 */
function getSupabaseClient(url = supabaseUrl, key = supabaseKey) {
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

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

async function testConnection(url = supabaseUrl, key = supabaseKey) {
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

// Auto-run if invoked directly
if (process.argv[1] && process.argv[1].endsWith('db.cjs')) {
  console.log('🔍 Testing Supabase connection via CommonJS (require)...');
  testConnection();
}

module.exports = {
  createClient,
  supabase,
  getSupabaseClient,
  testConnection
};
