import type { InventoryItem, Location } from "@/types/inventory";

/** 拠点の並び（コピー本文の見出し順） */
const LOCATION_ORDER: readonly Location[] = ["長南町", "本社"];

/**
 * 今日の日付を yyyy/MM/dd で返す（ユーザーのローカル日付）
 */
export function formatTodayJaYYYYMMDD(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
}

/**
 * 発注メール用の追加購入リスト本文を組み立てる
 */
export function buildReorderClipboardText(items: InventoryItem[]): string {
  const dateStr = formatTodayJaYYYYMMDD();
  const lines: string[] = [];
  lines.push(`【追加購入リスト】${dateStr} 作成`);
  lines.push("");

  const byLocation = new Map<string, InventoryItem[]>();
  for (const item of items) {
    const bucket = byLocation.get(item.location) ?? [];
    bucket.push(item);
    byLocation.set(item.location, bucket);
  }

  for (const loc of LOCATION_ORDER) {
    const bucket = byLocation.get(loc);
    if (!bucket?.length) {
      continue;
    }
    lines.push(`■ ${loc}`);
    for (const item of bucket) {
      const shortage = Math.max(0, item.max_quantity - item.quantity);
      lines.push(
        `- ${item.name}：現在${item.quantity}個 / しきい値${item.max_quantity}個 → ${shortage}個不足`,
      );
    }
    lines.push("");
  }

  // 定義外の拠点があれば末尾にまとめる
  for (const [loc, bucket] of byLocation) {
    if (LOCATION_ORDER.includes(loc as Location)) {
      continue;
    }
    if (!bucket.length) {
      continue;
    }
    lines.push(`■ ${loc}`);
    for (const item of bucket) {
      const shortage = Math.max(0, item.max_quantity - item.quantity);
      lines.push(
        `- ${item.name}：現在${item.quantity}個 / しきい値${item.max_quantity}個 → ${shortage}個不足`,
      );
    }
    lines.push("");
  }

  while (lines[lines.length - 1] === "") {
    lines.pop();
  }

  lines.push("");
  lines.push(`合計${items.length}アイテム`);
  return lines.join("\n");
}
