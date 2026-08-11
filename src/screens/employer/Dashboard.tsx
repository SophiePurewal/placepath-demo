import {
  CheckCircle,
  Clock,
  Users,
  MessageSquare,
  FileText,
  Building2,
  AlertCircle,
  Check,
  X,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { useSharedState, nessieStatusMeta } from "../../store";

interface EmployerDashboardProps {
  onAddToast: (type: "success" | "error" | "info", message: string) => void;
}

type RequestAction = "pending" | "accepted" | "declined" | "change-requested";

interface PlacementRequest {
  id: string;
  course: string;
  college: string;
  studentName?: string;
  studentCount: number;
  startDate: string;
  endDate: string;
  mode: string;
  coordinator: string;
  action: RequestAction;
  isShared?: boolean;
}

const electricalRequest: PlacementRequest = {
  id: "r1",
  course: "Electrical Installation L2",
  college: "Northbridge College",
  studentCount: 3,
  startDate: "07 Oct 2026",
  endDate: "25 Oct 2026",
  mode: "Block",
  coordinator: "Sarah Ahmed",
  action: "pending",
};

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`ep-card ${className ?? ""}`}>
      <div className="px-5 py-4 border-b" style={{ borderColor: "#eef2f7" }}>
        <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ fontFamily: "var(--font-display)", color: "#1a2540", letterSpacing: "0.06em" }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

