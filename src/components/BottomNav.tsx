import {
  Home,
  CheckSquare,
  Briefcase,
  Building2,
  MessageSquare,
  Target,
  MoreHorizontal,
} from "lucide-react";
import type { Screen } from "./Sidebar";

type Role = "coordinator" | "employer" | "student";

interface NavItem {
  id: Screen | "more";
  label: string;
  Icon: React.ElementType;
}

const coordinatorNav: NavItem[] = [
  { id: "dashboard", label: "Home", Icon: Home },
  { id: "tasks", label: "Tasks", Icon: CheckSquare },
  { id: "placements", label: "Placements", Icon: Briefcase },
  { id: "messages", label: "Messages", Icon: MessageSquare },
  { id: "employers", label: "Employers", Icon: Building2 },
];

const employerNav: NavItem[] = [
  { id: "emp-dashboard", label: "Home", Icon: Home },
  { id: "emp-requests", label: "Requests", Icon: Briefcase },
  { id: "emp-active", label: "Placements", Icon: CheckSquare },
  { id: "emp-messages", label: "Messages", Icon: MessageSquare },
  { id: "more", label: "More", Icon: MoreHorizontal },
];

const studentNav: NavItem[] = [
  { id: "stu-dashboard", label: "Home", Icon: Home },
  { id: "stu-placement", label: "Placement", Icon: Target },
  { id: "stu-tasks", label: "Tasks", Icon: CheckSquare },
  { id: "stu-messages", label: "Messages", Icon: MessageSquare },
  { id: "more", label: "More", Icon: MoreHorizontal },
];

interface BottomNavProps {
  role: Role;
  currentScreen: Screen;
  onNavigate: (s: Screen) => void;
  onOpenMore: () => void;
}

export default function BottomNav({
  role,
  currentScreen,
  onNavigate,
  onOpenMore,
}: BottomNavProps) {
  const items =
    role === "coordinator"
      ? coordinatorNav
      : role === "employer"
        ? employerNav
        : studentNav;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{
        backgroundColor: "#fff",
        boxShadow: "0 -1px 0 rgba(20, 35, 65, 0.08), 0 -4px 16px rgba(20, 35, 65, 0.06)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      aria-label="Main navigation"
    >
      <div className="flex items-stretch">
        {items.map((item) => {
          const isMore = item.id === "more";
          const isActive = !isMore && currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => (isMore ? onOpenMore() : onNavigate(item.id as Screen))}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2"
              style={{
                color: isActive ? "#1b5db4" : "#7a8fb5",
                minHeight: 56,
                fontFamily: "var(--font-display)",
                background: "none",
                border: "none",
              }}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
            >
              <item.Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: isActive ? 600 : 400,
                  lineHeight: 1,
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
