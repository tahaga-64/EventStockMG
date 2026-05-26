import "server-only";
import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Tables } from "@/types/database";
import type { InventoryItem } from "@/types/inventory";

type InventoryItemRow = Tables<"inventory_items">;

function toInventoryItem(row: InventoryItemRow): InventoryItem {
  return {
    id: row.id,
    name: row.name,
    location: row.location as InventoryItem["location"],
    quantity: row.quantity,
    max_quantity: row.max_quantity,
    needs_reorder: row.needs_reorder,
    category: row.category ?? undefined,
    updated_at: row.updated_at ?? "",
    updated_by: row.updated_by,
  };
}

export async function fetchInventoryItems(): Promise<{
  items: InventoryItem[];
  error: string | null;
}> {
  await connection();
  try {
    const { data, error } = await createSupabaseServerClient()
      .from("inventory_items")
      .select("*")
      .order("name");

    if (error) {
      return { items: [], error: error.message };
    }

    return {
      items: (data ?? []).map(toInventoryItem),
      error: null,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "不明なエラーが発生しました";
    return { items: [], error: message };
  }
}

export async function fetchReorderInventoryItems(): Promise<{
  items: InventoryItem[];
  error: string | null;
}> {
  await connection();
  try {
    const { data, error } = await createSupabaseServerClient()
      .from("inventory_items")
      .select("*")
      .eq("needs_reorder", true)
      .order("location")
      .order("name");

    if (error) {
      return { items: [], error: error.message };
    }

    return {
      items: (data ?? []).map(toInventoryItem),
      error: null,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "不明なエラーが発生しました";
    return { items: [], error: message };
  }
}

// TODO: 拠点でフィルタリングした取得関数を追加する
// TODO: 在庫数更新の mutation 関数を追加する
