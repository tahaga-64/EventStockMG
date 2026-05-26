import { ReorderClientPage } from "@/app/reorder/ReorderClientPage";
import { fetchReorderInventoryItems } from "@/lib/inventory-queries";

// Supabase から実行時にデータ取得するため動的レンダリングにする
export const dynamic = "force-dynamic";

/**
 * 追加購入リストのルート（データ取得はサーバー、操作 UI はクライアント）
 * TODO: STEP ルーターキャッシュと revalidateTag で一覧と整合させる
 */
export default async function ReorderPage() {
  const { items, error } = await fetchReorderInventoryItems();

  return <ReorderClientPage initialItems={items} initialError={error} />;
}
