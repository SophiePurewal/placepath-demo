import { useState } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  Circle,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  RotateCcw,
} from "lucide-react";
import type { Task } from "../../data";
import { tasks as coordinatorTasks } from "../../data";

type Role = "coordinator" | "employer" | "student";
type Priority = "high" | "medium" | "low";
type TaskStatus = "open" | "done";

interface NewTaskForm {
  title: string;
  due: string;
  priority: Priority;
  related: string;
}

interface ExtendedTask extends Task {
  related?: string;
  assignee?: string;
  status: TaskStatus;
}

const coordinatorExtended: ExtendedTask[] = coordinatorTasks.map((t) => ({
  ...t,
  status: t.done ? "done" : ("open" as TaskStatus),
  related:
    t.id === "t1"
      ? "Topps Tiles (Employer)"
      : t.id === "t2"
        ? "Health & Social Care L3"
        : t.id === "t3"
          ? "Nessie Nursery (Employer)"
          : t.id === "t4"
            ? "Electrical Installation L2"
            : t.id === "t5"
              ? "Internal"
              : "Electrical Installation L2",
  assignee: "Sarah Ahmed",
}));

const employerTasks: ExtendedTask[] = [
  { id: "et1", title: "Upload enhanced DBS check for Marcus Webb", due: "25 Aug 2026", priority: "high", done: false, status: "open", related: "Electrical Installation L2 placement", assignee: "David Hughes" },
  { id: "et2", title: "Review and sign risk assessment form", due: "25 Aug 2026", priority: "high", done: false, status: "open", related: "Electrical Installation L2 placement", assignee: "David Hughes" },
  { id: "et3", title: "Confirm workplace supervisor for October block", due: "18 Aug 2026", priority: "medium", done: false, status: "open", related: "Electrical Installation L2 placement", assignee: "David Hughes" },
  { id: "et4", title: "Complete employer liability insurance renewal", due: "30 Sep 2026", priority: "low", done: false, status: "open", related: "General compliance", assignee: "David Hughes" },
];

const studentTasks: ExtendedTask[] = [
  { id: "st1", title: "Complete pre-placement health declaration", due: "Complete", priority: "high", done: true, status: "done", related: "Health & Social Care L3 placement", assignee: "Maya Thompson" },
  { id: "st2", title: "Upload copy of ID (passport or driving licence)", due: "Complete", priority: "high", done: true, status: "done", related: "Health & Social Care L3 placement", assignee: "Maya Thompson" },
  { id: "st3", title: "Read and sign placement agreement", due: "Before 2 Sep 2026", priority: "high", done: false, status: "open", related: "Health & Social Care L3 placement", assignee: "Maya Thompson" },
  { id: "st4", title: "Complete online safeguarding awareness module", due: "Before 2 Sep 2026", priority: "high", done: false, status: "open", related: "Health & Social Care L3 placement", assignee: "Maya Thompson" },
  { id: "st5", title: "Review employer information pack", due: "Before 2 Sep 2026", priority: "low", done: false, status: "open", related: "Health & Social Care L3 placement", assignee: "Maya Thompson" },
  { id: "st6", title: "Confirm travel arrangements with coordinator", due: "Before 2 Sep 2026", priority: "low", done: false, status: "open", related: "Health & Social Care L3 placement", assignee: "Maya Thompson" },
];

const priorityLabel: Record<Priority, string> = { high: "High", medium: "Medium", low: "Low" };
const priorityColor: Record<Priority, { bg: string; text: string }> = {
  high: { bg: "#fef2f2", text: "#b91c1c" },
  medium: { bg: "#fef3c7", text: "#92400e" },
  low: { bg: "#f3f4f6", text: "#6b7280" },
};

interface TasksProps {
  role: Role;
  onAddToast: (type: "success" | "error" | "info", message: string) => void;
}

