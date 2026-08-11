import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Plus,
  X,
  Search,
  FileText,
  Users,
  Calendar,
  Building2,
  Shield,
  Eye,
  CheckCircle,
} from "lucide-react";
import { courses, learningObjectiveTypes, employers } from "../../data";
import type { Screen } from "../../components/Sidebar";

interface CreatePlacementProps {
  onNavigate: (screen: Screen) => void;
  onAddToast: (type: "success" | "error" | "info", message: string) => void;
}

const STEPS = [
  { id: 1, label: "Course & Objectives", icon: FileText },
  { id: 2, label: "Students", icon: Users },
  { id: 3, label: "Schedule", icon: Calendar },
  { id: 4, label: "Employer", icon: Building2 },
  { id: 5, label: "Due Diligence", icon: Shield },
  { id: 6, label: "Review & Confirm", icon: Eye },
];

type Group = "A" | "B" | "C" | "D" | "E" | "F";

export default function CreatePlacement({ onNavigate, onAddToast }: CreatePlacementProps) {
  const [step, setStep] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 1
  const [course, setCourse] = useState("");
  const [includeObjectives, setIncludeObjectives] = useState(true);
  const [objectives, setObjectives] = useState<string[]>([]);
  const [selectedObjType, setSelectedObjType] = useState("");
  const [objDetail, setObjDetail] = useState("");

  // Step 2
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [studentCount, setStudentCount] = useState("");

  // Step 3
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [mode, setMode] = useState("Block");
  const [hoursPerWeek, setHoursPerWeek] = useState("");

  // Step 4
  const [employerSearch, setEmployerSearch] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState("");

  // Step 5
  const [ddChecks, setDdChecks] = useState<Record<string, boolean>>({
    "Employers liability insurance": false,
    "Public liability insurance": false,
    "Risk assessment completed": false,
    "Health and safety policy": false,
    "Enhanced DBS check for supervisors": false,
    "Safeguarding policy": false,
  });

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!course) e.course = "Please select a course.";
    }
    if (step === 2) {
      if (selectedGroups.length === 0) e.groups = "Please select at least one student group.";
    }
    if (step === 3) {
      if (!startDate) e.startDate = "Please enter a start date.";
      if (!endDate) e.endDate = "Please enter an end date.";
    }
    if (step === 4) {
      if (!selectedEmployer) e.employer = "Please select an employer.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setStep((s) => Math.min(s + 1, 6));
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const addObjective = () => {
    if (!selectedObjType) return;
    const label = selectedObjType + (objDetail ? ` — ${objDetail}` : "");
    setObjectives((prev) => [...prev, label]);
    setSelectedObjType("");
    setObjDetail("");
  };

  const toggleGroup = (g: Group) => {
    setSelectedGroups((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const filteredEmployers = employers.filter((e) =>
    e.name.toLowerCase().includes(employerSearch.toLowerCase())
  );

  const saveDraft = () => {
    onAddToast("info", "Placement saved as draft.");
  };

  const confirm = () => {
    setShowConfirm(false);
    onAddToast("success", "Placement plan submitted successfully.");
    setTimeout(() => onNavigate("placements"), 600);
  };

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => onNavigate("dashboard")}
          className="p-2 rounded-md transition-colors hover:bg-ep-blue-light"
          style={{ color: "#5b6a8a" }}
          aria-label="Back to dashboard"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1
            className="text-xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#1a2540" }}
          >
            Create New Placement
          </h1>
          <p className="text-sm" style={{ color: "#5b6a8a" }}>
            Step {step} of {STEPS.length}
          </p>
        </div>
        <button
          onClick={saveDraft}
          className="ml-auto text-sm font-medium px-3 py-2 rounded-md border transition-colors hover:bg-ep-blue-lighter"
          style={{ color: "#1b5db4", borderColor: "#bdd5f4", fontFamily: "var(--font-display)" }}
        >
          Save draft
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-1">
        {STEPS.map((s, i) => {
          const done = s.id < step;
          const active = s.id === step;
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{
                    backgroundColor: done ? "#15803d" : active ? "#1b5db4" : "#e5ecf5",
                    color: done || active ? "#fff" : "#5b6a8a",
                  }}
                >
                  {done ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <span
                  className="text-xs whitespace-nowrap hidden sm:block"
                  style={{
                    color: active ? "#1b5db4" : done ? "#15803d" : "#9ca3af",
                    fontFamily: "var(--font-display)",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="h-0.5 mx-2 flex-1"
                  style={{
                    width: 32,
                    backgroundColor: done ? "#15803d" : "#e5ecf5",
                    minWidth: 20,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div
        className="bg-white rounded-xl border p-6"
        style={{ borderColor: "#d5e2f0" }}
      >
        {/* ── Step 1: Course & Objectives ── */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}>
              Course and learning objectives
            </h2>

            <div>
              <label
                htmlFor="course"
                className="block text-sm font-medium mb-1"
                style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}
              >
                Course title <span style={{ color: "#b91c1c" }}>*</span>
              </label>
              <select
                id="course"
                value={course}
                onChange={(e) => { setCourse(e.target.value); setErrors((p) => ({ ...p, course: "" })); }}
                className="w-full rounded-md border px-3 py-2.5 text-sm"
                style={{ borderColor: errors.course ? "#ef4444" : "#d5e2f0", color: course ? "#1a2540" : "#9ca3af", outline: "none" }}
              >
                <option value="">Select the course title</option>
                {courses.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.course && (
                <p className="mt-1 text-xs flex items-center gap-1" style={{ color: "#b91c1c" }}>
                  <AlertCircle size={12} /> {errors.course}
                </p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                Include a set of learning objectives?
              </p>
              <div className="flex items-center gap-6">
                {[true, false].map((v) => (
                  <label key={String(v)} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="objectives"
                      checked={includeObjectives === v}
                      onChange={() => setIncludeObjectives(v)}
                      style={{ accentColor: "#1b5db4" }}
                    />
                    <span style={{ color: "#1a2540" }}>{v ? "Yes" : "No"}</span>
                  </label>
                ))}
              </div>
            </div>

            {includeObjectives && (
              <div
                className="rounded-lg p-4 border"
                style={{ backgroundColor: "#f4f7fb", borderColor: "#d5e2f0" }}
              >
                <p className="text-sm font-medium mb-3" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                  Add learning objectives
                </p>
                <div className="flex gap-2 mb-2">
                  <select
                    value={selectedObjType}
                    onChange={(e) => setSelectedObjType(e.target.value)}
                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                    style={{ borderColor: "#d5e2f0", color: selectedObjType ? "#1a2540" : "#9ca3af", outline: "none" }}
                  >
                    <option value="">Select type of learning objective</option>
                    {learningObjectiveTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button
                    onClick={addObjective}
                    className="px-3 py-2 rounded-md text-sm font-medium"
                    style={{ backgroundColor: "#1b5db4", color: "#fff", fontFamily: "var(--font-display)" }}
                  >
                    Add
                  </button>
                </div>
                <textarea
                  value={objDetail}
                  onChange={(e) => setObjDetail(e.target.value)}
                  placeholder="Describe the learning objective (optional)"
                  rows={2}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none", resize: "none" }}
                />
                {objectives.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {objectives.map((o, i) => (
                      <li
                        key={i}
                        className="flex items-start justify-between gap-2 text-sm rounded-md px-3 py-2"
                        style={{ backgroundColor: "#fff", border: "1px solid #d5e2f0" }}
                      >
                        <span style={{ color: "#1a2540" }}>{o}</span>
                        <button
                          onClick={() => setObjectives((prev) => prev.filter((_, j) => j !== i))}
                          style={{ color: "#9ca3af" }}
                          aria-label="Remove objective"
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Students ── */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}>
              Student groups
            </h2>

            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                Select student groups <span style={{ color: "#b91c1c" }}>*</span>
              </p>
              <p className="text-xs mb-3" style={{ color: "#5b6a8a" }}>
                Choose the groups that will participate in this placement.
              </p>
              <div className="grid grid-cols-4 gap-2">
                {(["A", "B", "C", "D", "E", "F"] as Group[]).map((g) => {
                  const sel = selectedGroups.includes(g);
                  return (
                    <button
                      key={g}
                      onClick={() => { toggleGroup(g); setErrors((p) => ({ ...p, groups: "" })); }}
                      className="flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors"
                      style={{
                        borderColor: sel ? "#1b5db4" : "#d5e2f0",
                        backgroundColor: sel ? "#ebf3fc" : "#fff",
                        color: sel ? "#1b5db4" : "#1a2540",
                        fontFamily: "var(--font-display)",
                      }}
                      aria-pressed={sel}
                    >
                      {sel ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-full border" style={{ borderColor: "#d5e2f0" }} />}
                      Group {g}
                    </button>
                  );
                })}
              </div>
              {errors.groups && (
                <p className="mt-2 text-xs flex items-center gap-1" style={{ color: "#b91c1c" }}>
                  <AlertCircle size={12} /> {errors.groups}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                Estimated number of students
              </label>
              <input
                type="number"
                value={studentCount}
                onChange={(e) => setStudentCount(e.target.value)}
                min={1}
                max={40}
                placeholder="e.g. 12"
                className="w-32 rounded-md border px-3 py-2.5 text-sm"
                style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none" }}
              />
            </div>
          </div>
        )}

        {/* ── Step 3: Schedule ── */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}>
              Schedule and requirements
            </h2>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                Schedule title
              </label>
              <input
                type="text"
                value={scheduleTitle}
                onChange={(e) => setScheduleTitle(e.target.value)}
                placeholder={course ? `${course} — ${selectedGroups.map((g) => `Group ${g}`).join(", ")}` : "e.g. Childcare T-Level Year 2 — Group A, B"}
                className="w-full rounded-md border px-3 py-2.5 text-sm"
                style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                  Start date <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setErrors((p) => ({ ...p, startDate: "" })); }}
                  className="w-full rounded-md border px-3 py-2.5 text-sm"
                  style={{ borderColor: errors.startDate ? "#ef4444" : "#d5e2f0", color: "#1a2540", outline: "none" }}
                />
                {errors.startDate && (
                  <p className="mt-1 text-xs" style={{ color: "#b91c1c" }}>{errors.startDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                  End date <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setErrors((p) => ({ ...p, endDate: "" })); }}
                  className="w-full rounded-md border px-3 py-2.5 text-sm"
                  style={{ borderColor: errors.endDate ? "#ef4444" : "#d5e2f0", color: "#1a2540", outline: "none" }}
                />
                {errors.endDate && (
                  <p className="mt-1 text-xs" style={{ color: "#b91c1c" }}>{errors.endDate}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                  Placement mode
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full rounded-md border px-3 py-2.5 text-sm"
                  style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none" }}
                >
                  {["Block", "Day release", "Mixed", "Remote"].map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                  Hours per week
                </label>
                <input
                  type="number"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                  min={1}
                  max={40}
                  placeholder="e.g. 30"
                  className="w-full rounded-md border px-3 py-2.5 text-sm"
                  style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Employer ── */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}>
              Select an employer
            </h2>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#9ca3af" }}
              />
              <input
                type="search"
                value={employerSearch}
                onChange={(e) => setEmployerSearch(e.target.value)}
                placeholder="Search employers…"
                className="w-full rounded-md border pl-9 pr-4 py-2.5 text-sm"
                style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none" }}
              />
            </div>

            {errors.employer && (
              <p className="text-xs flex items-center gap-1" style={{ color: "#b91c1c" }}>
                <AlertCircle size={12} /> {errors.employer}
              </p>
            )}

            <div className="space-y-2">
              {filteredEmployers.map((e) => {
                const sel = selectedEmployer === e.id;
                return (
                  <button
                    key={e.id}
                    onClick={() => { setSelectedEmployer(e.id); setErrors((p) => ({ ...p, employer: "" })); }}
                    className="w-full flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors"
                    style={{
                      borderColor: sel ? "#1b5db4" : "#d5e2f0",
                      backgroundColor: sel ? "#ebf3fc" : "#fff",
                    }}
                    aria-pressed={sel}
                  >
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: sel ? "#1b5db4" : "#e8f0f8" }}
                    >
                      <Building2 size={14} style={{ color: sel ? "#fff" : "#4b82c8" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                        {e.name}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#5b6a8a" }}>
                        {e.address}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                        {e.activePlacements} active · {e.completedPlacements} completed · {e.sicCode}
                      </p>
                    </div>
                    {sel && <Check size={16} style={{ color: "#1b5db4", flexShrink: 0, marginTop: 2 }} />}
                  </button>
                );
              })}
              {filteredEmployers.length === 0 && (
                <p className="text-sm text-center py-8" style={{ color: "#9ca3af" }}>
                  No employers found. Try a different search.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Step 5: Due Diligence ── */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}>
              Due diligence checklist
            </h2>
            <p className="text-sm" style={{ color: "#5b6a8a" }}>
              Confirm which due-diligence requirements have been completed for this employer. Outstanding items can be chased after the plan is submitted.
            </p>
            <div className="space-y-2">
              {Object.entries(ddChecks).map(([label, checked]) => (
                <label
                  key={label}
                  className="flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors"
                  style={{
                    borderColor: checked ? "#bbf7d0" : "#d5e2f0",
                    backgroundColor: checked ? "#f0fdf4" : "#fff",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setDdChecks((p) => ({ ...p, [label]: !p[label] }))}
                    style={{ accentColor: "#15803d" }}
                  />
                  <span className="text-sm" style={{ color: "#1a2540" }}>
                    {label}
                  </span>
                  {checked && (
                    <CheckCircle size={14} style={{ color: "#22c55e", marginLeft: "auto", flexShrink: 0 }} />
                  )}
                </label>
              ))}
            </div>
            <div
              className="rounded-lg p-3 border text-sm"
              style={{ backgroundColor: "#fef3c7", borderColor: "#fcd34d", color: "#92400e" }}
            >
              <strong>Note:</strong> All required due-diligence documents must be in place before a placement can become Active.
            </div>
          </div>
        )}

        {/* ── Step 6: Review & Confirm ── */}
        {step === 6 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}>
              Review your placement plan
            </h2>
            <p className="text-sm" style={{ color: "#5b6a8a" }}>
              Check the details below before submitting. You can edit any section by clicking the link next to it.
            </p>

            {[
              {
                label: "Course & Objectives",
                editStep: 1,
                rows: [
                  { key: "Course", val: course || "—" },
                  { key: "Learning objectives", val: objectives.length > 0 ? `${objectives.length} added` : "None" },
                ],
              },
              {
                label: "Students",
                editStep: 2,
                rows: [
                  { key: "Groups", val: selectedGroups.length > 0 ? selectedGroups.map((g) => `Group ${g}`).join(", ") : "—" },
                  { key: "Estimated students", val: studentCount || "—" },
                ],
              },
              {
                label: "Schedule",
                editStep: 3,
                rows: [
                  { key: "Start date", val: startDate || "—" },
                  { key: "End date", val: endDate || "—" },
                  { key: "Mode", val: mode },
                  { key: "Hours per week", val: hoursPerWeek || "—" },
                ],
              },
              {
                label: "Employer",
                editStep: 4,
                rows: [
                  { key: "Employer", val: employers.find((e) => e.id === selectedEmployer)?.name ?? "—" },
                ],
              },
              {
                label: "Due Diligence",
                editStep: 5,
                rows: [
                  {
                    key: "Completed checks",
                    val: `${Object.values(ddChecks).filter(Boolean).length} of ${Object.keys(ddChecks).length}`,
                  },
                ],
              },
            ].map((section) => (
              <div
                key={section.label}
                className="rounded-lg border overflow-hidden"
                style={{ borderColor: "#d5e2f0" }}
              >
                <div
                  className="flex items-center justify-between px-4 py-2.5"
                  style={{ backgroundColor: "#f4f7fb" }}
                >
                  <p className="text-sm font-semibold" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                    {section.label}
                  </p>
                  <button
                    onClick={() => setStep(section.editStep)}
                    className="text-xs"
                    style={{ color: "#1b5db4", fontFamily: "var(--font-display)" }}
                  >
                    Edit
                  </button>
                </div>
                <dl>
                  {section.rows.map((r) => (
                    <div
                      key={r.key}
                      className="flex gap-4 px-4 py-2 border-t text-sm"
                      style={{ borderColor: "#ebf3fc" }}
                    >
                      <dt className="w-40 flex-shrink-0" style={{ color: "#5b6a8a" }}>{r.key}</dt>
                      <dd style={{ color: "#1a2540" }}>{r.val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={back}
          disabled={step === 1}
          className="flex items-center gap-2 px-4 py-2.5 rounded-md border text-sm font-medium transition-opacity"
          style={{
            borderColor: "#d5e2f0",
            color: "#5b6a8a",
            fontFamily: "var(--font-display)",
            opacity: step === 1 ? 0.4 : 1,
          }}
        >
          <ChevronLeft size={16} />
          Back
        </button>

        {step < 6 ? (
          <button
            onClick={next}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1b5db4", color: "#fff", fontFamily: "var(--font-display)" }}
          >
            Continue
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#15803d", color: "#fff", fontFamily: "var(--font-display)" }}
          >
            <Check size={16} />
            Submit placement
          </button>
        )}
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            style={{ border: "1px solid #d5e2f0" }}
          >
            <h2
              id="modal-title"
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
            >
              Submit placement plan?
            </h2>
            <p className="text-sm mb-6" style={{ color: "#5b6a8a" }}>
              Once submitted, the employer will be contacted with a placement request. You can still edit the plan from the Placements section.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-md border text-sm font-medium"
                style={{ borderColor: "#d5e2f0", color: "#5b6a8a", fontFamily: "var(--font-display)" }}
              >
                Cancel
              </button>
              <button
                onClick={confirm}
                className="flex-1 py-2.5 rounded-md text-sm font-semibold"
                style={{ backgroundColor: "#15803d", color: "#fff", fontFamily: "var(--font-display)" }}
              >
                Yes, submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
