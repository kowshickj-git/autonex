"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleAlert, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { EASE } from "@/lib/motion";

type ToastTone = "success" | "error" | "info";
type Toast = { id: number; tone: ToastTone; message: string };

const ToastContext = createContext<{
  notify: (message: string, tone?: ToastTone) => void;
} | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, tone: ToastTone = "success") => {
      const id = nextId++;
      setToasts((current) => [...current, { id, tone, message }]);
      // Errors linger a little longer - they usually need reading twice.
      setTimeout(() => dismiss(id), tone === "error" ? 6500 : 4200);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-6 left-1/2 z-[90] flex w-[min(92vw,26rem)] -translate-x-1/2 flex-col gap-2.5"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.32, ease: EASE.outQuint }}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3.5 shadow-e3 ring-1 ${
                toast.tone === "error"
                  ? "bg-white ring-red-200"
                  : toast.tone === "info"
                    ? "bg-white ring-slate-3"
                    : "bg-white ring-emerald-200"
              }`}
            >
              <span
                className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${
                  toast.tone === "error"
                    ? "bg-red-100 text-red-600"
                    : toast.tone === "info"
                      ? "bg-royal-50 text-royal-700"
                      : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {toast.tone === "error" ? (
                  <CircleAlert className="size-3.5" strokeWidth={2.4} />
                ) : (
                  <Check className="size-3.5" strokeWidth={3} />
                )}
              </span>

              <p className="flex-1 text-sm leading-snug text-navy-900">{toast.message}</p>

              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="-m-1 rounded p-1 text-slate-5 transition-colors hover:text-navy-900"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside a <ToastProvider>.");
  return context;
}
