import { useState } from "react";
import { Plus, Search, Filter, ChevronRight, Briefcase, X } from "lucide-react";
import { StatusBadge } from "../../components/StatusBadge";
import { placements } from "../../data";
import type { PlacementStatus } from "../../data";
import type { Screen } from "../../components/Sidebar";

interface PlacementsProps {
  onNavigate: (screen: Screen) => void;
}

const statusFilters: { label: string; val: PlacementStatus | "all" }[] = [
  { label: "All", val: "all" },
  { label: "Active", val: "active" },
  { label: "Draft", val: "draft" },
  { label: "At Risk", val: "at-risk" },
  { label: "Awaiting Employer", val: "awaiting-employer" },
  { label: "Due Diligence", val: "due-diligence" },
  { label: "Ready to Confirm", val: "ready-to-confirm" },
  { label: "Completed", val: "completed" },
];

export default function Placements({ onNavigate }: PlacementsProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PlacementStatus | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = placements.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.employer.toLowerCase().includes(search.toLowerCase()) ||
      p.course.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="ep-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1
            className="ep-section-title"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#1a2540" }}
          >
            Placements
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#5b6a8a" }}>
            {placements.length} total placements
          </p>
        </div>
        <button
          onClick={() => onNavigate("create-placement")}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
          style={{ backgroundColor: "#1b5db4", color: "#fff", fontFamily: "var(--font-display)" }}
        >
          <Plus size={16} />
          New placement
        </button>
      </div>

      {/* Search + filter toolbar */}
      <div className="ep-toolbar flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search placements…"
            className="w-full rounded-xl border pl-9 pr-4 py-2.5 text-sm"
            style={{ borderColor: "#d5e2f0", backgroundColor: "#fff", color: "#1a2540", outline: "none" }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium"
          style={{
            borderColor: showFilters || statusFilter !== "all" ? "#1b5db4" : "#d5e2f0",
            color: showFilters || statusFilter !== "all" ? "#1b5db4" : "#5b6a8a",
            backgroundColor: showFilters || statusFilter !== "all" ? "#ebf3fc" : "#fff",
            fontFamily: "var(--font-display)",
            minHeight: 44,
          }}
        >
          <Filter size={15} />
          Filters
          {statusFilter !== "all" && (
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: "#1b5db4", color: "#fff" }}
            >
              1
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mb-4 px-4 py-3.5 rounded-xl" style={{ backgroundColor: "#eef2f7" }}>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs font-semibold" style={{ color: "#5b6a8a", fontFamily: "var(--font-display)" }}>
              Filter by status
            </p>
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="text-xs flex items-center gap-1"
                style={{ color: "#1b5db4" }}
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((f) => (
              <button
                key={f.val}
                onClick={() => setStatusFilter(f.val)}
                className="px-3 py-1.5 rounded-full border text-xs font-medium transition-colors"
                style={{
                  borderColor: statusFilter === f.val ? "#1b5db4" : "#d5e2f0",
                  backgroundColor: statusFilter === f.val ? "#ebf3fc" : "#fff",
                  color: statusFilter === f.val ? "#1b5db4" : "#5b6a8a",
                  fontFamily: "var(--font-display)",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs mb-2" style={{ color: "#9ca3af" }}>
        {filtered.length} placement{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="ep-card py-16 text-center">
          <Briefcase size={32} style={{ color: "#d5e2f0", margin: "0 auto 12px" }} />
          <p className="text-base font-semibold" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
            No placements found
          </p>
          <p className="text-sm mt-1" style={{ color: "#5b6a8a" }}>
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        /* Placement list — single white surface, rows with dividers */
        <div className="ep-card">
          {filtered.map((p, i) => {
            const selected = selectedId === p.id;
            const isLast = i === filtered.length - 1;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(selected ? null : p.id)}
                className="w-full flex items-start gap-4 text-left"
                style={{
                  paddingTop: 14,
                  paddingBottom: 14,
                  paddingLeft: selected ? 13 : 16,
                  paddingRight: 16,
                  borderBottom: isLast ? "none" : "1px solid #eef2f7",
                  borderLeft: selected ? "3px solid #1b5db4" : "3px solid transparent",
                  backgroundColor: selected ? "#ebf3fc" : "transparent",
                }}
                aria-pressed={selected}
                aria-label={`${p.title} — ${p.employer}`}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: selected ? "#dbeafe" : "#ebf3fc" }}
                >
                  <Briefcase size={16} style={{ color: "#1b5db4" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <h2
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
                    >
                      {p.title}
                    </h2>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: "#5b6a8a" }}>
                    {p.course} · {p.employer}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-xs" style={{ color: "#9ca3af" }}>
                    <span>{p.students} student{p.students !== 1 ? "s" : ""}</span>
                    {p.startDate && <span>{p.startDate} – {p.endDate}</span>}
                    <span>Coordinator: {p.coordinator}</span>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  style={{
                    color: selected ? "#1b5db4" : "#c7d7ec",
                    flexShrink: 0,
                    alignSelf: "center",
                    transition: "transform 0.15s",
                    transform: selected ? "rotate(90deg)" : "none",
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
