import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import type { Database } from "@/types/database";

let supabase: SupabaseClient<Database> | undefined;

// Supabase クライアントを取得する（初回アクセス時に初期化）
export function createClient(): SupabaseClient<Database> {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を設定してください",
      );
    }

    supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  return supabase;
}
