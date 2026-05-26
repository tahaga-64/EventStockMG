"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type ToastVariant = "success" | "error";

interface ToastState {
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  /** 画面右下にトーストを表示する */
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast は ToastProvider 内で使ってください");
  }
  return ctx;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * アプリ全体で共有する簡易トースト
 * TODO: STEP Sonner 等に差し替えてスタック表示・アクション付きにする
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      setToast({ message, variant });
    },
    [],
  );

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const isError = toast?.variant === "error";

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? (
        <div
          role="status"
          className={[
            "fixed bottom-[5.5rem] right-5 z-[120] max-w-[min(22rem,calc(100vw-2.5rem))] rounded-lg border px-4 py-3 text-[13px] leading-[1.65] shadow-md md:bottom-8",
            isError
              ? "border-red-200 bg-[#fff8f7] text-red-900"
              : "border-border bg-[var(--surface)] text-foreground",
          ].join(" ")}
        >
          {toast.message}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}
