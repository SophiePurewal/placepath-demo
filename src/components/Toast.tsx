import { useEffect } from "react";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";

export interface ToastData {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      onDismiss(toasts[0].id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const Icon = t.type === "success" ? CheckCircle : t.type === "error" ? AlertCircle : Info;
        const colors =
          t.type === "success"
            ? { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d", icon: "#22c55e" }
            : t.type === "error"
              ? { bg: "#fef2f2", border: "#fecaca", text: "#b91c1c", icon: "#ef4444" }
              : { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", icon: "#3b82f6" };
        return (
          <div
            key={t.id}
            className="flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg border min-w-[280px] max-w-sm"
            style={{
              backgroundColor: colors.bg,
              borderColor: colors.border,
            }}
          >
            <Icon size={18} style={{ color: colors.icon, flexShrink: 0, marginTop: 1 }} />
            <p className="flex-1 text-sm" style={{ color: colors.text }}>
              {t.message}
            </p>
            <button
              onClick={() => onDismiss(t.id)}
              className="p-0.5 rounded"
              style={{ color: colors.text, opacity: 0.6 }}
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
