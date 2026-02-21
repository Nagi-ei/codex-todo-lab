import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/lib/supabase/env";

export function createSupabaseAdminClient() {
  const { supabaseUrl } = getSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

  if (!serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function shouldAutoConfirmEmails() {
  if (process.env.SUPABASE_AUTO_CONFIRM_EMAILS === "true") {
    return true;
  }

  return process.env.NODE_ENV !== "production";
}
