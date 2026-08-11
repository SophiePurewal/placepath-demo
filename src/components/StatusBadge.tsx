import type { PlacementStatus } from "../data";

const configs: Record<PlacementStatus, { label: string; bg: string; text: string; dot: string }> = {
  draft: { label: "Draft", bg: "#f3f4f6", text: "#374151", dot: "#9ca3af" },
  "awaiting-employer": { label: "Awaiting Employer", bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
  "due-diligence": { label: "Due Diligence Required", bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  "awaiting-student": { label: "Awaiting Student", bg: "#f5f3ff", text: "#5b21b6", dot: "#8b5cf6" },
  "ready-to-confirm": { label: "Ready to Confirm", bg: "#ecfdf5", text: "#065f46", dot: "#10b981" },
  active: { label: "Active", bg: "#f0fdf4", text: "#15803d", dot: "#22c55e" },
  "at-risk": { label: "At Risk", bg: "#fef2f2", text: "#b91c1c", dot: "#ef4444" },
  completed: { label: "Completed", bg: "#f0f9ff", text: "#075985", dot: "#0ea5e9" },
  cancelled: { label: "Cancelled", bg: "#fafafa", text: "#6b7280", dot: "#d1d5db" },
};

type DueDilStatus = "compliant" | "pending" | "action-required" | "expired";
const ddConfigs: Record<DueDilStatus, { label: string; bg: string; text: string; dot: string }> = {
  compliant: { label: "Compliant", bg: "#f0fdf4", text: "#15803d", dot: "#22c55e" },
  pending: { label: "Pending", bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  "action-required": { label: "Action Required", bg: "#fef2f2", text: "#b91c1c", dot: "#ef4444" },
  expired: { label: "Expired", bg: "#fafafa", text: "#6b7280", dot: "#9ca3af" },
};

export function StatusBadge({ status }: { status: PlacementStatus }) {
  const c = configs[status] ?? configs["draft"];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: c.dot }}
        aria-hidden="true"
      />
      {c.label}
    </span>
  );
}

export function DueDilBadge({ status }: { status: DueDilStatus }) {
  const c = ddConfigs[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: c.dot }}
        aria-hidden="true"
      />
      {c.label}
    </span>
  );
}
