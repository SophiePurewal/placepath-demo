import { useEffect, useRef } from "react";
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
  // employer screens
  | "emp-dashboard"
  | "emp-requests"
  | "emp-active"
  | "emp-students"
  | "emp-documents"
  | "emp-messages"
  | "emp-organisation"
  // student screens
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
  const navItems =
    role === "coordinator"
      ? coordinatorNav
      : role === "employer"
        ? employerNav
        : studentNav;

  const userInfo =
    role === "coordinator"
      ? { name: "Sarah Ahmed", title: "Placement Coordinator", initials: "SA" }
      : role === "employer"
        ? { name: "David Hughes", title: "Operations Manager", initials: "DH" }
        : { name: "Maya Thompson", title: "Health & Social Care L3", initials: "MT" };

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstNavButtonRef = useRef<HTMLButtonElement>(null);

  // Close drawer on Escape and return focus to the hamburger button
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onMobileClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    // Move focus into the drawer when it opens
    closeButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, onMobileClose]);

  const navigate = (id: Screen) => {
    onNavigate(id);
    onMobileClose();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center px-5 border-b"
        style={{
          height: 64,
          borderColor: "rgba(255,255,255,0.1)",
          minHeight: 64,
        }}
      >
        {!collapsed && (
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "#ffffff",
              letterSpacing: "-0.5px",
            }}
          >
            Place<span style={{ color: "#7db8f5" }}>Path</span>
          </span>
        )}
        {collapsed && (
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 20,
              color: "#7db8f5",
            }}
          >
            PP
          </span>
        )}
        {/* mobile close */}
        <button
          ref={closeButtonRef}
          className="ml-auto lg:hidden p-1 rounded"
          style={{ color: "rgba(255,255,255,0.6)" }}
          onClick={onMobileClose}
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 overflow-y-auto" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentScreen === item.id ||
            (item.id === "employers" && currentScreen === "employer-detail");
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className="nav-btn w-full flex items-center gap-3 px-4 text-left transition-colors relative"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: active ? 600 : 400,
                fontSize: 16,
                minHeight: 44,
                paddingTop: 10,
                paddingBottom: 10,
                color: active ? "#ffffff" : "rgba(200,214,236,0.85)",
                backgroundColor: active ? "rgba(255,255,255,0.1)" : "transparent",
                borderLeft: active ? "3px solid #4b82c8" : "3px solid transparent",
              }}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={18} style={{ flexShrink: 0, opacity: active ? 1 : 0.75 }} />
              {!collapsed && <span className="nav-label flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span
                  className="text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[20px] text-center"
                  style={{ backgroundColor: "#1b5db4", color: "#fff", fontSize: 11 }}
                >
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge && (
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#4b82c8" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar controls + user */}
      <div
        className="border-t"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        {/* Collapse control sits above the signed-in user */}
        <button
          onClick={() => onCollapse(!collapsed)}
          className={`sidebar-collapse hidden lg:flex w-full items-center py-2.5 transition-colors ${collapsed ? "justify-center px-2" : "gap-2 px-4"}`}
          style={{ color: "rgba(200,214,236,0.75)", fontSize: 13 }}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          {!collapsed && <span>Collapse</span>}
        </button>

        {/* User info */}
        {!collapsed && (
          <div
            className="flex items-center gap-3 px-4 py-3 border-t"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-full text-sm font-semibold"
              style={{
                width: 36,
                height: 36,
                backgroundColor: "#1b5db4",
                color: "#fff",
                fontFamily: "var(--font-display)",
              }}
            >
              {userInfo.initials}
            </div>
            <div className="min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "#fff", fontFamily: "var(--font-display)" }}
              >
                {userInfo.name}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "rgba(200,214,236,0.7)" }}
              >
                {userInfo.title}
              </p>
            </div>
          </div>
        )}

        {/* Sign out */}
        <div
          className="flex items-center px-3 py-2 gap-1 border-t"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <button
            onClick={onSignOut}
            className="nav-btn flex items-center gap-2 px-2 py-2 rounded transition-colors flex-1"
            style={{ color: "rgba(200,214,236,0.7)", fontSize: 13 }}
            aria-label="Sign out"
          >
            <LogOut size={16} />
            {!collapsed && <span className="nav-label">Sign out</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 transition-all duration-200"
        style={{
          width: collapsed ? 64 : 240,
          backgroundColor: "#1a2540",
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
        aria-label="Primary navigation"
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className="fixed top-0 left-0 h-full z-50 lg:hidden transition-transform duration-200"
        style={{
          width: 260,
          backgroundColor: "#1a2540",
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
