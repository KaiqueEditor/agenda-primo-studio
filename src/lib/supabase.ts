import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eqndkrurbrfkvsywlatt.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7hviUsdyG9stubaA1jJtIA_FBN1eFrs';

export const supabase = createClient(supabaseUrl, supabaseKey);
