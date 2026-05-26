export type Location = "長南町" | "本社";

export type InventoryStatus = "plenty" | "low" | "critical";

export interface InventoryItem {
  id: string;
  name: string;
  location: Location;
  quantity: number;
  max_quantity: number;
  needs_reorder: boolean;
  category?: string;
  updated_at: string;
  updated_by: string;
}
