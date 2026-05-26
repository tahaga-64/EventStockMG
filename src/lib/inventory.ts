import { createClient } from "@/lib/supabase";
import type { Tables } from "@/types/database";
import type { InventoryItem } from "@/types/inventory";

type InventoryItemRow = Tables<"inventory_items">;

// DB の行データをアプリ用の型に変換する
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

// Supabase から在庫アイテムを全件取得する
export async function fetchInventoryItems(): Promise<{
  items: InventoryItem[];
  error: string | null;
}> {
  try {
    const { data, error } = await createClient()
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

// 追加購入フラグのみを更新する（RLS・ポリシー前提）
export async function updateInventoryNeedsReorder(
  id: string,
  needs_reorder: boolean,
): Promise<{ error: string | null }> {
  try {
    const { error } = await createClient()
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

// needs_reorder が true のアイテムだけを取得する
export async function fetchReorderInventoryItems(): Promise<{
  items: InventoryItem[];
  error: string | null;
}> {
  try {
    const { data, error } = await createClient()
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
