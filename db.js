import { createRequire } from 'module';
import dotenv from 'dotenv';
dotenv.config();

const require = createRequire(import.meta.url);
const module = { exports: {} };

// Step 1 & 2: Supabase connection matching Hostinger specifications
const { createClient } = require('@supabase/supabase-js');

const supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_API_KEY)
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_API_KEY
    )
  : createClient(
      process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_API_KEY || 'placeholder'
    );

// Test the connection
if (process.env.SUPABASE_URL && process.env.SUPABASE_API_KEY) {
  supabase
    .from('appointments')
    .select('*')
    .limit(1)
    .then(({ data, error }) => {
      if (error) console.error('Connection error:', error.message || error);
      else console.log('Connected:', data);
    })
    .catch((err) => {
      console.error('Connection error:', err);
    });
} else {
  console.log('ℹ️ Supabase client ready. Set SUPABASE_URL and SUPABASE_API_KEY in your environment to connect.');
}

module.exports = supabase;

export { createClient, supabase };
export default supabase;
