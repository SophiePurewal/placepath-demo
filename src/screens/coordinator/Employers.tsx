import { useState } from "react";
import { Search, Plus, ChevronRight, Building2, Phone, Filter, X } from "lucide-react";
import { DueDilBadge } from "../../components/StatusBadge";
import { employers } from "../../data";
import type { Screen } from "../../components/Sidebar";

interface EmployersProps {
  onNavigate: (screen: Screen, payload?: unknown) => void;
  onSelectEmployer: (id: string) => void;
}

const ddFilterOptions = ["All", "Compliant", "Pending", "Action Required", "Expired"];

export default function Employers({ onNavigate, onSelectEmployer }: EmployersProps) {
  const [search, setSearch] = useState("");
  const [ddFilter, setDdFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = employers.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.sicCode.toLowerCase().includes(search.toLowerCase()) ||
      e.address.toLowerCase().includes(search.toLowerCase());
    const matchDd =
      ddFilter === "All" ||
      (ddFilter === "Compliant" && e.dueDiligenceStatus === "compliant") ||
      (ddFilter === "Pending" && e.dueDiligenceStatus === "pending") ||
      (ddFilter === "Action Required" && e.dueDiligenceStatus === "action-required") ||
      (ddFilter === "Expired" && e.dueDiligenceStatus === "expired");
    return matchSearch && matchDd;
  });

  const openDetail = (id: string) => {
    setSelectedId(id);
    onSelectEmployer(id);
    onNavigate("employer-detail");
  };

  return (
    <div className="ep-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <h1
          className="ep-section-title"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#1a2540" }}
        >
          Employers
        </h1>
        <button
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
          style={{ backgroundColor: "#1b5db4", color: "#fff", fontFamily: "var(--font-display)" }}
        >
          <Plus size={16} />
          Add Employer
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
            placeholder="Search employers by name, sector, or location…"
            className="w-full rounded-xl border pl-9 pr-4 py-2.5 text-sm"
            style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none", backgroundColor: "#fff" }}
            aria-label="Search employers"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium"
          style={{
            borderColor: showFilters || ddFilter !== "All" ? "#1b5db4" : "#d5e2f0",
            color: showFilters || ddFilter !== "All" ? "#1b5db4" : "#5b6a8a",
            backgroundColor: showFilters || ddFilter !== "All" ? "#ebf3fc" : "#fff",
            fontFamily: "var(--font-display)",
            minHeight: 44,
          }}
          aria-expanded={showFilters}
        >
          <Filter size={15} />
          Filters
          {ddFilter !== "All" && (
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
              Due diligence status
            </p>
            {ddFilter !== "All" && (
              <button
                onClick={() => setDdFilter("All")}
                className="text-xs flex items-center gap-1"
                style={{ color: "#1b5db4" }}
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {ddFilterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setDdFilter(opt)}
                className="px-3 py-1.5 rounded-full border text-xs font-medium transition-colors"
                style={{
                  borderColor: ddFilter === opt ? "#1b5db4" : "#d5e2f0",
                  backgroundColor: ddFilter === opt ? "#ebf3fc" : "#fff",
                  color: ddFilter === opt ? "#1b5db4" : "#5b6a8a",
                  fontFamily: "var(--font-display)",
                }}
                aria-pressed={ddFilter === opt}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs mb-2" style={{ color: "#9ca3af" }}>
        {filtered.length} employer{filtered.length !== 1 ? "s" : ""}
        {search && ` matching "${search}"`}
        {ddFilter !== "All" && ` · ${ddFilter}`}
      </p>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="ep-card py-16 text-center">
          <Building2 size={32} style={{ color: "#d5e2f0", margin: "0 auto 12px" }} />
          <p className="text-base font-semibold" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
            No employers found
          </p>
          <p className="text-sm mt-1" style={{ color: "#5b6a8a" }}>
            Try adjusting your search or clearing filters.
          </p>
        </div>
      ) : (
        /* Employer list — single white surface, rows with dividers */
        <div className="ep-card">
          {filtered.map((e, i) => {
            const selected = selectedId === e.id;
            const isLast = i === filtered.length - 1;
            return (
              <button
                key={e.id}
                onClick={() => openDetail(e.id)}
                className="w-full flex items-start gap-4 text-left"
                style={{
                  paddingTop: 14,
                  paddingBottom: 14,
                  paddingLeft: selected ? 13 : 16,
                  paddingRight: 16,
                  borderBottom: isLast ? "none" : "1px solid #eef2f7",
                  borderLeft: selected ? "3px solid #1b5db4" : "3px solid transparent",
                  backgroundColor: selected ? "#ebf3fc" : "transparent",
                  transition: "background 0.1s",
                }}
                aria-label={`Open ${e.name}`}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: selected ? "#dbeafe" : "#ebf3fc" }}
                >
                  <Building2 size={16} style={{ color: "#1b5db4" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h2
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
                    >
                      {e.name}
                    </h2>
                    <DueDilBadge status={e.dueDiligenceStatus} />
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: "#5b6a8a" }}>
                    {e.sicCode} · {e.legalStatus} · {e.employees} employees
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-1.5 text-xs" style={{ color: "#9ca3af" }}>
                    <span className="flex items-center gap-1">
                      <Building2 size={11} />
                      {e.activePlacements} active · {e.completedPlacements} completed
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={11} />
                      {e.phone}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  style={{ color: selected ? "#1b5db4" : "#c7d7ec", flexShrink: 0, alignSelf: "center" }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
