"use client";

import { ClipboardList, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  Icon: typeof LayoutGrid;
}

const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "在庫一覧", Icon: LayoutGrid },
  { href: "/reorder", label: "追加購入", Icon: ClipboardList },
] as const;

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * デスクトップ用サイドバーとモバイル用ボトムナビをまとめたシェル
 * TODO: STEP ユーザー設定・通知ベルをヘッダーに追加する
 */
export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex min-h-dvh">
      {/* サイドバー（md 以上） */}
      <aside className="fixed left-0 top-0 z-40 hidden h-dvh w-[13.5rem] flex-col border-r border-border-light bg-[#f3f3f0] md:flex">
        <div className="px-5 pb-6 pt-8">
          <p className="text-[10px] font-light tracking-[0.22em] text-muted uppercase">
            Menu
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3 pb-8" aria-label="メインメニュー">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition-colors",
                  active
                    ? "bg-[#e8e8e4] font-bold text-foreground"
                    : "font-light text-muted hover:bg-[#ebebe8] hover:text-foreground",
                ].join(" ")}
              >
                <Icon
                  size={16}
                  strokeWidth={1.75}
                  className={active ? "text-[color:var(--primary)]" : "text-muted"}
                  aria-hidden
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-h-dvh flex-1 flex-col pb-[4.25rem] md:pb-0 md:pl-[13.5rem]">
        <div className="flex-1">{children}</div>

        {/* ボトムナビ（md 未満） */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border-light bg-[#f6f6f3]/95 backdrop-blur-sm md:hidden"
          aria-label="モバイルメニュー"
        >
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] tracking-[0.02em] transition-colors",
                  active
                    ? "font-bold text-[color:var(--primary)]"
                    : "font-light text-muted",
                ].join(" ")}
              >
                <Icon
                  size={20}
                  strokeWidth={1.75}
                  className={active ? "text-[color:var(--primary)]" : "text-muted"}
                  aria-hidden
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
