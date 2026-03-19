import { createClient } from '@supabase/supabase-js';

let cachedClient = null;

const resolveSupabaseUrl = () => (
  String(
    process.env.SUPABASE_URL ||
    process.env.VITE_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    ''
  ).trim()
);

const resolveServiceRoleKey = () => (
  String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
);

export const getSupabaseAdmin = () => {
  if (cachedClient) return cachedClient;

  const supabaseUrl = resolveSupabaseUrl();
  const serviceRoleKey = resolveServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  cachedClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedClient;
};
