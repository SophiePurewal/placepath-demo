import { useState } from "react";
import {
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
  MessageSquare,
  Calendar,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { StatusBadge } from "../../components/StatusBadge";
import {
  tasks as allTasks,
  placementOffers,
  employerLocations,
  messages,
  visits,
  placements,
} from "../../data";
import type { Screen } from "../../components/Sidebar";
import type { Task } from "../../data";

interface DashboardProps {
  onNavigate: (screen: Screen, payload?: unknown) => void;
  onAddToast: (type: "success" | "error" | "info", message: string) => void;
}

function Card({
  title,
  action,
  onAction,
  children,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="ep-section">
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "#eef2f7" }}
      >
        <h2
          className="text-sm font-semibold uppercase tracking-wide"
          style={{ fontFamily: "var(--font-display)", color: "#1a2540", letterSpacing: "0.06em" }}
        >
          {title}
        </h2>
        {action && onAction && (
          <button
            onClick={onAction}
            className="text-xs font-medium flex items-center gap-1"
            style={{ color: "#1b5db4", fontFamily: "var(--font-display)" }}
          >
            {action} <ArrowRight size={12} />
          </button>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}

export default function Dashboard({ onNavigate, onAddToast }: DashboardProps) {
  const [taskList, setTaskList] = useState<Task[]>(allTasks);
  const [msgExpanded, setMsgExpanded] = useState(false);

  const toggleTask = (id: string) => {
    setTaskList((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (!t.done) onAddToast("success", "Task marked as complete.");
        return { ...t, done: !t.done };
      })
    );
  };

  const statusSummary: Record<string, { count: number; color: string }> = {
    Active: { count: placements.filter((p) => p.status === "active").length, color: "#22c55e" },
    "At Risk": { count: placements.filter((p) => p.status === "at-risk").length, color: "#ef4444" },
    "Awaiting Employer": { count: placements.filter((p) => p.status === "awaiting-employer").length, color: "#3b82f6" },
    Draft: { count: placements.filter((p) => p.status === "draft").length, color: "#9ca3af" },
  };

  const shownMessages = msgExpanded ? messages : messages.slice(0, 3);

  return (
    <div className="ep-page">
      {/* Welcome bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className="ep-page-title"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#1a2540" }}
          >
            Welcome back, Sarah
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#5b6a8a" }}>
            Monday, 11 August 2026 · Northbridge College
          </p>
        </div>
        <button
          onClick={() => onNavigate("create-placement")}
          className="flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#1b5db4", color: "#fff", fontFamily: "var(--font-display)" }}
        >
          <Plus size={16} />
          New Placement
        </button>
      </div>

      {/* Status summary strip — compact metric row, not a competing tile */}
      <div className="ep-status-band flex flex-wrap gap-x-6 gap-y-3 mb-6 px-4 py-3">
        {Object.entries(statusSummary).map(([label, { count, color }]) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}>
              {count}
            </span>
            <span className="text-sm" style={{ color: "#5b6a8a" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="ep-dashboard-workspace">
        {/* Tasks */}
        <Card title="Outstanding Tasks" action="View all" onAction={() => onNavigate("tasks")}>
          <ul>
            {taskList.slice(0, 5).map((t) => (
              <li
                key={t.id}
                className="flex items-start gap-3 px-5 py-3 border-b last:border-b-0 transition-colors hover:bg-ep-blue-lighter"
                style={{ borderColor: "#eef2f7" }}
              >
                <button
                  onClick={() => toggleTask(t.id)}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: t.done ? "#22c55e" : "#d5e2f0" }}
                  aria-label={t.done ? "Mark incomplete" : "Mark complete"}
                >
                  {t.done ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm"
                    style={{
                      color: t.done ? "#5b6a8a" : "#1a2540",
                      textDecoration: t.done ? "line-through" : "none",
                    }}
                  >
                    {t.title}
                  </p>
                  <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: t.priority === "high" && !t.done ? "#b91c1c" : "#5b6a8a" }}>
                    <Clock size={11} />
                    {t.due}
                    {t.priority === "high" && !t.done && (
                      <span className="ml-1 text-xs font-medium" style={{ color: "#b91c1c" }}>
                        · Urgent
                      </span>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Placement Offers */}
        <Card title="Placement Offers" action="View all" onAction={() => onNavigate("placements")}>
          <ul>
            {placementOffers.map((o) => (
              <li key={o.id}>
                <button
                  onClick={() => onNavigate("employer-detail")}
                  className="w-full flex items-center justify-between px-5 py-3 border-b text-left transition-colors hover:bg-ep-blue-lighter"
                  style={{ borderColor: "#eef2f7" }}
                  aria-label={`View offer from ${o.contact} at ${o.employer}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                      {o.contact}
                    </p>
                    <p className="text-xs" style={{ color: "#5b6a8a" }}>
                      {o.employer}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#5b6a8a" }}>
                      {o.time}
                    </p>
                  </div>
                  <StatusBadge status={o.status} />
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* Employer Locations */}
        <Card title="Employer Locations" action="View map" onAction={() => onNavigate("employers")}>
          {/* Map placeholder */}
          <div
            className="mx-5 mt-4 mb-3 rounded-lg overflow-hidden relative"
            style={{ height: 140, backgroundColor: "#e8f0f8" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={28} style={{ color: "#1b5db4", margin: "0 auto" }} />
                <p className="text-xs mt-1" style={{ color: "#5b6a8a" }}>Northbridge and surrounding area</p>
              </div>
            </div>
            {/* Dot markers */}
            {[
              { top: "40%", left: "35%" },
              { top: "55%", left: "55%" },
              { top: "30%", left: "60%" },
            ].map((pos, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full border-2"
                style={{
                  top: pos.top,
                  left: pos.left,
                  backgroundColor: "#1b5db4",
                  borderColor: "#fff",
                  transform: "translate(-50%,-50%)",
                }}
              />
            ))}
          </div>
          <ul>
            {employerLocations.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => onNavigate("employer-detail")}
                  className="w-full flex items-center justify-between px-5 py-3 border-b text-left transition-colors hover:bg-ep-blue-lighter"
                  style={{ borderColor: "#eef2f7" }}
                  aria-label={`View ${l.name} — ${l.placements} placements`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin size={14} style={{ color: "#1b5db4", flexShrink: 0 }} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                        {l.name}
                      </p>
                      <p className="text-xs truncate" style={{ color: "#5b6a8a" }}>
                        {l.address}
                      </p>
                    </div>
                  </div>
                  <span
                    className="flex-shrink-0 text-xs font-semibold ml-2"
                    style={{ color: "#1b5db4", fontFamily: "var(--font-display)" }}
                  >
                    {l.placements} placements
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* Messages */}
        <Card title="Messages" action="View all" onAction={() => onNavigate("messages")}>
          <ul>
            {shownMessages.map((m) => (
              <li
                key={m.id}
                className="flex items-start gap-3 px-5 py-3 border-b last:border-b-0 hover:bg-ep-blue-lighter cursor-pointer"
                style={{ borderColor: "#eef2f7" }}
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: m.unread ? "#ebf3fc" : "#f3f4f6" }}
                >
                  <MessageSquare size={14} style={{ color: m.unread ? "#1b5db4" : "#9ca3af" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "#1a2540", fontFamily: "var(--font-display)", fontWeight: m.unread ? 600 : 400 }}
                    >
                      {m.sender}
                    </p>
                    <span className="text-xs flex-shrink-0" style={{ color: "#5b6a8a" }}>
                      {m.time}
                    </span>
                  </div>
                  <p className="text-sm truncate mt-0.5" style={{ color: "#5b6a8a" }}>
                    {m.subject}
                  </p>
                </div>
                {m.unread && (
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                    style={{ backgroundColor: "#1b5db4" }}
                    aria-label="Unread"
                  />
                )}
              </li>
            ))}
          </ul>
          {messages.length > 3 && (
            <button
              className="flex items-center justify-center gap-1 w-full py-2.5 text-sm"
              style={{ color: "#1b5db4", fontFamily: "var(--font-display)" }}
              onClick={() => setMsgExpanded(!msgExpanded)}
            >
              {msgExpanded ? (
                <>Show less <ChevronUp size={14} /></>
              ) : (
                <>Show {messages.length - 3} more <ChevronDown size={14} /></>
              )}
            </button>
          )}
        </Card>

        {/* Upcoming Visits */}
        <Card title="Upcoming Visits" action="View all" onAction={() => onNavigate("visits")}>
          <ul>
            {visits.map((v) => (
              <li
                key={v.id}
                className="flex items-start gap-3 px-5 py-3 border-b last:border-b-0 hover:bg-ep-blue-lighter"
                style={{ borderColor: "#eef2f7" }}
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#ebf3fc" }}
                >
                  <Calendar size={14} style={{ color: "#1b5db4" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                    {v.student}
                  </p>
                  <p className="text-xs" style={{ color: "#5b6a8a" }}>
                    {v.employer} · {v.type}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#5b6a8a" }}>
                    {v.date}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Placements requiring attention */}
        <Card title="Requires Attention" action="View all" onAction={() => onNavigate("placements")}>
          <ul>
            {placements
              .filter((p) => ["at-risk", "due-diligence", "awaiting-employer"].includes(p.status))
              .map((p) => (
                <li key={p.id}>
                <button
                  className="w-full flex items-start gap-3 px-5 py-3 border-b text-left transition-colors hover:bg-ep-blue-lighter"
                  style={{ borderColor: "#eef2f7" }}
                  onClick={() => onNavigate("placements")}
                  aria-label={`View ${p.title} — ${p.status}`}
                >
                  {p.status === "at-risk" && (
                    <AlertTriangle size={16} style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }} />
                  )}
                  {p.status !== "at-risk" && (
                    <ExternalLink size={16} style={{ color: "#f59e0b", flexShrink: 0, marginTop: 2 }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                      {p.title}
                    </p>
                    <p className="text-xs" style={{ color: "#5b6a8a" }}>
                      {p.employer} · {p.students} student{p.students !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </button>
                </li>
              ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
