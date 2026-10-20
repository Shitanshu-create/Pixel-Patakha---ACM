import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseKey, isSupabaseConfigured } from './env.js';

let supabaseClient = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('[Supabase] Client initialized successfully');
  } catch (err) {
    console.error('[Supabase] Initialization failed:', err.message);
  }
} else {
  console.log('[Supabase] SUPABASE_URL or SUPABASE_KEY missing. Falling back to local storage.');
}

export default supabaseClient;
