import { createClient, SupabaseClient } from '@supabase/supabase-js';
import '@/configs/dotenv.config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Warning: Supabase credentials not configured. Storage features will be disabled.');
}

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

export const PROFILE_PICTURE_BUCKET = 'profile-picture';
export const RESUME_BUCKET = 'resume';
export const COMPANY_LOGO_BUCKET = 'company-logo';

export default supabase;
