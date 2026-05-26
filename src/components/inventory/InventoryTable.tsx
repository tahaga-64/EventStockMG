"use client";

import { useEffect, useState, startTransition } from "react";
import { ReorderCheckbox } from "@/components/inventory/ReorderCheckbox";
import { StatusBadge } from "@/components/inventory/StatusBadge";
import { useToast } from "@/components/ui/ToastProvider";
import { updateInventoryNeedsReorder } from "@/lib/inventory";
import type { InventoryItem } from "@/types/inventory";

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items: initialItems }: InventoryTableProps) {
  const { showToast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  // サーバーから渡された一覧が変わったら同期する（再検証・他端末更新用）
  useEffect(() => {
    startTransition(() => {
      setItems(initialItems);
    });
  }, [initialItems]);

  const handleReorderToggle = async (id: string, next: boolean) => {
    let snapshot: InventoryItem[] | null = null;
    setItems((prev) => {
      snapshot = prev;
      return prev.map((row) =>
        row.id === id ? { ...row, needs_reorder: next } : row,
      );
    });

    setPendingIds((prev) => {
      const copy = new Set(prev);
      copy.add(id);
      return copy;
    });

    const { error } = await updateInventoryNeedsReorder(id, next);

    setPendingIds((prev) => {
      const copy = new Set(prev);
      copy.delete(id);
      return copy;
    });

    if (error) {
      if (snapshot) {
        setItems(snapshot);
      }
      showToast(`更新に失敗しました: ${error}`, "error");
    }
  };

  if (items.length === 0) {
    return (
      <p className="py-24 text-[13px] font-light leading-[1.9] text-muted">
        在庫データがありません
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full max-w-5xl border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="w-[38%] pb-4 pr-8 pt-6 text-left text-[10px] font-light tracking-[0.2em] text-muted uppercase">
              アイテム名
            </th>
            <th className="w-[14%] pb-4 pr-6 pt-6 text-left text-[10px] font-light tracking-[0.2em] text-muted uppercase">
              拠点
            </th>
            <th className="w-[12%] pb-4 pr-6 pt-6 text-right text-[10px] font-light tracking-[0.2em] text-muted uppercase">
              在庫数
            </th>
            <th className="w-[20%] pb-4 pr-6 pt-6 text-left text-[10px] font-light tracking-[0.2em] text-muted uppercase">
              ステータス
            </th>
            <th className="w-[16%] pb-4 pt-6 text-left text-[10px] font-light tracking-[0.2em] text-muted uppercase">
              追加購入
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-border-light transition-colors hover:bg-[#f3f3f0]"
            >
              <td className="py-5 pr-8">
                <span className="text-[15px] font-bold leading-[1.6] tracking-[-0.01em]">
                  {item.name}
                </span>
              </td>
              <td className="py-5 pr-6">
                <span className="text-[13px] font-light leading-[1.8] text-muted">
                  {item.location}
                </span>
              </td>
              <td className="py-5 pr-6 text-right">
                <span className="font-mono text-[14px] font-light tabular-nums leading-none">
                  {item.quantity}
                </span>
              </td>
              <td className="py-5 pr-6">
                <StatusBadge
                  quantity={item.quantity}
                  max_quantity={item.max_quantity}
                />
              </td>
              <td className="py-5">
                <div className="flex items-center gap-3">
                  <ReorderCheckbox
                    id={item.id}
                    checked={item.needs_reorder}
                    disabled={pendingIds.has(item.id)}
                    onCheckedChange={(next) => {
                      void handleReorderToggle(item.id, next);
                    }}
                  />
                  <span
                    className={`text-[12px] leading-[1.7] tracking-[0.02em] ${
                      item.needs_reorder
                        ? "font-bold text-accent"
                        : "font-light text-muted"
                    }`}
                  >
                    {item.needs_reorder ? "必要" : "—"}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// TODO: ステータスに応じた行全体の色分けを追加する
// TODO: ソート・検索機能を追加する
// TODO: 行クリックで詳細・編集モーダルを開く機能を追加する
