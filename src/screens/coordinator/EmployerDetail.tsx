import { useState } from "react";
import {
  ChevronLeft,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Plus,
  ChevronDown,
  ChevronUp,
  Check,
  Building2,
  Users,
  Shield,
  FileText,
  X,
  AlertCircle,
} from "lucide-react";
import { DueDilBadge, StatusBadge } from "../../components/StatusBadge";
import { employers, placements } from "../../data";
import type { Conversation } from "../../data";
import type { Screen } from "../../components/Sidebar";

interface EmployerDetailProps {
  employerId: string;
  onNavigate: (screen: Screen) => void;
  onAddToast: (type: "success" | "error" | "info", message: string) => void;
}

type Tab = "overview" | "contacts" | "placements" | "due-diligence" | "conversations" | "documents";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "placements", label: "Placements", icon: FileText },
  { id: "due-diligence", label: "Due Diligence", icon: Shield },
  { id: "conversations", label: "Conversations", icon: MessageSquare },
  { id: "documents", label: "Documents", icon: FileText },
];

export default function EmployerDetail({ employerId, onNavigate, onAddToast }: EmployerDetailProps) {
  const employer = employers.find((e) => e.id === employerId) ?? employers[0];
  const [tab, setTab] = useState<Tab>("overview");
  const [tabMenuOpen, setTabMenuOpen] = useState(false);
  const [expandedConvs, setExpandedConvs] = useState<Set<string>>(new Set());
  const [showConvModal, setShowConvModal] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(employer.conversations);

  const [convMethod, setConvMethod] = useState("Phone call");
  const [convSummary, setConvSummary] = useState("");
  const [convAction, setConvAction] = useState("");
  const [convActions, setConvActions] = useState<string[]>([]);
  const [convErrors, setConvErrors] = useState<Record<string, string>>({});

  const toggleConv = (id: string) => {
    setExpandedConvs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const submitConv = () => {
    const e: Record<string, string> = {};
    if (!convSummary.trim()) e.summary = "Please enter a conversation summary.";
    setConvErrors(e);
    if (Object.keys(e).length > 0) return;
    const newConv: Conversation = {
      id: `cv${Date.now()}`,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      method: convMethod,
      summary: convSummary,
      coordinator: "Sarah Ahmed",
      actions: convActions,
    };
    setConversations((prev) => [newConv, ...prev]);
    setShowConvModal(false);
    setConvSummary("");
    setConvActions([]);
    setConvAction("");
    onAddToast("success", "Conversation recorded successfully.");
  };

  const employerPlacements = placements.filter((p) => p.employer === employer.name);

  const ddItems = [
    { label: "Employers liability insurance", status: "compliant" as const },
    { label: "Public liability insurance", status: "compliant" as const },
    { label: "Risk assessment completed", status: "compliant" as const },
    { label: "Health and safety policy", status: "compliant" as const },
    {
      label: "Enhanced DBS check for supervisors",
      status:
        employer.dueDiligenceStatus === "pending"
          ? ("pending" as const)
          : ("compliant" as const),
    },
    { label: "Safeguarding policy", status: "compliant" as const },
  ];

  const currentTab = TABS.find((t) => t.id === tab) ?? TABS[0];
  const CurrentTabIcon = currentTab.icon;

  return (
    <div className="ep-page">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => onNavigate("employers")}
          className="flex items-center gap-1.5 text-sm"
          style={{ color: "#5b6a8a", fontFamily: "var(--font-display)" }}
        >
          <ChevronLeft size={16} /> Employers
        </button>
        <span style={{ color: "#d5e2f0" }}>/</span>
        <span className="text-sm" style={{ color: "#1a2540" }}>
          {employer.name}
        </span>
      </div>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#ebf3fc" }}
          >
            <Building2 size={22} style={{ color: "#1b5db4" }} />
          </div>
          <div className="min-w-0">
            <h1
              className="text-2xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#1a2540" }}
            >
              {employer.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <DueDilBadge status={employer.dueDiligenceStatus} />
              <span className="text-sm" style={{ color: "#5b6a8a" }}>
                {employer.sicCode} · {employer.legalStatus}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 flex-shrink-0">
          <button
            onClick={() => setShowConvModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium"
            style={{
              borderColor: "#d5e2f0",
              color: "#1b5db4",
              fontFamily: "var(--font-display)",
              backgroundColor: "#fff",
            }}
          >
            <MessageSquare size={15} />
            Record conversation
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "#1b5db4", color: "#fff", fontFamily: "var(--font-display)" }}
          >
            <Plus size={15} />
            New placement
          </button>
        </div>
      </div>

      {/* ── Mobile section selector (< md) ── */}
      <div className="md:hidden mb-6 relative">
        <button
          onClick={() => setTabMenuOpen(!tabMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left"
          style={{
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(20, 35, 65, 0.08)",
            fontFamily: "var(--font-display)",
          }}
          aria-haspopup="listbox"
          aria-expanded={tabMenuOpen}
        >
          <div className="flex items-center gap-2.5">
            <CurrentTabIcon size={16} style={{ color: "#1b5db4" }} />
            <span className="font-semibold text-sm" style={{ color: "#1a2540" }}>
              {currentTab.label}
            </span>
          </div>
          <ChevronDown
            size={16}
            style={{
              color: "#5b6a8a",
              transition: "transform 0.15s",
              transform: tabMenuOpen ? "rotate(180deg)" : "none",
            }}
          />
        </button>

        {tabMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setTabMenuOpen(false)}
              aria-hidden="true"
            />
            <div
              className="absolute top-full left-0 right-0 mt-1 z-20 rounded-xl overflow-hidden"
              style={{ boxShadow: "0 4px 14px rgba(20, 35, 65, 0.14)", backgroundColor: "#fff" }}
              role="listbox"
            >
              {TABS.map((t) => {
                const Icon = t.icon;
                const isActive = tab === t.id;
                return (
                  <button
                    key={t.id}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      setTab(t.id);
                      setTabMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    style={{
                      borderBottom: "1px solid #eef2f7",
                      backgroundColor: isActive ? "#ebf3fc" : "transparent",
                      color: isActive ? "#1b5db4" : "#1a2540",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    <Icon size={15} style={{ color: isActive ? "#1b5db4" : "#9ca3af", flexShrink: 0 }} />
                    <span className="text-sm font-medium">{t.label}</span>
                    {isActive && <Check size={14} style={{ color: "#1b5db4", marginLeft: "auto" }} />}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Desktop tabs (≥ md) ── */}
      <div
        className="hidden md:flex gap-0 border-b mb-6"
        style={{ borderColor: "#d5e2f0" }}
        role="tablist"
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2"
              style={{
                borderColor: active ? "#1b5db4" : "transparent",
                color: active ? "#1b5db4" : "#5b6a8a",
                backgroundColor: "transparent",
                fontFamily: "var(--font-display)",
              }}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}

      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="ep-card p-6 space-y-4">
            <h2
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ fontFamily: "var(--font-display)", color: "#5b6a8a" }}
            >
              About Employer
            </h2>
            <dl className="space-y-3">
              {[
                { key: "Name", val: employer.name },
                { key: "Address", val: employer.address },
                { key: "Telephone", val: employer.phone },
                { key: "SIC Code", val: employer.sicCode },
                { key: "Legal Status", val: employer.legalStatus },
                { key: "Number of Employees", val: String(employer.employees) },
              ].map(({ key, val }) => (
                <div key={key}>
                  <dt className="text-xs" style={{ color: "#9ca3af" }}>
                    {key}
                  </dt>
                  <dd className="text-sm mt-0.5 break-words" style={{ color: "#1a2540" }}>
                    {val}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="space-y-2 pt-2">
              {[
                { label: "Provided a previous industry placement", val: employer.previousPlacement },
                { label: "Currently employs an apprentice(s)", val: employer.currentApprentice },
                { label: "Learning provider support included", val: employer.lpSupport },
              ].map(({ label, val }) => (
                <label key={label} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={val}
                    readOnly
                    style={{ accentColor: "#1b5db4" }}
                  />
                  <span style={{ color: "#1a2540" }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="ep-card">
            <div
              className="relative flex items-center justify-center"
              style={{ height: 200, backgroundColor: "#e8f0f8" }}
            >
              <div className="text-center">
                <MapPin size={32} style={{ color: "#1b5db4", margin: "0 auto" }} />
                <p className="text-xs mt-1" style={{ color: "#5b6a8a" }}>
                  Employer location
                </p>
              </div>
            </div>
            <div className="p-5">
              <h2
                className="text-sm font-semibold uppercase tracking-wide mb-3"
                style={{ fontFamily: "var(--font-display)", color: "#5b6a8a" }}
              >
                Employer Location
              </h2>
              <div className="flex items-start gap-2">
                <MapPin size={16} style={{ color: "#1b5db4", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>
                    Address
                  </p>
                  <p className="text-sm" style={{ color: "#1a2540" }}>
                    {employer.address}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div
                  className="rounded-xl p-3 text-center"
                  style={{ backgroundColor: "#eef2f7" }}
                >
                  <p
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "#1b5db4" }}
                  >
                    {employer.activePlacements}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#5b6a8a" }}>
                    Active placements
                  </p>
                </div>
                <div
                  className="rounded-xl p-3 text-center"
                  style={{ backgroundColor: "#eef2f7" }}
                >
                  <p
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
                  >
                    {employer.completedPlacements}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#5b6a8a" }}>
                    Completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "contacts" && (
        <div className="space-y-4">
          {employer.contacts.map((c) => (
            <div key={c.id} className="ep-card p-5">
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                  style={{
                    backgroundColor: "#ebf3fc",
                    color: "#1b5db4",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {c.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm"
                    style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
                  >
                    {c.name}
                    {c.primary && (
                      <span
                        className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "#ebf3fc", color: "#1b5db4" }}
                      >
                        Primary
                      </span>
                    )}
                  </p>
                  <p className="text-sm" style={{ color: "#5b6a8a" }}>
                    {c.role}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-sm">
                <div className="flex items-center gap-2 min-w-0" style={{ color: "#5b6a8a" }}>
                  <Phone size={13} style={{ color: "#9ca3af", flexShrink: 0 }} />
                  <span className="truncate">{c.phone}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0" style={{ color: "#5b6a8a" }}>
                  <Phone size={13} style={{ color: "#9ca3af", flexShrink: 0 }} />
                  <span className="truncate">{c.mobile}</span>
                </div>
                <div className="flex items-start gap-2 min-w-0" style={{ color: "#5b6a8a" }}>
                  <Mail size={13} style={{ color: "#9ca3af", flexShrink: 0, marginTop: 2 }} />
                  <span className="break-all">{c.email}</span>
                </div>
              </div>
            </div>
          ))}
          <button
            className="flex items-center gap-2 w-full rounded-xl border py-3.5 text-sm font-medium justify-center"
            style={{
              borderColor: "#d5e2f0",
              borderStyle: "dashed",
              color: "#1b5db4",
              fontFamily: "var(--font-display)",
              backgroundColor: "#fff",
            }}
          >
            <Plus size={15} /> Add contact
          </button>
        </div>
      )}

      {tab === "placements" && (
        <div className="space-y-3">
          {employerPlacements.length === 0 ? (
            <div className="ep-card py-16 text-center">
              <p
                className="text-base font-semibold"
                style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}
              >
                No placements recorded
              </p>
            </div>
          ) : (
            employerPlacements.map((p) => (
              <div key={p.id} className="ep-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
                    >
                      {p.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#5b6a8a" }}>
                      {p.course} · {p.students} student{p.students !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                      {p.startDate} – {p.endDate}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "due-diligence" && (
        <div className="ep-card">
          <div className="px-5 py-4 border-b" style={{ borderColor: "#eef2f7" }}>
            <div className="flex items-center justify-between">
              <h2
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
              >
                Due Diligence Status
              </h2>
              <DueDilBadge status={employer.dueDiligenceStatus} />
            </div>
          </div>
          <ul>
            {ddItems.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between px-5 py-3.5 border-b last:border-b-0"
                style={{ borderColor: "#eef2f7" }}
              >
                <span className="text-sm" style={{ color: "#1a2540" }}>
                  {item.label}
                </span>
                <DueDilBadge status={item.status} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "conversations" && (
        <div className="space-y-3">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setShowConvModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: "#1b5db4", color: "#fff", fontFamily: "var(--font-display)" }}
            >
              <Plus size={15} />
              Record conversation
            </button>
          </div>
          {conversations.length === 0 && (
            <div className="ep-card py-16 text-center">
              <MessageSquare size={28} style={{ color: "#d5e2f0", margin: "0 auto 8px" }} />
              <p className="text-sm" style={{ color: "#9ca3af" }}>
                No conversations recorded yet.
              </p>
            </div>
          )}
          {conversations.map((cv) => {
            const expanded = expandedConvs.has(cv.id);
            return (
              <div key={cv.id} className="ep-card">
                <button
                  className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => toggleConv(cv.id)}
                  aria-expanded={expanded}
                >
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
                    >
                      {cv.method}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                      {cv.date} · {cv.coordinator}
                    </p>
                    {!expanded && (
                      <p className="text-sm mt-1 line-clamp-1" style={{ color: "#5b6a8a" }}>
                        {cv.summary}
                      </p>
                    )}
                  </div>
                  {expanded ? (
                    <ChevronUp size={16} style={{ color: "#9ca3af", flexShrink: 0, marginTop: 4 }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: "#9ca3af", flexShrink: 0, marginTop: 4 }} />
                  )}
                </button>
                {expanded && (
                  <div className="px-5 pb-5 border-t" style={{ borderColor: "#eef2f7" }}>
                    <p className="text-sm mt-3" style={{ color: "#1a2540", lineHeight: 1.7 }}>
                      {cv.summary}
                    </p>
                    {cv.actions.length > 0 && (
                      <div className="mt-4">
                        <p
                          className="text-xs font-semibold uppercase tracking-wide mb-2"
                          style={{ color: "#5b6a8a" }}
                        >
                          Agreed actions
                        </p>
                        <ul className="space-y-1">
                          {cv.actions.map((a, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <Check
                                size={13}
                                style={{ color: "#1b5db4", flexShrink: 0, marginTop: 3 }}
                              />
                              <span style={{ color: "#1a2540" }}>{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "documents" && (
        <div className="ep-card">
          <div className="px-5 py-4 border-b" style={{ borderColor: "#eef2f7" }}>
            <div className="flex items-center justify-between">
              <h2
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
              >
                Documents
              </h2>
              <button
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: "#1b5db4", fontFamily: "var(--font-display)" }}
              >
                <Plus size={14} /> Upload document
              </button>
            </div>
          </div>
          {[
            {
              name: "Employers Liability Insurance 2026.pdf",
              size: "842 KB",
              date: "09 Aug 2026",
            },
            { name: "Public Liability Certificate.pdf", size: "1.1 MB", date: "09 Aug 2026" },
            { name: "Health and Safety Policy.docx", size: "234 KB", date: "22 Jul 2026" },
            { name: "Risk Assessment — Workshop.pdf", size: "1.8 MB", date: "22 Jul 2026" },
          ].map((doc) => (
            <div
              key={doc.name}
              className="flex items-center gap-3 px-5 py-3 border-b last:border-b-0 hover:bg-ep-blue-lighter"
              style={{ borderColor: "#eef2f7" }}
            >
              <FileText size={16} style={{ color: "#4b82c8", flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium break-words" style={{ color: "#1a2540" }}>
                  {doc.name}
                </p>
                <p className="text-xs" style={{ color: "#9ca3af" }}>
                  {doc.size} · Uploaded {doc.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Conversation Modal — 16px radius (rounded-2xl) */}
      {showConvModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="conv-modal-title"
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
            style={{ border: "none" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                id="conv-modal-title"
                className="text-lg font-semibold"
                style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
              >
                Record a conversation
              </h2>
              <button
                onClick={() => setShowConvModal(false)}
                className="p-1 rounded-xl"
                style={{ color: "#9ca3af" }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}
                >
                  Contact method
                </label>
                <select
                  value={convMethod}
                  onChange={(e) => setConvMethod(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2.5 text-sm"
                  style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none" }}
                >
                  {["Phone call", "Email follow-up", "Site visit", "Video call", "In person"].map(
                    (m) => (
                      <option key={m}>{m}</option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}
                >
                  Summary <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <textarea
                  value={convSummary}
                  onChange={(e) => {
                    setConvSummary(e.target.value);
                    setConvErrors((p) => ({ ...p, summary: "" }));
                  }}
                  placeholder="Summarise the conversation and any key points discussed…"
                  rows={4}
                  className="w-full rounded-xl border px-3 py-2.5 text-sm"
                  style={{
                    borderColor: convErrors.summary ? "#ef4444" : "#d5e2f0",
                    color: "#1a2540",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
                {convErrors.summary && (
                  <p className="mt-1 text-xs flex items-center gap-1" style={{ color: "#b91c1c" }}>
                    <AlertCircle size={12} /> {convErrors.summary}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}
                >
                  Agreed actions
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={convAction}
                    onChange={(e) => setConvAction(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && convAction.trim()) {
                        setConvActions((p) => [...p, convAction.trim()]);
                        setConvAction("");
                        e.preventDefault();
                      }
                    }}
                    placeholder="Add an action and press Enter"
                    className="flex-1 rounded-xl border px-3 py-2 text-sm"
                    style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none" }}
                  />
                  <button
                    onClick={() => {
                      if (convAction.trim()) {
                        setConvActions((p) => [...p, convAction.trim()]);
                        setConvAction("");
                      }
                    }}
                    className="px-3 py-2 rounded-xl text-sm"
                    style={{ backgroundColor: "#ebf3fc", color: "#1b5db4" }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {convActions.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {convActions.map((a, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between gap-2 text-sm px-3 py-2 rounded-xl"
                        style={{ backgroundColor: "#eef2f7" }}
                      >
                        <span style={{ color: "#1a2540" }}>{a}</span>
                        <button
                          onClick={() => setConvActions((p) => p.filter((_, j) => j !== i))}
                          style={{ color: "#9ca3af" }}
                        >
                          <X size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConvModal(false)}
                className="flex-1 py-2.5 rounded-xl border text-sm font-medium"
                style={{
                  borderColor: "#d5e2f0",
                  color: "#5b6a8a",
                  fontFamily: "var(--font-display)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitConv}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  backgroundColor: "#1b5db4",
                  color: "#fff",
                  fontFamily: "var(--font-display)",
                }}
              >
                Save conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
