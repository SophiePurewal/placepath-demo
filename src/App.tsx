import { useState, useCallback, useRef, useEffect } from "react";
import { SharedStateProvider } from "./store";
import { Menu, Bell, ChevronDown, Check, LogOut } from "lucide-react";
import Sidebar, { type Screen } from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Toast, { type ToastData } from "./components/Toast";
import NotificationsPanel from "./components/NotificationsPanel";
import ProfileAvatar from "./components/ProfileAvatar";
import SignIn from "./screens/SignIn";
import Dashboard from "./screens/coordinator/Dashboard";
import CreatePlacement from "./screens/coordinator/CreatePlacement";
import Employers from "./screens/coordinator/Employers";
import EmployerDetail from "./screens/coordinator/EmployerDetail";
import Placements from "./screens/coordinator/Placements";
import EmployerDashboard from "./screens/employer/Dashboard";
import StudentDashboard from "./screens/student/Dashboard";
import Tasks from "./screens/shared/Tasks";
import Messages from "./screens/shared/Messages";
import {
  initialNotifications,
  employerNotifications,
  studentNotifications,
  type AppNotification,
} from "./conversations";

type Role = "coordinator" | "employer" | "student";

const roleDefaults: Record<Role, Screen> = {
  coordinator: "dashboard",
  employer: "emp-dashboard",
  student: "stu-dashboard",
};

const roleProfiles: Record<Role, { name: string; title: string; initials: string }> = {
  coordinator: { name: "Sarah Ahmed", title: "Placement Coordinator", initials: "SA" },
  employer: { name: "David Hughes", title: "Operations Manager", initials: "DH" },
  student: { name: "Maya Thompson", title: "Health & Social Care L3", initials: "MT" },
};

const viewAsOptions: { role: Role; name: string; desc: string }[] = [
  { role: "coordinator", name: "Sarah Ahmed", desc: "Placement Coordinator" },
  { role: "employer", name: "David Hughes", desc: "Operations Manager" },
  { role: "student", name: "Maya Thompson", desc: "Health & Social Care L3" },
];

function getNotificationsForRole(r: Role): AppNotification[] {
  return r === "coordinator"
    ? [...initialNotifications]
    : r === "employer"
      ? [...employerNotifications]
      : [...studentNotifications];
}

function getMessagesScreen(r: Role): Screen {
  return r === "coordinator" ? "messages" : r === "employer" ? "emp-messages" : "stu-messages";
}
function getTasksScreen(r: Role): Screen {
  return r === "coordinator" ? "tasks" : r === "employer" ? "emp-requests" : "stu-tasks";
}

function getPageTitle(s: Screen): string {
  const titles: Partial<Record<Screen, string>> = {
    dashboard: "Home",
    "create-placement": "New Placement",
    employers: "Employers",
    "employer-detail": "Employer Record",
    placements: "Placements",
    tasks: "Tasks",
    students: "Students",
    visits: "Visits",
    messages: "Messages",
    notifications: "Notifications",
    reports: "Reports",
    settings: "Settings",
    help: "Help",
    "emp-dashboard": "Home",
    "emp-requests": "Placement Requests",
    "emp-active": "Active Placements",
    "emp-students": "Students",
    "emp-documents": "Documents",
    "emp-messages": "Messages",
    "emp-organisation": "Organisation Details",
    "stu-dashboard": "Home",
    "stu-placement": "My Placement",
    "stu-tasks": "Tasks",
    "stu-schedule": "Schedule",
    "stu-attendance": "Attendance",
    "stu-objectives": "Learning Objectives",
    "stu-documents": "Documents",
    "stu-messages": "Messages",
  };
  return titles[s] ?? "PlacePath";
}

/** Shared PlacePath wordmark */
function PlacePathLogo({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center"
      aria-label="PlacePath — go to dashboard"
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 20,
          color: "#1a2540",
          letterSpacing: "-0.3px",
          lineHeight: 1,
        }}
      >
        Place<span style={{ color: "#1b5db4" }}>Path</span>
      </span>
    </button>
  );
}

function PlaceholderScreen({
  screen,
  onNavigate,
  role,
}: {
  screen: Screen;
  onNavigate: (s: Screen) => void;
  role: Role;
}) {
  const defaultScreen: Screen =
    role === "coordinator" ? "dashboard" : role === "employer" ? "emp-dashboard" : "stu-dashboard";
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: "#ebf3fc" }}
      >
        <Bell size={28} style={{ color: "#1b5db4" }} />
      </div>
      <h2
        className="text-xl font-semibold mb-2"
        style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
      >
        {getPageTitle(screen)}
      </h2>
      <p className="text-sm mb-6" style={{ color: "#5b6a8a", maxWidth: 320 }}>
        This section is included in the full PlacePath product. The prototype focuses on the core
        journeys for each role.
      </p>
      <button
        onClick={() => onNavigate(defaultScreen)}
        className="px-5 py-2.5 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#1b5db4", color: "#fff", fontFamily: "var(--font-display)" }}
      >
        Return to dashboard
      </button>
    </div>
  );
}

