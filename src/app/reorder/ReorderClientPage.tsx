"use client";

import Link from "next/link";
import { PackageCheck } from "lucide-react";
import { useEffect, useState, startTransition } from "react";
import { updateInventoryNeedsReorder } from "@/lib/inventory";
import { buildReorderClipboardText } from "@/lib/reorderClipboard";
import type { InventoryItem } from "@/types/inventory";
import { useToast } from "@/components/ui/ToastProvider";

interface ReorderClientPageProps {
  /** サーバー側で取得した初期一覧 */
  initialItems: InventoryItem[];
  /** サーバー取得時のエラーメッセージ（あればトーストで通知） */
  initialError: string | null;
}

/**
 * 追加購入リストの操作 UI（コピー・リストから外す）
 * TODO: STEP 発注先メールアドレスをワンクリックで開く（mailto）機能を追加する
 */
export function ReorderClientPage({
  initialItems,
  initialError,
}: ReorderClientPageProps) {
  const { showToast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  // サーバーから渡された一覧が差し替わったときに同期（router.refresh 等）
  useEffect(() => {
    startTransition(() => {
      setItems(initialItems);
    });
  }, [initialItems]);

  const handleRemoveFromList = async (id: string) => {
    let snapshot: InventoryItem[] | null = null;
    setItems((prev) => {
      snapshot = prev;
      return prev.filter((row) => row.id !== id);
    });
    setPendingIds((prev) => {
      const copy = new Set(prev);
      copy.add(id);
      return copy;
    });

    const { error } = await updateInventoryNeedsReorder(id, false);

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

  const handleCopyList = async () => {
    if (items.length === 0) {
      return;
    }
    const text = buildReorderClipboardText(items);
    try {
      await navigator.clipboard.writeText(text);
      showToast("✅ クリップボードにコピーしました", "success");
    } catch {
      showToast("クリップボードへのコピーに失敗しました", "error");
    }
  };

  const count = items.length;

  return (
    <div className="min-h-full bg-background">
      <header className="border-b border-border-light pl-[7vw] pr-[7vw] pb-10 pt-16 md:pr-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[10px] font-light tracking-[0.22em] text-muted uppercase">
              Reorder
            </p>
            <h1 className="mt-3 text-[clamp(1.75rem,4vw,2.35rem)] font-bold leading-[1.15] tracking-[-0.03em]">
              追加購入リスト
            </h1>
            <p className="mt-4 max-w-lg text-[13px] font-light leading-[1.95] text-muted">
              発注が必要なアイテム一覧
            </p>
            <p className="mt-6 text-[12px] font-light tracking-[0.08em] text-muted">
              アイテム数{" "}
              <span className="font-mono text-[15px] text-foreground">{count}</span>
            </p>
          </div>
          <div className="shrink-0 md:pt-2">
            <button
              type="button"
              onClick={() => void handleCopyList()}
              disabled={count === 0}
              className={[
                "rounded-md px-4 py-2.5 text-[13px] font-bold tracking-[0.02em] shadow-sm transition-shadow",
                "bg-[color:var(--primary)] text-white hover:shadow-md",
                count === 0 ? "cursor-not-allowed opacity-40" : "",
              ].join(" ")}
            >
              📋 リストをコピー
            </button>
          </div>
        </div>
      </header>

      <section className="pl-[7vw] pr-[7vw] pb-28 pt-10 md:pr-12">
        {initialError && count === 0 ? (
          <p className="text-[13px] font-light text-muted">
            データを表示できませんでした。
          </p>
        ) : count === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-lg border border-dashed border-border bg-[var(--surface)] px-8 py-16 text-center shadow-sm">
            <PackageCheck
              className="mb-5 text-muted"
              size={36}
              strokeWidth={1.25}
              aria-hidden
            />
            <p className="text-[15px] font-bold leading-snug tracking-[-0.02em]">
              追加購入が必要なアイテムはありません
            </p>
            <p className="mt-3 text-[12px] font-light leading-relaxed text-muted">
              在庫一覧のチェックボックスから、いつでもリストに追加できます。
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex rounded-md border border-border bg-background px-4 py-2 text-[13px] font-bold text-foreground transition-colors hover:bg-[#f0f0ec]"
            >
              在庫一覧に戻る
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {items.map((item) => {
              const shortage = Math.max(0, item.max_quantity - item.quantity);
              const busy = pendingIds.has(item.id);
              return (
                <li key={item.id}>
                  <article
                    className={[
                      "flex h-full flex-col rounded-lg border border-border-light bg-[var(--surface)] p-5 shadow-sm transition-shadow",
                      "hover:shadow-md",
                    ].join(" ")}
                  >
                    <h2 className="text-[17px] font-bold leading-snug tracking-[-0.02em]">
                      {item.name}
                    </h2>
                    <dl className="mt-5 space-y-2.5 text-[13px] font-light leading-[1.75] text-muted">
                      <div className="flex justify-between gap-4">
                        <dt>拠点</dt>
                        <dd className="text-right text-foreground">{item.location}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt>現在の在庫数</dt>
                        <dd className="font-mono text-right text-foreground tabular-nums">
                          {item.quantity}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt>しきい値</dt>
                        <dd className="font-mono text-right text-foreground tabular-nums">
                          {item.max_quantity}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt>不足数</dt>
                        <dd className="text-right font-mono text-[14px] font-bold tabular-nums text-red-600">
                          {shortage}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt>カテゴリ</dt>
                        <dd className="max-w-[55%] text-right text-foreground">
                          {item.category?.trim() ? item.category : "—"}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-6 flex flex-1 flex-col justify-end">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleRemoveFromList(item.id)}
                        className={[
                          "w-full rounded-md border border-border bg-background py-2 text-[12px] font-bold tracking-[0.04em] text-muted transition-colors",
                          "hover:border-foreground/20 hover:text-foreground",
                          busy ? "cursor-wait opacity-60" : "",
                        ].join(" ")}
                      >
                        リストから外す
                      </button>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
