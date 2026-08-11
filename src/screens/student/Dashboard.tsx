import { useState, useEffect } from "react";
import { useSharedState, nessieStatusMeta } from "../../store";
import {
  CheckCircle,
  Circle,
  MapPin,
  Calendar,
  Clock,
  MessageSquare,
  Phone,
  Upload,
  AlertCircle,
  BookOpen,
  Target,
  User,
  FileText,
  ChevronRight,
  Plus,
} from "lucide-react";

interface StudentDashboardProps {
  onAddToast: (type: "success" | "error" | "info", message: string) => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  required: boolean;
  done: boolean;
}

const initialChecklist: ChecklistItem[] = [
  { id: "c1", label: "Complete pre-placement health declaration", required: true, done: true },
  { id: "c2", label: "Upload copy of ID (passport or driving licence)", required: true, done: true },
  { id: "c3", label: "Read and sign placement agreement", required: true, done: false },
  { id: "c4", label: "Complete online safeguarding awareness module", required: true, done: false },
  { id: "c5", label: "Review employer information pack", required: false, done: false },
  { id: "c6", label: "Confirm travel arrangements with placement coordinator", required: false, done: false },
];

const objectives = [
  { type: "Knowledge", desc: "Understand the principles and values of health and social care" },
  { type: "Skills", desc: "Demonstrate a high level of communication with service users and colleagues" },
  { type: "Skills", desc: "Always listen to different points of view and respond professionally" },
  { type: "Behaviour", desc: "Always arrive prepared with the tools and materials needed for the day" },
  { type: "Knowledge", desc: "Understand safeguarding legislation and your duty to report concerns" },
];

const schedule = [
  { date: "Mon 14 Sep", activity: "Induction day — meet team", time: "08:30–16:30" },
  { date: "Tue 15 Sep", activity: "Observation with Janine Okafor", time: "08:30–16:30" },
  { date: "Wed 16 Sep", activity: "Tutor visit — Mrs J. Pearce", time: "10:00–11:30" },
  { date: "Thu 17 Sep", activity: "Practical care activities — supervised", time: "08:30–16:30" },
];

