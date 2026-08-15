import { useState } from "react";
import {
  Users,
  Briefcase,
  Building2,
  ClipboardCheck,
  Calendar,
  MessageSquare,
  ArrowRight,
  Plus,
  Check,
} from "lucide-react";
import { placements, messages, visits, tasks as initialTasks, employers } from "../../data";
import type { Task } from "../../data";
import type { Screen } from "../../components/Sidebar";

interface DashboardProps {
  onNavigate: (screen: Screen, payload?: unknown) => void;
  onAddToast: (type: "success" | "error" | "info", message: string) => void;
}

const statusLabel: Record<string, string> = {
  active: "In progress",
  "ready-to-confirm": "Confirmed",
  "awaiting-employer": "Awaiting employer",
  "due-diligence": "Due diligence",
  draft: "Draft",
  "at-risk": "At risk",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusStyle: Record<string, { background: string; color: string }> = {
  active: { background: "#eaf3ff", color: "#1b5db4" },
  "ready-to-confirm": { background: "#eaf8f0", color: "#15803d" },
  "awaiting-employer": { background: "#fff7e6", color: "#b45309" },
  "due-diligence": { background: "#fff7e6", color: "#b45309" },
  draft: { background: "#f3f4f6", color: "#6b7280" },
  "at-risk": { background: "#fef2f2", color: "#b91c1c" },
  completed: { background: "#eaf8f0", color: "#15803d" },
  cancelled: { background: "#f3f4f6", color: "#6b7280" },
};

function SectionHeader({ title, action, onAction }: { title: string; action: string; onAction: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#e8edf4" }}>
      <h2 className="text-base font-semibold" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>{title}</h2>
      <button onClick={onAction} className="text-xs font-semibold flex items-center gap-1" style={{ color: "#1b5db4" }}>
        {action}<ArrowRight size={13} />
      </button>
    </div>
  );
}

export default function Dashboard({ onNavigate, onAddToast }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const activePlacements = placements.filter((p) => p.status === "active").length;
  const studentCount = placements.reduce((total, placement) => total + placement.students, 0);
  const openTasks = tasks.filter((task) => !task.done).length;

  const toggleTask = (id: string) => {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task));
    onAddToast("success", "Task updated.");
  };

  const metrics = [
    { label: "Students on placements", value: studentCount, change: "+12 this term", icon: Users, bg: "#eaf2ff", fg: "#2f66d4" },
    { label: "Active placements", value: activePlacements, change: "+8 this term", icon: Briefcase, bg: "#eaf8f0", fg: "#1aa866" },
    { label: "Active employers", value: employers.length, change: "+4 this term", icon: Building2, bg: "#f2ebff", fg: "#6f42c1" },
    { label: "Tasks due", value: openTasks, change: "+5 this week", icon: ClipboardCheck, bg: "#fff5dd", fg: "#e49a14" },
  ];

  return (
    <div className="ep-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="ep-page-title">Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "#5b6a8a" }}>Placement activity across Northbridge College</p>
        </div>
        <button
          onClick={() => onNavigate("create-placement")}
          className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
          style={{ backgroundColor: "#1b5db4", color: "#fff", fontFamily: "var(--font-display)" }}
        >
          <Plus size={17} /> New placement
        </button>
      </div>

      <section className="ep-panel mb-5 overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_280px] items-stretch">
          <div className="px-7 py-7 lg:py-8 flex flex-col justify-center">
            <h2 className="text-xl font-semibold mb-2" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>Welcome back, Sarah</h2>
            <p className="text-sm" style={{ color: "#5b6a8a" }}>Here’s what’s happening with your placements today.</p>
          </div>
          <div className="hidden lg:flex items-end justify-center px-8 pt-5" style={{ background: "linear-gradient(135deg,#f6f9ff,#eef4ff)" }} aria-hidden="true">
            <div className="relative w-36 h-24">
              <div className="absolute left-3 bottom-0 w-7 h-16 rounded-t-full" style={{ backgroundColor: "#9bd7ad" }} />
              <div className="absolute left-7 bottom-0 w-10 h-5 rounded" style={{ backgroundColor: "#56708e" }} />
              <div className="absolute right-2 bottom-2 w-20 h-14 rounded-xl" style={{ backgroundColor: "#dce8ff" }} />
              <div className="absolute right-8 bottom-6 w-12 h-9 rounded-md" style={{ backgroundColor: "#1a2540" }} />
              <div className="absolute right-6 bottom-11 w-12 h-12 rounded-full" style={{ backgroundColor: "#4b82c8" }} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {metrics.map(({ label, value, change, icon: Icon, bg, fg }) => (
          <section key={label} className="ep-panel p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg, color: fg }}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>{value}</p>
                <p className="text-sm mt-0.5" style={{ color: "#1a2540" }}>{label}</p>
                <p className="text-xs mt-3 font-medium" style={{ color: "#1aa866" }}>{change}</p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-5 items-start">
        <section className="ep-panel">
          <SectionHeader title="Recent placements" action="View all" onAction={() => onNavigate("placements")} />
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 760 }}>
              <thead>
                <tr className="text-xs uppercase tracking-wide" style={{ color: "#7b879c", backgroundColor: "#fbfcfe" }}>
                  <th className="px-5 py-3 font-medium">Placement</th>
                  <th className="px-5 py-3 font-medium">Employer</th>
                  <th className="px-5 py-3 font-medium">Dates</th>
                  <th className="px-5 py-3 font-medium">Students</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {placements.slice(0, 5).map((placement) => {
                  const style = statusStyle[placement.status] ?? statusStyle.draft;
                  return (
                    <tr key={placement.id} className="border-t" style={{ borderColor: "#edf1f6" }}>
                      <td className="px-5 py-4">
                        <button onClick={() => onNavigate("placements")} className="text-left font-semibold text-sm" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                          {placement.title}
                        </button>
                        <p className="text-xs mt-1" style={{ color: "#5b6a8a" }}>{placement.course}</p>
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: "#334155" }}>{placement.employer}</td>
                      <td className="px-5 py-4 text-xs" style={{ color: "#5b6a8a" }}>{placement.startDate} – {placement.endDate}</td>
                      <td className="px-5 py-4 text-sm" style={{ color: "#334155" }}>{placement.students}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-md px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: style.background, color: style.color }}>
                          {statusLabel[placement.status] ?? placement.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-5">
          <section className="ep-panel">
            <SectionHeader title="Upcoming visits" action="View all" onAction={() => onNavigate("visits")} />
            <div>
              {visits.slice(0, 3).map((visit, index) => (
                <div key={visit.id} className="flex gap-3 px-5 py-4 border-b last:border-b-0" style={{ borderColor: "#edf1f6" }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#f2f7fd", color: "#1b5db4" }}>
                    <Calendar size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>{visit.type}</p>
                    <p className="text-xs mt-1" style={{ color: "#5b6a8a" }}>{visit.student} · {visit.employer}</p>
                    <p className="text-xs mt-1" style={{ color: "#7b879c" }}>{visit.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="ep-panel">
            <SectionHeader title="Messages" action="View all" onAction={() => onNavigate("messages")} />
            <div>
              {messages.slice(0, 3).map((message) => (
                <button key={message.id} onClick={() => onNavigate("messages")} className="w-full flex items-start gap-3 px-5 py-4 border-b last:border-b-0 text-left ep-action-row" style={{ borderColor: "#edf1f6" }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: message.unread ? "#eaf2ff" : "#f3f4f6", color: message.unread ? "#2f66d4" : "#7b879c" }}>
                    <MessageSquare size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-semibold truncate" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>{message.sender}</p>
                      <span className="text-xs flex-shrink-0" style={{ color: "#7b879c" }}>{message.time.split(" ")[0]}</span>
                    </div>
                    <p className="text-xs truncate mt-1" style={{ color: "#5b6a8a" }}>{message.subject}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="ep-panel">
            <SectionHeader title="Task overview" action="View all" onAction={() => onNavigate("tasks")} />
            <div className="px-5 py-4">
              <p className="text-3xl font-bold" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>{openTasks}</p>
              <p className="text-xs mt-1 mb-4" style={{ color: "#5b6a8a" }}>Outstanding tasks</p>
              <div className="space-y-2">
                {tasks.slice(0, 3).map((task) => (
                  <button key={task.id} onClick={() => toggleTask(task.id)} className="w-full flex items-start gap-2 text-left py-2">
                    <span className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5" style={{ borderColor: task.done ? "#1aa866" : "#cbd5e1", backgroundColor: task.done ? "#1aa866" : "#fff", color: "#fff" }}>
                      {task.done && <Check size={13} />}
                    </span>
                    <span className="text-xs leading-5" style={{ color: task.done ? "#7b879c" : "#334155", textDecoration: task.done ? "line-through" : "none" }}>{task.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
