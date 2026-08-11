import { Bell, MessageSquare, CheckSquare, Briefcase, FileText, Calendar, Check, X } from "lucide-react";
import type { AppNotification } from "../conversations";
import type { Screen } from "./Sidebar";

interface NotificationsPanelProps {
  notifications: AppNotification[];
  onRead: (id: string) => void;
  onReadAll: () => void;
  onNavigate: (screen: Screen) => void;
  onClose: () => void;
}

const typeIcon: Record<AppNotification["type"], React.ElementType> = {
  message: MessageSquare,
  task: CheckSquare,
  placement: Briefcase,
  document: FileText,
  visit: Calendar,
};

const typeColor: Record<AppNotification["type"], string> = {
  message: "#1b5db4",
  task: "#b45309",
  placement: "#15803d",
  document: "#b91c1c",
  visit: "#7c3aed",
};

export default function NotificationsPanel({
  notifications,
  onRead,
  onReadAll,
  onNavigate,
  onClose,
}: NotificationsPanelProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClick = (n: AppNotification) => {
    onRead(n.id);
    if (n.targetScreen) onNavigate(n.targetScreen);
    onClose();
  };

  return (
    <>
      {/* Click-away overlay */}
      <div className="fixed inset-0 z-30" onClick={onClose} aria-hidden="true" />

      <div
        className="absolute right-0 top-full mt-1 z-40 rounded-xl border shadow-xl overflow-hidden"
        style={{ backgroundColor: "#fff", borderColor: "#d5e2f0", width: 340 }}
        role="dialog"
        aria-label="Notifications"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "#ebf3fc" }}
        >
          <div className="flex items-center gap-2">
            <Bell size={16} style={{ color: "#1a2540" }} />
            <h2
              className="text-sm font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
            >
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: "#1b5db4", color: "#fff" }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onReadAll}
                className="text-xs font-medium ep-link"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Mark all read
              </button>
            )}
            <button onClick={onClose} style={{ color: "#9ca3af" }} aria-label="Close notifications">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* List */}
        <ul className="overflow-y-auto" style={{ maxHeight: 420 }}>
          {notifications.length === 0 && (
            <li className="flex flex-col items-center py-12 text-center px-4">
              <Bell size={24} style={{ color: "#d5e2f0", marginBottom: 8 }} />
              <p className="text-sm" style={{ color: "#9ca3af" }}>No notifications</p>
            </li>
          )}
          {notifications.map((n) => {
            const Icon = typeIcon[n.type];
            const color = typeColor[n.type];
            return (
              <li key={n.id}>
                <button
                  onClick={() => handleClick(n)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left border-b transition-colors hover:bg-ep-blue-lighter"
                  style={{
                    borderColor: "#ebf3fc",
                    backgroundColor: n.read ? "transparent" : "#f4f8fd",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${color}14` }}
                  >
                    <Icon size={14} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm"
                      style={{
                        color: "#1a2540",
                        fontFamily: "var(--font-display)",
                        fontWeight: n.read ? 400 : 600,
                      }}
                    >
                      {n.title}
                    </p>
                    <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "#5b6a8a" }}>
                      {n.body}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>{n.time}</p>
                  </div>
                  {!n.read && (
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                      style={{ backgroundColor: "#1b5db4" }}
                      aria-label="Unread"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {notifications.length > 0 && (
          <div className="px-4 py-3 border-t" style={{ borderColor: "#ebf3fc" }}>
            <button
              className="w-full flex items-center justify-center gap-1.5 text-sm font-medium ep-link"
              style={{ fontFamily: "var(--font-display)" }}
              onClick={onClose}
            >
              <Check size={13} /> View all activity
            </button>
          </div>
        )}
      </div>
    </>
  );
}
