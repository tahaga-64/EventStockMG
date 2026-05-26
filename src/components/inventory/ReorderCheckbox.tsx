"use client";

import { Check } from "lucide-react";

export interface ReorderCheckboxProps {
  /** 在庫行の ID（アクセシビリティ用ラベルに使用） */
  id: string;
  /** 追加購入フラグの状態 */
  checked: boolean;
  /** トグル時に親へ通知する（Supabase 更新は親で行う） */
  onCheckedChange?: (next: boolean) => void;
  /** 更新リクエスト中は操作を無効化する */
  disabled?: boolean;
}

/**
 * 追加購入列用のカスタムチェックボックス
 * TODO: STEP キーボードショートカットで一括トグルする
 */
export function ReorderCheckbox({
  id,
  checked,
  onCheckedChange,
  disabled = false,
}: ReorderCheckboxProps) {
  return (
    <button
      type="button"
      id={`reorder-checkbox-${id}`}
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      aria-label="追加購入リストへの反映を切り替える"
      onClick={() => onCheckedChange?.(!checked)}
      className={[
        "inline-flex size-[18px] shrink-0 items-center justify-center rounded-[3px] transition-all duration-150",
        "active:scale-95",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]",
        checked
          ? "bg-[color:var(--primary)] text-white shadow-sm"
          : "border-2 border-[color:var(--border)] bg-transparent hover:border-[color:var(--primary)]",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      ].join(" ")}
    >
      {checked ? (
        <Check className="size-3.5 stroke-[2.5]" aria-hidden />
      ) : null}
    </button>
  );
}
