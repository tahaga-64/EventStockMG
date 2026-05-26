interface StatusBadgeProps {
  quantity: number;
  max_quantity: number;
}

type StatusLevel = "plenty" | "low" | "critical";

interface StatusConfig {
  emoji: string;
  label: string;
  tint: string;
}

// 在庫比率からステータスレベルを判定する
function getStatusLevel(quantity: number, max_quantity: number): StatusLevel {
  if (max_quantity <= 0) {
    return "critical";
  }

  const ratio = quantity / max_quantity;

  if (ratio >= 0.5) {
    return "plenty";
  }
  if (ratio >= 0.2) {
    return "low";
  }
  return "critical";
}

// ステータスレベルに応じた表示設定を返す
function getStatusConfig(level: StatusLevel): StatusConfig {
  switch (level) {
    case "plenty":
      return {
        emoji: "🟦",
        label: "十分",
        tint: "bg-[#eef1f4]",
      };
    case "low":
      return {
        emoji: "🟡",
        label: "少なめ",
        tint: "bg-[#f3f1ea]",
      };
    case "critical":
      return {
        emoji: "🟥",
        label: "残りわずか",
        tint: "bg-[#f3ecea]",
      };
  }
}

export function StatusBadge({ quantity, max_quantity }: StatusBadgeProps) {
  const level = getStatusLevel(quantity, max_quantity);
  const { emoji, label, tint } = getStatusConfig(level);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-[2px] border border-border px-2.5 py-1 ${tint}`}
    >
      <span className="text-[11px] leading-none" aria-hidden>
        {emoji}
      </span>
      <span className="text-[11px] font-bold leading-none tracking-[0.04em]">
        {label}
      </span>
    </span>
  );
}

// TODO: ステータス判定ロジックを InventoryStatus 型と共通化する
// TODO: max_quantity が 0 の場合の表示ルールを DB 側と合わせて見直す
// TODO: アクセシビリティ向けに emoji 以外の視覚的手がかり（lucide アイコン等）を追加する
