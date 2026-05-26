import { Package2 } from "lucide-react";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { fetchInventoryItems } from "@/lib/inventory";

// Supabase から実行時にデータ取得するため動的レンダリングにする
export const dynamic = "force-dynamic";

export default async function Home() {
  const { items, error } = await fetchInventoryItems();

  if (error) {
    return (
      <div className="min-h-full bg-background pl-[7vw] pr-[18vw] pt-28">
        <p className="text-sm font-light leading-[1.9] text-muted">
          データ取得エラー
        </p>
      </div>
    );
  }

  const reorderCount = items.filter((item) => item.needs_reorder).length;

  return (
    <div className="min-h-full bg-background">
      <header className="pl-[7vw] pr-[22vw] pt-20 pb-16">
        <div className="mb-10 flex items-center gap-2.5">
          <Package2
            size={15}
            strokeWidth={1.5}
            className="text-accent"
            aria-hidden
          />
          <p className="text-[10px] font-light tracking-[0.22em] text-muted uppercase">
            Inventory
          </p>
        </div>
        <h1 className="max-w-[14ch] text-[clamp(2.75rem,6vw,4.25rem)] font-bold leading-[1.05] tracking-[-0.03em]">
          在庫管理
        </h1>
        <p className="mt-8 max-w-sm text-[13px] font-light leading-[1.95] text-muted">
          拠点ごとの在庫数と補充状況。
          <br />
          更新日時は各行末尾に表示予定。
        </p>
        <dl className="mt-14 flex gap-16">
          <div>
            <dt className="text-[10px] font-light tracking-[0.18em] text-muted uppercase">
              Items
            </dt>
            <dd className="mt-2 font-mono text-[2rem] font-light leading-none tracking-tight">
              {items.length}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-light tracking-[0.18em] text-muted uppercase">
              Reorder
            </dt>
            <dd className="mt-2 font-mono text-[2rem] font-bold leading-none tracking-tight text-accent">
              {reorderCount}
            </dd>
          </div>
        </dl>
      </header>

      <section className="border-t border-border-light pl-[7vw] pr-[10vw] pb-28 pt-2">
        <InventoryTable items={items} />
      </section>
    </div>
  );
}

// TODO: 拠点フィルタ（Zustand store 連携）を追加する
// TODO: 在庫アイテムの新規登録フォームを追加する
// TODO: ローディング状態の表示を追加する
