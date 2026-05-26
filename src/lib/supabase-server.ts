import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * サーバー専用の Supabase クライアント。
 * Docker など「ビルド後にだけ環境変数を注入する」運用では、
 * NEXT_PUBLIC_* はビルド時に固定されるため、ランタイム用に
 * SUPABASE_URL / SUPABASE_ANON_KEY を優先する。
 */
export function createSupabaseServerClient(): SupabaseClient<Database> {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase の接続情報が未設定です。.env に SUPABASE_URL と SUPABASE_ANON_KEY（開発時は NEXT_PUBLIC_* でも可）を設定してください。",
    );
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