function SectionCard({
  title,
  children,
  action,
  onAction,
}: {
  title: string;
  children: React.ReactNode;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="ep-card">
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
            {action} <ChevronRight size={12} />
          </button>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function StudentDashboard({ onAddToast }: StudentDashboardProps) {
  const { nessieStatus, mayaDoneIds, toggleMayaTask } = useSharedState();
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    initialChecklist.map((item) => ({ ...item, done: ["c1", "c2"].includes(item.id) })),
  );
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  // Keep local checklist in sync with shared mayaDoneIds
  useEffect(() => {
    setChecklist((prev) =>
      prev.map((item) => ({ ...item, done: mayaDoneIds.has(item.id) })),
    );
  }, [mayaDoneIds]);

  const toggleItem = (id: string) => {
    const item = checklist.find((c) => c.id === id);
    if (!item) return;
    if (!item.done) onAddToast("success", "Task marked complete. Well done!");
    toggleMayaTask(id);
  };

  const completedCount = checklist.filter((c) => c.done).length;
  const requiredCount = checklist.filter((c) => c.required).length;
  const requiredDone = checklist.filter((c) => c.required && c.done).length;
  const progress = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="ep-page">
      {/* Page header — same pattern as coordinator dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className="ep-page-title"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#1a2540" }}
          >
            Welcome back, Maya
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#5b6a8a" }}>
            Monday, 11 August 2026 · Health and Social Care L3
          </p>
        </div>
        <button
          onClick={() => onAddToast("info", "Support request sent to Mrs J. Pearce.")}
          className="flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold"
          style={{ borderColor: "#d5e2f0", color: "#1b5db4", fontFamily: "var(--font-display)", backgroundColor: "#fff" }}
        >
          <MessageSquare size={15} />
          Report a problem
        </button>
      </div>

      {/* Placement status strip */}
      <div className="ep-surface p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div>
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: nessieStatusMeta[nessieStatus].bg,
                    color: nessieStatusMeta[nessieStatus].text,
                  }}
                >
                  {nessieStatusMeta[nessieStatus].label}
                </span>
                <p className="text-xs mt-1.5" style={{ color: "#5b6a8a" }}>Placement status</p>
              </div>
            </div>
            <div>
              <p
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-display)", color: "#1a2540", lineHeight: 1 }}
              >
                Nessie Nursery
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#5b6a8a" }}>Employer</p>
            </div>
            <div>
              <p
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-display)", color: "#1a2540", lineHeight: 1 }}
              >
                2 Sep – 14 Nov
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#5b6a8a" }}>Placement dates</p>
            </div>
            <div>
              <p
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-display)", color: "#1a2540", lineHeight: 1 }}
              >
                30 hrs/wk
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#5b6a8a" }}>Weekly hours</p>
            </div>
          </div>
          <div>
            <p
              className="text-sm font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
            >
              {requiredDone} of {requiredCount} required tasks complete
            </p>
            <div className="mt-1.5 h-2 rounded-full" style={{ backgroundColor: "#e8f0f8", minWidth: 160 }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                  backgroundColor: progress === 100 ? "#22c55e" : "#1b5db4",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alert for incomplete required tasks */}
      {requiredDone < requiredCount && (
        <div
          className="flex items-start gap-3 rounded-xl border px-5 py-4 mb-6"
          style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}
          role="alert"
        >
          <AlertCircle size={18} style={{ color: "#b91c1c", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "#b91c1c", fontFamily: "var(--font-display)" }}>
              {requiredCount - requiredDone} required task{requiredCount - requiredDone > 1 ? "s" : ""} outstanding
            </p>
            <p className="text-sm mt-0.5" style={{ color: "#b91c1c" }}>
              These must be completed before your placement begins on 2 September 2026.
            </p>
          </div>
        </div>
      )}

      {/* Main two-column grid on desktop, single column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main column (2/3 width) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Pre-placement checklist */}
          <SectionCard title="Pre-placement checklist">
            <ul>
              {checklist.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 px-5 py-3.5 border-b last:border-b-0 transition-colors hover:bg-ep-blue-lighter"
                  style={{ borderColor: "#eef2f7" }}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="flex-shrink-0"
                    style={{ color: item.done ? "#22c55e" : "#d5e2f0", minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                    aria-label={item.done ? `Mark "${item.label}" incomplete` : `Mark "${item.label}" complete`}
                  >
                    {item.done ? <CheckCircle size={20} /> : <Circle size={20} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm"
                      style={{
                        color: item.done ? "#5b6a8a" : "#1a2540",
                        textDecoration: item.done ? "line-through" : "none",
                      }}
                    >
                      {item.label}
                    </p>
                    {item.required && !item.done && (
                      <p className="text-xs mt-0.5 font-medium" style={{ color: "#b91c1c" }}>Required</p>
                    )}
                    {!item.required && (
                      <p className="text-xs mt-0.5" style={{ color: "#5b6a8a" }}>Optional</p>
                    )}
                  </div>
                  {!item.done && item.label.toLowerCase().includes("upload") && (
                    <button
                      onClick={() => onAddToast("info", "Choose a file to upload.")}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium"
                      style={{ backgroundColor: "#ebf3fc", color: "#1b5db4", fontFamily: "var(--font-display)" }}
                      aria-label="Upload file"
                    >
                      <Upload size={13} /> Upload
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Upcoming schedule */}
          <SectionCard title="Upcoming schedule">
            <ul>
              {schedule.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 px-5 py-3.5 border-b last:border-b-0"
                  style={{ borderColor: "#eef2f7" }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#ebf3fc" }}
                  >
                    <Calendar size={15} style={{ color: "#1b5db4" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                      {s.activity}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#5b6a8a" }}>
                      {s.date}
                    </p>
                  </div>
                  <span className="text-xs flex-shrink-0 flex items-center gap-1" style={{ color: "#5b6a8a" }}>
                    <Clock size={11} /> {s.time}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Learning objectives */}
          <SectionCard title="Learning objectives">
            <ul>
              {objectives.map((o, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 px-5 py-3.5 border-b last:border-b-0"
                  style={{ borderColor: "#eef2f7" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "#ebf3fc" }}
                  >
                    {o.type === "Knowledge" ? (
                      <BookOpen size={13} style={{ color: "#1b5db4" }} />
                    ) : o.type === "Behaviour" ? (
                      <Target size={13} style={{ color: "#1b5db4" }} />
                    ) : (
                      <CheckCircle size={13} style={{ color: "#1b5db4" }} />
                    )}
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "#1b5db4", fontFamily: "var(--font-display)" }}
                    >
                      {o.type}
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: "#1a2540", lineHeight: 1.6 }}>
                      {o.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        {/* Supporting column (1/3 width) */}
        <div className="space-y-5">
          {/* Placement details */}
          <SectionCard title="Placement details">
            <dl>
              {[
                { key: "Employer", val: "Nessie Nursery", icon: MapPin },
                { key: "Address", val: "Stanley Park Road, Northbridge, FY3 9DT", icon: MapPin },
                { key: "Dates", val: "2 Sep – 14 Nov 2026", icon: Calendar },
                { key: "Hours", val: "Mon–Fri, 08:30–16:30", icon: Clock },
                { key: "Mode", val: "Block placement", icon: null },
                { key: "Supervisor", val: "Janine Okafor", icon: User },
                { key: "Coordinator", val: "Sarah Ahmed", icon: User },
                { key: "Tutor", val: "Mrs J. Pearce", icon: User },
              ].map(({ key, val }) => (
                <div
                  key={key}
                  className="flex gap-3 px-5 py-3 border-b last:border-b-0"
                  style={{ borderColor: "#eef2f7" }}
                >
                  <dt className="w-24 text-xs flex-shrink-0 pt-0.5" style={{ color: "#5b6a8a" }}>{key}</dt>
                  <dd className="text-sm" style={{ color: "#1a2540" }}>{val}</dd>
                </div>
              ))}
            </dl>
            <div className="px-5 py-3">
              <a
                href="#"
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: "#1b5db4", fontFamily: "var(--font-display)" }}
                onClick={(e) => { e.preventDefault(); onAddToast("info", "Opening directions in Maps."); }}
              >
                <MapPin size={14} /> Get directions
              </a>
            </div>
          </SectionCard>

          {/* Contact */}
          <SectionCard title="Contact">
            <div className="px-5 py-4 space-y-3">
              {[
                { label: "Supervisor", name: "Janine Okafor", phone: "07891 234 568", role: "Deputy Manager" },
                { label: "Tutor", name: "Mrs J. Pearce", phone: "01253 000 100", role: "Health & Social Care" },
                { label: "Coordinator", name: "Sarah Ahmed", phone: "01253 000 200", role: "Placement Coordinator" },
              ].map((c) => (
                <div key={c.label} className="pb-3 border-b last:border-b-0 last:pb-0" style={{ borderColor: "#eef2f7" }}>
                  <p className="text-xs mb-1" style={{ color: "#5b6a8a" }}>{c.label}</p>
                  <p className="text-sm font-medium" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                    {c.name}
                  </p>
                  <p className="text-xs" style={{ color: "#5b6a8a" }}>{c.role}</p>
                  <a
                    href={`tel:${c.phone}`}
                    className="flex items-center gap-1.5 text-xs mt-1.5"
                    style={{ color: "#1b5db4" }}
                  >
                    <Phone size={11} /> {c.phone}
                  </a>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Documents */}
          <SectionCard title="Documents" action="View all" onAction={() => onAddToast("info", "Opening documents section.")}>
            <ul>
              {[
                { name: "Placement agreement.pdf", status: "Signed", color: "#22c55e" },
                { name: "Health declaration.pdf", status: "Complete", color: "#22c55e" },
                { name: "Safeguarding module certificate", status: "Required", color: "#b91c1c" },
              ].map((d) => (
                <li
                  key={d.name}
                  className="flex items-center gap-3 px-5 py-3 border-b last:border-b-0"
                  style={{ borderColor: "#eef2f7" }}
                >
                  <FileText size={15} style={{ color: "#4b82c8", flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: "#1a2540" }}>{d.name}</p>
                  </div>
                  <span className="text-xs font-medium flex-shrink-0" style={{ color: d.color }}>
                    {d.status}
                  </span>
                </li>
              ))}
            </ul>
            <div className="px-5 py-3">
              <button
                onClick={() => onAddToast("info", "Choose a file to upload.")}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md border text-sm font-medium"
                style={{ borderColor: "#d5e2f0", color: "#1b5db4", fontFamily: "var(--font-display)", borderStyle: "dashed" }}
              >
                <Plus size={14} /> Upload document
              </button>
            </div>
          </SectionCard>

          {/* Messages */}
          <SectionCard title="Messages" action="View all" onAction={() => setShowMessage(true)}>
            {[
              { sender: "Sarah Ahmed", text: "Your placement at Nessie Nursery starts 2 Sep. Let me know if you have any questions.", time: "Today 09:15", unread: true },
              { sender: "Mrs J. Pearce", text: "Don't forget to complete your safeguarding module before placement begins.", time: "Yesterday", unread: false },
            ].map((m, i) => (
              <button
                key={i}
                className="w-full flex items-start gap-3 px-5 py-3 border-b text-left transition-colors hover:bg-ep-blue-lighter"
                style={{ borderColor: "#eef2f7" }}
                onClick={() => setShowMessage(true)}
                aria-label={`Message from ${m.sender}`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: m.unread ? "#ebf3fc" : "#f3f4f6" }}
                >
                  <MessageSquare size={13} style={{ color: m.unread ? "#1b5db4" : "#5b6a8a" }} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#1a2540", fontFamily: "var(--font-display)", fontWeight: m.unread ? 600 : 400 }}
                    >
                      {m.sender}
                    </p>
                    <span className="text-xs flex-shrink-0" style={{ color: "#5b6a8a" }}>{m.time}</span>
                  </div>
                  <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "#5b6a8a" }}>{m.text}</p>
                </div>
              </button>
            ))}
            <div className="px-5 py-3">
              <button
                onClick={() => setShowMessage(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold"
                style={{ backgroundColor: "#1b5db4", color: "#fff", fontFamily: "var(--font-display)" }}
              >
                <MessageSquare size={14} /> Send a message
              </button>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Message modal */}
      {showMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="msg-modal-title"
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            style={{ border: "1px solid #d5e2f0" }}
          >
            <h2
              id="msg-modal-title"
              className="text-lg font-semibold mb-1"
              style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
            >
              Send a message
            </h2>
            <p className="text-sm mb-4" style={{ color: "#5b6a8a" }}>
              Your tutor or coordinator will usually reply within one working day.
            </p>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                Send to
              </label>
              <select
                className="w-full rounded-md border px-3 py-2.5 text-sm"
                style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none" }}
              >
                <option>Mrs J. Pearce — Tutor</option>
                <option>Sarah Ahmed — Placement Coordinator</option>
                <option>Janine Okafor — Supervisor</option>
              </select>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here…"
              rows={4}
              className="w-full rounded-md border px-3 py-2.5 text-sm"
              style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none", resize: "vertical" }}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowMessage(false); setMessage(""); }}
                className="flex-1 py-2.5 rounded-md border text-sm font-medium"
                style={{ borderColor: "#d5e2f0", color: "#5b6a8a", fontFamily: "var(--font-display)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowMessage(false);
                  setMessage("");
                  onAddToast("success", "Message sent.");
                }}
                className="flex-1 py-2.5 rounded-md text-sm font-semibold"
                style={{ backgroundColor: "#1b5db4", color: "#fff", fontFamily: "var(--font-display)" }}
              >
                Send message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