export default function Tasks({ role, onAddToast }: TasksProps) {
  const initialTasks =
    role === "coordinator"
      ? coordinatorExtended
      : role === "employer"
        ? employerTasks
        : studentTasks;

  const [taskList, setTaskList] = useState<ExtendedTask[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState<NewTaskForm>({ title: "", due: "", priority: "medium", related: "" });

  const toggle = (id: string) => {
    const task = taskList.find((t) => t.id === id);
    if (!task) return;
    const done = !task.done;
    onAddToast(done ? "success" : "info", done ? "Task marked complete." : "Task reopened.");
    setTaskList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done, status: done ? "done" : ("open" as const) } : t)),
    );
  };

  const filtered = taskList.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.related ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const openCount = taskList.filter((t) => !t.done).length;
  const doneCount = taskList.filter((t) => t.done).length;
  const activeFilters = (statusFilter !== "all" ? 1 : 0) + (priorityFilter !== "all" ? 1 : 0);

  return (
    <div className="ep-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1
            className="ep-section-title"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#1a2540" }}
          >
            Tasks
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#5b6a8a" }}>
            {openCount} open · {doneCount} completed
          </p>
        </div>
        {role === "coordinator" && (
          <button
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            style={{ backgroundColor: "#1b5db4", color: "#fff", fontFamily: "var(--font-display)" }}
            onClick={() => setShowAddTask(true)}
          >
            <Plus size={15} /> Add task
          </button>
        )}
      </div>

      {/* Search + filter toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            className="w-full rounded-xl border pl-9 pr-4 py-2.5 text-sm"
            style={{ borderColor: "#d5e2f0", backgroundColor: "#fff", color: "#1a2540", outline: "none" }}
            aria-label="Search tasks"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium"
          style={{
            borderColor: showFilters || activeFilters > 0 ? "#1b5db4" : "#d5e2f0",
            color: showFilters || activeFilters > 0 ? "#1b5db4" : "#5b6a8a",
            backgroundColor: showFilters || activeFilters > 0 ? "#ebf3fc" : "#fff",
            fontFamily: "var(--font-display)",
            minHeight: 44,
          }}
          aria-expanded={showFilters}
        >
          <Filter size={14} />
          Filters
          {activeFilters > 0 && (
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: "#1b5db4", color: "#fff" }}
            >
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mb-4 px-4 py-3.5 rounded-xl" style={{ backgroundColor: "#eef2f7" }}>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#5b6a8a", fontFamily: "var(--font-display)" }}>
                Status
              </p>
              <div className="flex flex-wrap gap-2">
                {(["all", "open", "done"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setStatusFilter(v)}
                    className="px-3 py-1.5 rounded-full border text-xs font-medium"
                    style={{
                      borderColor: statusFilter === v ? "#1b5db4" : "#d5e2f0",
                      backgroundColor: statusFilter === v ? "#ebf3fc" : "#fff",
                      color: statusFilter === v ? "#1b5db4" : "#5b6a8a",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {v === "all" ? "All" : v === "open" ? "Open" : "Completed"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#5b6a8a", fontFamily: "var(--font-display)" }}>
                Priority
              </p>
              <div className="flex flex-wrap gap-2">
                {(["all", "high", "medium", "low"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setPriorityFilter(v)}
                    className="px-3 py-1.5 rounded-full border text-xs font-medium"
                    style={{
                      borderColor: priorityFilter === v ? "#1b5db4" : "#d5e2f0",
                      backgroundColor: priorityFilter === v ? "#ebf3fc" : "#fff",
                      color: priorityFilter === v ? "#1b5db4" : "#5b6a8a",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {v === "all" ? "All" : priorityLabel[v]}
                  </button>
                ))}
              </div>
            </div>
            {activeFilters > 0 && (
              <div className="flex items-end">
                <button
                  onClick={() => { setStatusFilter("all"); setPriorityFilter("all"); }}
                  className="flex items-center gap-1 text-xs font-medium ep-link"
                >
                  <X size={12} /> Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <p className="text-xs mb-2" style={{ color: "#9ca3af" }}>
        {filtered.length} task{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="ep-card py-16 text-center">
          <CheckCircle size={32} style={{ color: "#d5e2f0", margin: "0 auto 12px" }} />
          <p className="text-base font-semibold" style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}>
            No tasks found
          </p>
          <p className="text-sm mt-1" style={{ color: "#5b6a8a" }}>
            {search ? "Try adjusting your search." : "All tasks completed — great work!"}
          </p>
        </div>
      )}

      {/* Task list — single white surface, rows separated by dividers */}
      {filtered.length > 0 && (
        <div className="ep-card">
          {filtered.map((task, i) => {
            const expanded = expandedId === task.id;
            const pc = priorityColor[task.priority];
            const isLast = i === filtered.length - 1;

            return (
              <div key={task.id}>
                {/* Task row */}
                <div
                  className="flex items-start gap-3 py-3.5"
                  style={{
                    paddingLeft: expanded ? 13 : 16,
                    paddingRight: 16,
                    borderBottom: expanded || isLast ? "none" : "1px solid #eef2f7",
                    borderLeft: expanded ? "3px solid #1b5db4" : "3px solid transparent",
                    backgroundColor: expanded ? "#ebf3fc" : task.done ? "transparent" : "transparent",
                    opacity: task.done && !expanded ? 0.7 : 1,
                  }}
                >
                  <button
                    onClick={() => toggle(task.id)}
                    className="mt-0.5 flex-shrink-0 icon-btn"
                    style={{
                      color: task.done ? "#22c55e" : "#d5e2f0",
                      minHeight: "unset",
                      minWidth: "unset",
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-label={task.done ? "Reopen task" : "Mark complete"}
                  >
                    {task.done ? <CheckCircle size={20} /> : <Circle size={20} />}
                  </button>

                  <button
                    className="flex-1 min-w-0 text-left"
                    onClick={() => setExpandedId(expanded ? null : task.id)}
                    aria-expanded={expanded}
                    style={{ minHeight: "unset", background: "none", border: "none" }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{
                        color: "#1a2540",
                        textDecoration: task.done ? "line-through" : "none",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2.5 mt-1">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: pc.bg, color: pc.text }}
                      >
                        {task.priority === "high" && <AlertTriangle size={10} />}
                        {priorityLabel[task.priority]}
                      </span>
                      <span
                        className="flex items-center gap-1 text-xs"
                        style={{ color: task.priority === "high" && !task.done ? "#b91c1c" : "#9ca3af" }}
                      >
                        <Clock size={11} /> {task.due}
                      </span>
                      {task.related && (
                        <span className="text-xs" style={{ color: "#9ca3af" }}>
                          · {task.related}
                        </span>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setExpandedId(expanded ? null : task.id)}
                    className="flex-shrink-0 icon-btn"
                    style={{
                      color: expanded ? "#1b5db4" : "#9ca3af",
                      padding: 4,
                      minHeight: "unset",
                      minWidth: "unset",
                    }}
                    aria-label={expanded ? "Collapse" : "Expand"}
                  >
                    {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>

                {/* Expanded inline detail */}
                {expanded && (
                  <div
                    className="px-4 pb-4 pt-3"
                    style={{
                      backgroundColor: "#f2f7fd",
                      borderTop: "1px solid #d5e2f0",
                      borderBottom: isLast ? "none" : "1px solid #eef2f7",
                    }}
                  >
                    {task.assignee && (
                      <p className="text-sm mb-3" style={{ color: "#5b6a8a" }}>
                        Assigned to: <span style={{ color: "#1a2540" }}>{task.assignee}</span>
                      </p>
                    )}
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: "#5b6a8a", fontFamily: "var(--font-display)" }}
                    >
                      Add a note
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={noteInputs[task.id] ?? ""}
                        onChange={(e) => setNoteInputs((p) => ({ ...p, [task.id]: e.target.value }))}
                        placeholder="Type a note and press Enter…"
                        className="flex-1 rounded-xl border px-3 py-2 text-sm"
                        style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none", backgroundColor: "#fff" }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && noteInputs[task.id]?.trim()) {
                            onAddToast("success", "Note added.");
                            setNoteInputs((p) => ({ ...p, [task.id]: "" }));
                          }
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      {!task.done ? (
                        <button
                          onClick={() => { toggle(task.id); setExpandedId(null); }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold"
                          style={{ backgroundColor: "#15803d", color: "#fff", fontFamily: "var(--font-display)" }}
                        >
                          <CheckCircle size={14} /> Mark complete
                        </button>
                      ) : (
                        <button
                          onClick={() => { toggle(task.id); setExpandedId(null); }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium"
                          style={{ borderColor: "#d5e2f0", color: "#5b6a8a", fontFamily: "var(--font-display)", backgroundColor: "#fff" }}
                        >
                          <RotateCcw size={14} /> Reopen
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task modal */}
      {showAddTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-task-title"
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2
              id="add-task-title"
              className="text-lg font-semibold mb-4"
              style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
            >
              Add task
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                  Task title <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Describe the task…"
                  className="w-full rounded-xl border px-3 py-2.5 text-sm"
                  style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none" }}
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                    Due date
                  </label>
                  <input
                    type="text"
                    value={newTask.due}
                    onChange={(e) => setNewTask((p) => ({ ...p, due: e.target.value }))}
                    placeholder="e.g. 25 Aug 2026"
                    className="w-full rounded-xl border px-3 py-2.5 text-sm"
                    style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value as Priority }))}
                    className="w-full rounded-xl border px-3 py-2.5 text-sm"
                    style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none" }}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                  Related to (optional)
                </label>
                <input
                  type="text"
                  value={newTask.related}
                  onChange={(e) => setNewTask((p) => ({ ...p, related: e.target.value }))}
                  placeholder="e.g. Nessie Nursery, Health & Social Care L3"
                  className="w-full rounded-xl border px-3 py-2.5 text-sm"
                  style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none" }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { setShowAddTask(false); setNewTask({ title: "", due: "", priority: "medium", related: "" }); }}
                className="flex-1 py-2.5 rounded-xl border text-sm font-medium"
                style={{ borderColor: "#d5e2f0", color: "#5b6a8a", fontFamily: "var(--font-display)" }}
              >
                Cancel
              </button>
              <button
                disabled={!newTask.title.trim()}
                onClick={() => {
                  if (!newTask.title.trim()) return;
                  const id = `task_${Date.now()}`;
                  setTaskList((prev) => [
                    {
                      id,
                      title: newTask.title.trim(),
                      due: newTask.due || "No due date",
                      priority: newTask.priority,
                      done: false,
                      status: "open" as const,
                      related: newTask.related || undefined,
                      assignee: "Sarah Ahmed",
                    },
                    ...prev,
                  ]);
                  onAddToast("success", "Task added.");
                  setShowAddTask(false);
                  setNewTask({ title: "", due: "", priority: "medium", related: "" });
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "#1b5db4", color: "#fff", fontFamily: "var(--font-display)" }}
              >
                Add task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
