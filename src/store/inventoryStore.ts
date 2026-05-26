import { create } from "zustand";
import type { InventoryItem, Location } from "@/types/inventory";

interface InventoryState {
  items: InventoryItem[];
  selectedLocation: Location | "all";
  setItems: (items: InventoryItem[]) => void;
  setLocation: (location: Location | "all") => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  selectedLocation: "all",

  // 在庫アイテム一覧を更新する
  setItems: (items) => set({ items }),

  // 表示対象の拠点を切り替える
  setLocation: (location) => set({ selectedLocation: location }),
}));

// TODO: 拠点フィルタリング用の selector を追加する
// TODO: 在庫数の更新（楽観的更新）アクションを追加する
// TODO: Supabase との同期（fetch / mutate）ロジックを一覧画面へ集約する
