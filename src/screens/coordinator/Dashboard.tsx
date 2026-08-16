import { useState } from "react";
import { Users, Briefcase, Building2, ClipboardCheck, Calendar, MessageSquare, ArrowRight, Plus, Check } from "lucide-react";
import { placements, messages, visits, tasks as initialTasks, employers } from "../../data";
import type { Task } from "../../data";
import type { Screen } from "../../components/Sidebar";

interface DashboardProps { onNavigate: (screen: Screen, payload?: unknown) => void; onAddToast: (type: "success" | "error" | "info", message: string) => void; }

const statusLabel: Record<string, string> = { active: "In progress", "ready-to-confirm": "Confirmed", "awaiting-employer": "Pending", "due-diligence": "Pending", draft: "Draft", "at-risk": "At risk", completed: "Completed", cancelled: "Cancelled" };
const statusStyle: Record<string, { background: string; color: string }> = {
  active: { background: "#eaf3ff", color: "#246bda" }, "ready-to-confirm": { background: "#e5f7ee", color: "#25a86b" },
  "awaiting-employer": { background: "#fff4dc", color: "#e89a11" }, "due-diligence": { background: "#fff4dc", color: "#e89a11" },
  draft: { background: "#f2f4f7", color: "#667085" }, "at-risk": { background: "#feeeee", color: "#c24141" },
  completed: { background: "#e5f7ee", color: "#25a86b" }, cancelled: { background: "#f2f4f7", color: "#667085" },
};

function SectionHeader({ title, action, onAction }: { title: string; action: string; onAction: () => void }) {
  return <div className="pp-section-head"><h2>{title}</h2><button onClick={onAction}>{action}<ArrowRight size={14} /></button></div>;
}

export default function Dashboard({ onNavigate, onAddToast }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const activePlacements = placements.filter((p) => p.status === "active").length;
  const studentCount = placements.reduce((total, placement) => total + placement.students, 0);
  const openTasks = tasks.filter((task) => !task.done).length;
  const toggleTask = (id: string) => { setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task)); onAddToast("success", "Task updated."); };
  const metrics = [
    { label: "Active students", value: studentCount, change: "+12 this week", icon: Users, colour: "#2f73e4" },
    { label: "Active placements", value: activePlacements, change: "+8 this week", icon: Briefcase, colour: "#35b978" },
    { label: "Active employers", value: employers.length, change: "+4 this week", icon: Building2, colour: "#7047d6" },
    { label: "Tasks due", value: openTasks, change: "+5 this week", icon: ClipboardCheck, colour: "#ffb21c" },
  ];

  return <div className="ep-page pp-dashboard">
    <div className="pp-title-row"><h1 className="ep-page-title">Dashboard</h1><button className="pp-primary" onClick={() => onNavigate("create-placement")}><Plus size={17}/>New placement</button></div>

    <section className="ep-panel pp-welcome"><div><h2>Welcome back, Sarah</h2><p>Here’s what’s happening with your placements.</p></div></section>

    <div className="pp-metrics">{metrics.map(({ label, value, change, icon: Icon, colour }) => <section key={label} className="ep-panel pp-metric"><span className="pp-metric-icon" style={{ background: colour }}><Icon size={23}/></span><div><strong>{value}</strong><span>{label}</span><small>{change}</small></div></section>)}</div>

    <div className="pp-dashboard-grid">
      <section className="ep-panel pp-recent"><SectionHeader title="Recent placements" action="View all" onAction={() => onNavigate("placements")}/><div className="pp-table-wrap"><table><thead><tr><th>Placement</th><th>Employer</th><th>Dates</th><th>Students</th><th>Status</th></tr></thead><tbody>{placements.slice(0,5).map((placement) => { const style=statusStyle[placement.status] ?? statusStyle.draft; return <tr key={placement.id}><td><button onClick={() => onNavigate("placements")}>{placement.title}</button><small>{placement.course}</small></td><td>{placement.employer}</td><td>{placement.startDate} – {placement.endDate}</td><td>{placement.students}</td><td><span className="pp-status" style={{background:style.background,color:style.color}}>{statusLabel[placement.status] ?? placement.status}</span></td></tr>; })}</tbody></table></div></section>

      <aside className="pp-side-stack">
        <section className="ep-panel"><SectionHeader title="Upcoming events" action="View all" onAction={() => onNavigate("visits")}/><div className="pp-events">{visits.slice(0,3).map((visit,index) => <div className="pp-event" key={visit.id}><time><small>MAY</small><strong>{12 + index*2}</strong></time><div><b>{visit.type}</b><span>{visit.student} · {visit.employer}</span><small>{visit.date}</small></div></div>)}</div></section>
        <section className="ep-panel"><SectionHeader title="Messages" action="View all" onAction={() => onNavigate("messages")}/><div className="pp-messages">{messages.slice(0,3).map((message,index)=><button key={message.id} onClick={() => onNavigate("messages")}><span className="pp-avatar">{message.sender.split(" ").map(n=>n[0]).join("").slice(0,2)}</span><span><b>{message.sender}</b><small>{message.subject}</small></span><time>{index===0?"2h":index===1?"5h":"1d"}</time>{message.unread&&<i/>}</button>)}</div></section>
        <section className="ep-panel"><SectionHeader title="Task overview" action="View all tasks" onAction={() => onNavigate("tasks")}/><div className="pp-task-overview"><div className="pp-donut"><span><strong>{openTasks}</strong><small>Total</small></span></div><div className="pp-legend"><span><i className="blue"/>8 To do</span><span><i className="amber"/>6 In progress</span><span><i className="green"/>4 Completed</span></div></div><div className="pp-task-list">{tasks.slice(0,3).map(task=><button key={task.id} onClick={()=>toggleTask(task.id)}><span className={task.done?"done":""}>{task.done&&<Check size={13}/>}</span>{task.title}</button>)}</div></section>
      </aside>
    </div>
  </div>;
}
