"use server";

import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function updateInventoryNeedsReorder(
  id: string,
  needs_reorder: boolean,
): Promise<{ error: string | null }> {
  await connection();
  try {
    const { error } = await createSupabaseServerClient()
      .from("inventory_items")
      .update({ needs_reorder })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "不明なエラーが発生しました";
    return { error: message };
  }
}

// TODO: STEP 認証導入後は authenticated のみ・列単位の制限に差し替える
