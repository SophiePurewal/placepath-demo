import { useEffect, useRef } from "react";
import ProfileAvatar from "./ProfileAvatar";
import BrandLogo from "./BrandLogo";
import {
  Home,
  CheckSquare,
  Briefcase,
  Building2,
  Users,
  Calendar,
  MessageSquare,
  Bell,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export type Screen =
  | "dashboard"
  | "tasks"
  | "placements"
  | "employers"
  | "employer-detail"
  | "students"
  | "visits"
  | "messages"
  | "notifications"
  | "reports"
  | "settings"
  | "help"
  | "create-placement"
  | "placement-detail"
  | "emp-dashboard"
  | "emp-requests"
  | "emp-active"
  | "emp-students"
  | "emp-documents"
  | "emp-messages"
  | "emp-organisation"
  | "stu-dashboard"
  | "stu-placement"
  | "stu-tasks"
  | "stu-schedule"
  | "stu-attendance"
  | "stu-objectives"
  | "stu-documents"
  | "stu-messages";

interface NavItem {
  id: Screen;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const coordinatorNav: NavItem[] = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "tasks", label: "Tasks", icon: CheckSquare, badge: 4 },
  { id: "placements", label: "Placements", icon: Briefcase },
  { id: "employers", label: "Employers", icon: Building2 },
  { id: "students", label: "Students", icon: Users },
  { id: "visits", label: "Visits", icon: Calendar },
  { id: "messages", label: "Messages", icon: MessageSquare, badge: 2 },
  { id: "notifications", label: "Notifications", icon: Bell, badge: 5 },
  { id: "reports", label: "Reports", icon: BarChart2 },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "help", label: "Help", icon: HelpCircle },
];

const employerNav: NavItem[] = [
  { id: "emp-dashboard", label: "Home", icon: Home },
  { id: "emp-requests", label: "Placement Requests", icon: Briefcase, badge: 1 },
  { id: "emp-active", label: "Active Placements", icon: CheckSquare },
  { id: "emp-students", label: "Students", icon: Users },
  { id: "emp-documents", label: "Documents", icon: BarChart2 },
  { id: "emp-messages", label: "Messages", icon: MessageSquare, badge: 2 },
  { id: "emp-organisation", label: "Organisation Details", icon: Building2 },
  { id: "help", label: "Help", icon: HelpCircle },
];

const studentNav: NavItem[] = [
  { id: "stu-dashboard", label: "Home", icon: Home },
  { id: "stu-placement", label: "My Placement", icon: Briefcase },
  { id: "stu-tasks", label: "Tasks", icon: CheckSquare, badge: 3 },
  { id: "stu-schedule", label: "Schedule", icon: Calendar },
  { id: "stu-attendance", label: "Attendance", icon: Users },
  { id: "stu-objectives", label: "Learning Objectives", icon: BarChart2 },
  { id: "stu-documents", label: "Documents", icon: Bell },
  { id: "stu-messages", label: "Messages", icon: MessageSquare },
  { id: "help", label: "Help", icon: HelpCircle },
];

interface SidebarProps {
  role: "coordinator" | "employer" | "student";
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onSignOut: () => void;
}

export default function Sidebar({
  role,
  currentScreen,
  onNavigate,
  collapsed,
  onCollapse,
  mobileOpen,
  onMobileClose,
  onSignOut,
}: SidebarProps) {
  const navItems = role === "coordinator" ? coordinatorNav : role === "employer" ? employerNav : studentNav;
  const userInfo = role === "coordinator"
    ? { name: "Sarah Ahmed", title: "Placement Coordinator" }
    : role === "employer"
      ? { name: "David Hughes", title: "Operations Manager" }
      : { name: "Maya Thompson", title: "Health & Social Care L3" };

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onMobileClose();
    };
    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, onMobileClose]);

  const navigate = (id: Screen) => {
    onNavigate(id);
    onMobileClose();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#ffffff", color: "#1a2540" }}>
      <div
        className={`flex items-center border-b ${collapsed ? "justify-center px-2" : "px-5"}`}
        style={{ height: 72, minHeight: 72, borderColor: "#e3e9f1" }}
      >
        <BrandLogo size="md" dark={false} markOnly={collapsed} />
        <button
          ref={closeButtonRef}
          className="ml-auto lg:hidden p-2 rounded-md"
          style={{ color: "#5b6a8a" }}
          onClick={onMobileClose}
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 overflow-y-auto" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentScreen === item.id || (item.id === "employers" && currentScreen === "employer-detail");
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`pp-nav-item w-full flex items-center gap-3 text-left transition-colors relative ${collapsed ? "justify-center px-2" : "px-3"}`}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: active ? 600 : 500,
                fontSize: 15,
                minHeight: 46,
                marginBottom: 4,
                borderRadius: 10,
                color: active ? "#1b5db4" : "#263653",
                backgroundColor: active ? "#eef5ff" : "transparent",
                border: "0",
              }}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={19} strokeWidth={1.8} style={{ flexShrink: 0, color: active ? "#1b5db4" : "#42516c" }} />
              {!collapsed && <span className="nav-label flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span
                  className="text-xs font-semibold rounded-full min-w-[20px] h-5 px-1.5 inline-flex items-center justify-center"
                  style={{ backgroundColor: "#2f66d0", color: "#fff", fontSize: 11 }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t" style={{ borderColor: "#e3e9f1" }}>
        <div className={`flex items-center py-3 ${collapsed ? "justify-center px-2" : "gap-3 px-4"}`}>
          <ProfileAvatar role={role} size={36} />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                {userInfo.name}
              </p>
              <p className="text-xs truncate" style={{ color: "#6b7892" }}>{userInfo.title}</p>
            </div>
          )}
        </div>

        <button
          onClick={() => onCollapse(!collapsed)}
          className={`sidebar-collapse hidden lg:flex w-full items-center py-2.5 border-t ${collapsed ? "justify-center px-2" : "gap-2 px-4"}`}
          style={{ borderColor: "#eef2f7", color: "#6b7892", fontSize: 13, background: "transparent" }}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          {!collapsed && <span>Collapse</span>}
        </button>

        <button
          onClick={onSignOut}
          className={`w-full flex items-center py-2.5 border-t ${collapsed ? "justify-center px-2" : "gap-2 px-4"}`}
          style={{ borderColor: "#eef2f7", color: "#6b7892", fontSize: 13, background: "transparent" }}
          aria-label="Sign out"
        >
          <LogOut size={16} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 transition-all duration-200 border-r"
        style={{
          width: collapsed ? 72 : 272,
          backgroundColor: "#ffffff",
          borderColor: "#e3e9f1",
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
        aria-label="Primary navigation"
      >
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.35)" }}
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className="fixed top-0 left-0 h-full z-50 lg:hidden transition-transform duration-200 border-r"
        style={{
          width: 280,
          backgroundColor: "#ffffff",
          borderColor: "#e3e9f1",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        }}
        aria-label="Primary navigation"
        aria-hidden={!mobileOpen}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