export default function EmployerDashboard({ onAddToast }: EmployerDashboardProps) {
  const { nessieStatus, setNessieStatus, davidChangeMessage, setDavidChangeMessage, addActivity } =
    useSharedState();

  const [elecRequest, setElecRequest] = useState<PlacementRequest>(electricalRequest);
  const [changeText, setChangeText] = useState("");
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [supervisor, setSupervisor] = useState("");
  const [showSupervisorInput, setShowSupervisorInput] = useState(false);

  const handleElecAction = (action: "accepted" | "declined") => {
    setElecRequest((r) => ({ ...r, action }));
    if (action === "accepted") onAddToast("success", "Placement request accepted. The college has been notified.");
    if (action === "declined") onAddToast("info", "Placement request declined.");
  };

  const handleNessieAccept = () => {
    setNessieStatus("employer-accepted");
    addActivity("David Hughes", "Accepted the Health & Social Care L3 placement request from Northbridge College.");
    onAddToast("success", "Placement accepted. Northbridge College has been notified.");
    setShowSupervisorInput(true);
  };

  const handleNessieDecline = () => {
    onAddToast("info", "Placement request declined.");
    addActivity("David Hughes", "Declined the Health & Social Care L3 placement request.");
  };

  const handleNessieChange = () => {
    if (!changeText.trim()) return;
    setNessieStatus("change-requested");
    setDavidChangeMessage(changeText.trim());
    addActivity("David Hughes", `Requested a schedule change: "${changeText.trim()}"`);
    onAddToast("info", "Change request sent to Sarah Ahmed.");
    setChangeText("");
    setShowChangeModal(false);
  };

  const handleNominateSupervisor = () => {
    if (!supervisor.trim()) return;
    addActivity("David Hughes", `Nominated ${supervisor.trim()} as workplace supervisor.`);
    onAddToast("success", `${supervisor.trim()} nominated as workplace supervisor.`);
    setShowSupervisorInput(false);
  };

  const ddItems = [
    { label: "Employers liability insurance", done: true },
    { label: "Public liability insurance", done: true },
    { label: "Risk assessment completed", done: true },
    { label: "Health and safety policy", done: true },
    { label: "Enhanced DBS check — Marcus Webb", done: false },
    { label: "Safeguarding policy", done: true },
  ];

  const nessieMeta = nessieStatusMeta[nessieStatus];

  return (
    <div className="ep-page">
      <div className="mb-6">
        <h1 className="ep-page-title" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#1a2540" }}>
          Welcome back, David
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#5b6a8a" }}>
          Monday, 11 August 2026 · Nessie Nursery
        </p>
      </div>

      {/* Summary strip */}
      <div className="ep-surface grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4">
        {[
          { label: "Placement requests", val: "2", icon: Clock, color: "#f59e0b" },
          { label: "Active placements", val: "3", icon: CheckCircle, color: "#22c55e" },
          { label: "Students this term", val: "1", icon: Users, color: "#1b5db4" },
          { label: "Pending actions", val: "2", icon: AlertCircle, color: "#ef4444" },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#1a2540", lineHeight: 1 }}>{val}</p>
              <p className="text-xs mt-0.5" style={{ color: "#5b6a8a" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-5">

          {/* Nessie Nursery — shared placement request */}
          <Card title="Placement Requests">
            {/* Nessie Nursery request */}
            <div className="px-5 py-4 border-b" style={{ borderColor: "#eef2f7" }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}>
                    Health and Social Care L3
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#5b6a8a" }}>
                    Northbridge College · Maya Thompson
                  </p>
                </div>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ backgroundColor: nessieMeta.bg, color: nessieMeta.text }}
                >
                  {nessieMeta.label}
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-xs mb-4">
                {[
                  { k: "Start date", v: "2 Sep 2026" },
                  { k: "End date", v: "14 Nov 2026" },
                  { k: "Mode", v: "Block placement" },
                  { k: "Hours", v: "30 hrs/week" },
                  { k: "Coordinator", v: "Sarah Ahmed" },
                  { k: "Student", v: "Maya Thompson" },
                ].map(({ k, v }) => (
                  <div key={k}>
                    <dt style={{ color: "#5b6a8a" }}>{k}</dt>
                    <dd style={{ color: "#1a2540" }}>{v}</dd>
                  </div>
                ))}
              </dl>

              {/* Change requested message */}
              {nessieStatus === "change-requested" && davidChangeMessage && (
                <div className="mb-3 rounded-md px-3 py-2 text-sm" style={{ backgroundColor: "#fef3c7", borderLeft: "3px solid #f59e0b" }}>
                  <p className="font-medium" style={{ color: "#92400e" }}>Change requested:</p>
                  <p style={{ color: "#92400e" }}>{davidChangeMessage}</p>
                </div>
              )}

              {/* Action buttons when awaiting */}
              {nessieStatus === "awaiting-employer" && (
                <div className="flex gap-2">
                  <button
                    onClick={handleNessieAccept}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-semibold"
                    style={{ backgroundColor: "#15803d", color: "#fff", fontFamily: "var(--font-display)" }}
                  >
                    <Check size={14} /> Accept
                  </button>
                  <button
                    onClick={() => setShowChangeModal(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md border text-sm font-medium"
                    style={{ borderColor: "#f59e0b", color: "#92400e", fontFamily: "var(--font-display)", backgroundColor: "#fffbeb" }}
                  >
                    <MessageCircle size={14} /> Request change
                  </button>
                  <button
                    onClick={handleNessieDecline}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border text-sm font-medium"
                    style={{ borderColor: "#d5e2f0", color: "#5b6a8a", fontFamily: "var(--font-display)" }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Supervisor nomination after acceptance */}
              {nessieStatus === "employer-accepted" && showSupervisorInput && (
                <div className="mt-2">
                  <label className="block text-xs font-medium mb-1" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                    Nominate a workplace supervisor
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={supervisor}
                      onChange={(e) => setSupervisor(e.target.value)}
                      placeholder="Full name"
                      className="flex-1 rounded-md border px-3 py-2 text-sm"
                      style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none" }}
                    />
                    <button
                      onClick={handleNominateSupervisor}
                      disabled={!supervisor.trim()}
                      className="px-3 py-2 rounded-md text-sm font-semibold"
                      style={{ backgroundColor: "#1b5db4", color: "#fff", fontFamily: "var(--font-display)" }}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}

              {(nessieStatus === "employer-accepted" || nessieStatus === "confirmed") && !showSupervisorInput && (
                <p className="text-sm" style={{ color: "#15803d" }}>
                  ✓ You have accepted this placement request.
                </p>
              )}
            </div>

            {/* Electrical Installation request */}
            <div className="px-5 py-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}>
                    {electricalRequest.course}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#5b6a8a" }}>
                    {electricalRequest.college} · {electricalRequest.studentCount} students
                  </p>
                </div>
                {elecRequest.action === "pending" && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "#fef3c7", color: "#92400e" }}>
                    Awaiting response
                  </span>
                )}
                {elecRequest.action === "accepted" && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "#f0fdf4", color: "#15803d" }}>
                    Accepted
                  </span>
                )}
                {elecRequest.action === "declined" && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}>
                    Declined
                  </span>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-2 text-xs mb-4">
                {[
                  { k: "Start date", v: electricalRequest.startDate },
                  { k: "End date", v: electricalRequest.endDate },
                  { k: "Mode", v: electricalRequest.mode },
                  { k: "Coordinator", v: electricalRequest.coordinator },
                ].map(({ k, v }) => (
                  <div key={k}>
                    <dt style={{ color: "#5b6a8a" }}>{k}</dt>
                    <dd style={{ color: "#1a2540" }}>{v}</dd>
                  </div>
                ))}
              </dl>
              {elecRequest.action === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleElecAction("accepted")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-semibold"
                    style={{ backgroundColor: "#15803d", color: "#fff", fontFamily: "var(--font-display)" }}
                  >
                    <Check size={14} /> Accept
                  </button>
                  <button
                    onClick={() => handleElecAction("declined")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md border text-sm font-medium"
                    style={{ borderColor: "#d5e2f0", color: "#5b6a8a", fontFamily: "var(--font-display)" }}
                  >
                    <X size={14} /> Decline
                  </button>
                </div>
              )}
            </div>
          </Card>

          {/* Organisation details */}
          <Card title="Organisation Details">
            <div className="px-5 py-4 space-y-3">
              {[
                { key: "Name", val: "Nessie Nursery" },
                { key: "Address", val: "Stanley Park Road, Northbridge, FY3 9DT" },
                { key: "Telephone", val: "01253 400 123" },
                { key: "Sector", val: "Early Years and Childcare" },
                { key: "Legal status", val: "Limited Company" },
                { key: "Employees", val: "22" },
              ].map(({ key, val }) => (
                <div key={key} className="flex gap-4">
                  <dt className="w-32 text-xs flex-shrink-0" style={{ color: "#5b6a8a" }}>{key}</dt>
                  <dd className="text-sm" style={{ color: "#1a2540" }}>{val}</dd>
                </div>
              ))}
              <button
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-md border text-sm font-medium"
                style={{ borderColor: "#d5e2f0", color: "#1b5db4", fontFamily: "var(--font-display)" }}
                onClick={() => onAddToast("info", "Edit organisation details.")}
              >
                <Building2 size={14} /> Edit details
              </button>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Due diligence */}
          <Card title="Due Diligence Checklist">
            <ul>
              {ddItems.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between px-5 py-3 border-b last:border-b-0"
                  style={{ borderColor: "#eef2f7" }}
                >
                  <span className="text-sm" style={{ color: "#1a2540" }}>{item.label}</span>
                  {item.done ? (
                    <CheckCircle size={16} style={{ color: "#22c55e", flexShrink: 0 }} />
                  ) : (
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}>
                      Required
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <div className="px-5 py-3">
              <button
                onClick={() => onAddToast("info", "Choose a document to upload.")}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md border text-sm font-medium"
                style={{ borderColor: "#d5e2f0", color: "#1b5db4", fontFamily: "var(--font-display)" }}
              >
                <FileText size={14} /> Upload missing document
              </button>
            </div>
          </Card>

          {/* Messages */}
          <Card title="Messages">
            {[
              { sender: "Sarah Ahmed", subject: "Placement timetable — October block", time: "Today 11.43", unread: true },
              { sender: "Sarah Ahmed", subject: "Risk assessment form — please review", time: "Yesterday 09.15", unread: false },
            ].map((m, i) => (
              <button
                key={i}
                className="w-full flex items-start gap-3 px-5 py-3 border-b last:border-b-0 text-left transition-colors hover:bg-ep-blue-lighter"
                style={{ borderColor: "#eef2f7" }}
                aria-label={`Message from ${m.sender}: ${m.subject}`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                  style={{ backgroundColor: m.unread ? "#ebf3fc" : "#f3f4f6" }}
                >
                  <MessageSquare size={13} style={{ color: m.unread ? "#1b5db4" : "#5b6a8a" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium" style={{ color: "#1a2540", fontFamily: "var(--font-display)", fontWeight: m.unread ? 600 : 400 }}>
                      {m.sender}
                    </p>
                    <span className="text-xs flex-shrink-0" style={{ color: "#5b6a8a" }}>{m.time}</span>
                  </div>
                  <p className="text-sm truncate mt-0.5" style={{ color: "#5b6a8a" }}>{m.subject}</p>
                </div>
                {m.unread && <span className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: "#1b5db4" }} aria-label="Unread" />}
              </button>
            ))}
            <div className="px-5 py-3">
              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold"
                style={{ backgroundColor: "#1b5db4", color: "#fff", fontFamily: "var(--font-display)" }}
                onClick={() => onAddToast("info", "Opening messages.")}
              >
                <MessageSquare size={14} /> Send message
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Change request modal */}
      {showChangeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="change-modal-title"
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 id="change-modal-title" className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}>
              Request a schedule change
            </h2>
            <p className="text-sm mb-4" style={{ color: "#5b6a8a" }}>
              Describe the change you need. Sarah Ahmed will receive this message and update the request.
            </p>
            <textarea
              value={changeText}
              onChange={(e) => setChangeText(e.target.value)}
              placeholder="e.g. The start date needs to move to 8 September as we have a staff induction on 2 September."
              rows={4}
              className="w-full rounded-md border px-3 py-2.5 text-sm mb-4"
              style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none", resize: "vertical" }}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowChangeModal(false); setChangeText(""); }}
                className="flex-1 py-2.5 rounded-md border text-sm font-medium"
                style={{ borderColor: "#d5e2f0", color: "#5b6a8a", fontFamily: "var(--font-display)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleNessieChange}
                disabled={!changeText.trim()}
                className="flex-1 py-2.5 rounded-md text-sm font-semibold"
                style={{ backgroundColor: "#1b5db4", color: "#fff", fontFamily: "var(--font-display)" }}
              >
                Send request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
