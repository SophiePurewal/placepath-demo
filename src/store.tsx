import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Shared cross-role state for the Nessie Nursery / Health & Social Care L3
 * placement — the single connected scenario linking Sarah, David and Maya.
 */

export type NessieStatus =
  | "awaiting-employer"
  | "change-requested"
  | "employer-accepted"
  | "confirmed";

export interface ActivityEntry {
  id: string;
  time: string;
  actor: string;
  action: string;
}

interface SharedState {
  nessieStatus: NessieStatus;
  setNessieStatus: (s: NessieStatus) => void;
  davidChangeMessage: string | null;
  setDavidChangeMessage: (m: string | null) => void;
  mayaDoneIds: Set<string>;
  toggleMayaTask: (id: string) => void;
  activityLog: ActivityEntry[];
  addActivity: (actor: string, action: string) => void;
}

const Ctx = createContext<SharedState | null>(null);

export function SharedStateProvider({ children }: { children: ReactNode }) {
  const [nessieStatus, setNessieStatusRaw] = useState<NessieStatus>("awaiting-employer");
  const [davidChangeMessage, setDavidChangeMessage] = useState<string | null>(null);
  const [mayaDoneIds, setMayaDoneIds] = useState<Set<string>>(
    new Set(["c1", "c2"]),
  );
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([
    {
      id: "a0",
      time: "11 Aug 2026, 08:00",
      actor: "Sarah Ahmed",
      action: "Sent placement request to Nessie Nursery for Maya Thompson.",
    },
  ]);

  const addActivity = (actor: string, action: string) => {
    const id = `a${Date.now()}`;
    const now = new Date();
    const time = `Today ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setActivityLog((prev) => [...prev, { id, time, actor, action }]);
  };

  const setNessieStatus = (s: NessieStatus) => {
    setNessieStatusRaw(s);
  };

  const toggleMayaTask = (id: string) => {
    setMayaDoneIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        addActivity("Maya Thompson", `Completed pre-placement task (${id}).`);
      }
      return next;
    });
  };

  return (
    <Ctx.Provider
      value={{
        nessieStatus,
        setNessieStatus,
        davidChangeMessage,
        setDavidChangeMessage,
        mayaDoneIds,
        toggleMayaTask,
        activityLog,
        addActivity,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useSharedState(): SharedState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSharedState must be used inside SharedStateProvider");
  return ctx;
}

/** Label and colour for each Nessie placement status */
export const nessieStatusMeta: Record<NessieStatus, { label: string; bg: string; text: string }> = {
  "awaiting-employer": { label: "Awaiting employer", bg: "#eff6ff", text: "#1d4ed8" },
  "change-requested": { label: "Change requested", bg: "#fef3c7", text: "#92400e" },
  "employer-accepted": { label: "Employer accepted", bg: "#f0fdf4", text: "#15803d" },
  "confirmed": { label: "Confirmed", bg: "#f0fdf4", text: "#15803d" },
};