export default function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [role, setRole] = useState<Role>("coordinator");
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedEmployerId, setSelectedEmployerId] = useState("e1");
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Return focus to hamburger when mobile nav closes
  useEffect(() => {
    if (!mobileNavOpen) {
      hamburgerRef.current?.focus();
    }
  }, [mobileNavOpen]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(
    getNotificationsForRole("coordinator"),
  );

  const addToast = useCallback((type: "success" | "error" | "info", message: string) => {
    const id = String(Date.now());
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const navigate = useCallback((newScreen: Screen, payload?: unknown) => {
    if (newScreen === "employer-detail" && typeof payload === "string") {
      setSelectedEmployerId(payload);
    }
    setScreen(newScreen);
    setNotifOpen(false);
    setProfileMenuOpen(false);
  }, []);

  const selectEmployer = useCallback((id: string) => {
    setSelectedEmployerId(id);
  }, []);

  const signIn = (selectedRole: Role) => {
    setRole(selectedRole);
    setScreen(roleDefaults[selectedRole]);
    setNotifications(getNotificationsForRole(selectedRole));
    setSignedIn(true);
  };

  const signOut = () => {
    setSignedIn(false);
    setRole("coordinator");
    setScreen("dashboard");
    setMobileNavOpen(false);
    setProfileMenuOpen(false);
    setNotifOpen(false);
  };

  const switchRole = (newRole: Role) => {
    setRole(newRole);
    setScreen(roleDefaults[newRole]);
    setNotifications(getNotificationsForRole(newRole));
    setProfileMenuOpen(false);
    const p = roleProfiles[newRole];
    addToast("info", `Viewing as ${p.name} — ${p.title}`);
  };

  const markNotifRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotifRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  if (!signedIn) {
    return (
      <>
        <SignIn onSignIn={signIn} />
        <Toast toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  const profile = roleProfiles[role];
  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const defaultScreen = roleDefaults[role];
  const tasksScreen = getTasksScreen(role);
  const messagesScreen = getMessagesScreen(role);

  return (
    <SharedStateProvider>
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
      {/* Sidebar */}
      <Sidebar
        role={role}
        currentScreen={screen}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
        onSignOut={signOut}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── Global header ── */}
        <header
          className="flex items-center gap-2 px-4 md:px-6 flex-shrink-0"
          style={{ height: 68, backgroundColor: "#fff", borderBottom: "1px solid #e3e9f1", zIndex: 10 }}
        >
          {/* Mobile: hamburger */}
          <button
            ref={hamburgerRef}
            className="lg:hidden p-2 rounded-md flex-shrink-0 icon-btn"
            style={{ color: "#5b6a8a", minHeight: 44, minWidth: 44 }}
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-nav"
          >
            <Menu size={22} />
          </button>

          {/* Mobile: PlacePath logo */}
          <div className="lg:hidden flex-shrink-0">
            <PlacePathLogo onClick={() => navigate(defaultScreen)} />
          </div>

          {/* Desktop: subtle page title */}
          <span
            className="hidden lg:block text-sm font-medium ml-1 flex-shrink-0"
            style={{ color: "#5b6a8a", fontFamily: "var(--font-display)" }}
          >
            {getPageTitle(screen)}
          </span>

          <div className="flex-1" />

          {/* Notifications */}
          <div className="relative flex-shrink-0">
            <button
              className="relative p-2 rounded-md transition-colors hover:bg-ep-blue-lighter"
              style={{ color: "#5b6a8a" }}
              aria-label={`Notifications${unreadNotifCount > 0 ? `, ${unreadNotifCount} unread` : ""}`}
              aria-expanded={notifOpen}
              aria-haspopup="dialog"
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileMenuOpen(false);
              }}
            >
              <Bell size={20} />
              {unreadNotifCount > 0 && (
                <span
                  className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: "#ef4444", color: "#fff", fontSize: 10 }}
                  aria-hidden="true"
                >
                  {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <NotificationsPanel
                notifications={notifications}
                onRead={markNotifRead}
                onReadAll={markAllNotifRead}
                onNavigate={navigate}
                onClose={() => setNotifOpen(false)}
              />
            )}
          </div>

          {/* Profile menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => {
                setProfileMenuOpen(!profileMenuOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-md transition-colors hover:bg-ep-blue-lighter"
              aria-expanded={profileMenuOpen}
              aria-haspopup="menu"
              aria-label="User profile and options"
            >
              <ProfileAvatar role={role} size={32} decorative />
              <div className="hidden sm:block text-left">
                <p
                  className="text-sm font-semibold leading-tight"
                  style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
                >
                  {profile.name}
                </p>
                <p className="text-xs leading-tight" style={{ color: "#5b6a8a" }}>
                  {profile.title}
                </p>
              </div>
              <ChevronDown
                size={14}
                style={{
                  color: "#9ca3af",
                  transition: "transform 0.15s",
                  transform: profileMenuOpen ? "rotate(180deg)" : "none",
                }}
                aria-hidden="true"
              />
            </button>

            {profileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setProfileMenuOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className="absolute right-0 top-full mt-1 z-40 rounded-xl border shadow-xl overflow-hidden"
                  style={{ backgroundColor: "#fff", borderColor: "#d5e2f0", minWidth: 260 }}
                  role="menu"
                >
                  <div
                    className="flex items-center gap-3 px-4 py-4 border-b"
                    style={{ borderColor: "#ebf3fc" }}
                  >
                    <ProfileAvatar role={role} size={36} />
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
                      >
                        {profile.name}
                      </p>
                      <p className="text-xs" style={{ color: "#5b6a8a" }}>
                        {profile.title}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pt-3 pb-1">
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-2"
                      style={{ color: "#9ca3af", fontFamily: "var(--font-display)" }}
                    >
                      View prototype as
                    </p>
                  </div>
                  {viewAsOptions.map((opt) => (
                    <button
                      key={opt.role}
                      role="menuitem"
                      onClick={() => switchRole(opt.role)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-ep-blue-lighter"
                    >
                      <ProfileAvatar role={opt.role} size={28} />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}
                        >
                          {opt.name}
                        </p>
                        <p className="text-xs" style={{ color: "#5b6a8a" }}>
                          {opt.desc}
                        </p>
                      </div>
                      {role === opt.role && (
                        <Check size={14} style={{ color: "#1b5db4", flexShrink: 0 }} />
                      )}
                    </button>
                  ))}

                  <div className="border-t mt-1" style={{ borderColor: "#ebf3fc" }} />
                  <button
                    role="menuitem"
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-ep-blue-lighter"
                  >
                    <LogOut size={15} style={{ color: "#9ca3af" }} />
                    <span className="text-sm" style={{ color: "#5b6a8a" }}>
                      Sign out
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* ── Main content ── */}
        <main
          className={`flex-1 min-h-0 flex flex-col ${screen === messagesScreen ? "overflow-hidden" : "overflow-y-auto pb-20 md:pb-0"}`}
          id="main-content"
          tabIndex={-1}
        >
          {/* Tasks — all roles */}
          {screen === tasksScreen && <Tasks role={role} onAddToast={addToast} />}

          {/* Messages — all roles */}
          {screen === messagesScreen && <Messages role={role} onAddToast={addToast} />}

          {/* ── Coordinator screens ── */}
          {role === "coordinator" && screen === "dashboard" && (
            <Dashboard onNavigate={navigate} onAddToast={addToast} />
          )}
          {role === "coordinator" && screen === "create-placement" && (
            <CreatePlacement onNavigate={navigate} onAddToast={addToast} />
          )}
          {role === "coordinator" && screen === "employers" && (
            <Employers onNavigate={navigate} onSelectEmployer={selectEmployer} />
          )}
          {role === "coordinator" && screen === "employer-detail" && (
            <EmployerDetail
              employerId={selectedEmployerId}
              onNavigate={navigate}
              onAddToast={addToast}
            />
          )}
          {role === "coordinator" && screen === "placements" && (
            <Placements onNavigate={navigate} />
          )}
          {role === "coordinator" &&
            ["students", "visits", "notifications", "reports", "settings", "help"].includes(
              screen,
            ) && <PlaceholderScreen screen={screen} onNavigate={navigate} role={role} />}

          {/* ── Employer screens ── */}
          {role === "employer" && screen === "emp-dashboard" && (
            <EmployerDashboard onAddToast={addToast} />
          )}
          {role === "employer" &&
            !["emp-dashboard", "emp-requests", "emp-messages"].includes(screen) && (
              <PlaceholderScreen screen={screen} onNavigate={navigate} role={role} />
            )}

          {/* ── Student screens ── */}
          {role === "student" && screen === "stu-dashboard" && (
            <StudentDashboard onAddToast={addToast} />
          )}
          {role === "student" &&
            !["stu-dashboard", "stu-tasks", "stu-messages"].includes(screen) && (
              <PlaceholderScreen screen={screen} onNavigate={navigate} role={role} />
            )}
        </main>
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />
      <BottomNav
        role={role}
        currentScreen={screen}
        onNavigate={navigate}
        onOpenMore={() => setMobileNavOpen(true)}
      />
    </div>
    </SharedStateProvider>
  );
}
