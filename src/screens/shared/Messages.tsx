import { useState } from "react";
import { Search, ArrowLeft, Send, MessageSquare, Filter } from "lucide-react";
import type { Conversation, ChatMessage } from "../../conversations";
import {
  initialConversations,
  employerConversations,
  studentConversations,
} from "../../conversations";

type Role = "coordinator" | "employer" | "student";

interface MessagesProps {
  role: Role;
  onAddToast: (type: "success" | "error" | "info", message: string) => void;
}

function getSenderInitials(role: Role): string {
  return role === "coordinator" ? "SA" : role === "employer" ? "DH" : "MT";
}
function getSenderName(role: Role): string {
  return role === "coordinator"
    ? "Sarah Ahmed"
    : role === "employer"
      ? "David Hughes"
      : "Maya Thompson";
}

function formatParticipants(conv: Conversation, role: Role): string {
  const me = getSenderName(role);
  return conv.participants.filter((p) => p !== me).join(", ");
}

export default function Messages({ role, onAddToast }: MessagesProps) {
  const initialList =
    role === "coordinator"
      ? initialConversations
      : role === "employer"
        ? employerConversations
        : studentConversations;

  const [conversations, setConversations] = useState<Conversation[]>(initialList);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const openConversation = (id: string) => {
    setActiveId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c)),
    );
  };

  const backToList = () => setActiveId(null);

  const sendReply = () => {
    if (!replyText.trim() || !activeId) return;
    setSending(true);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}.${now.getMinutes().toString().padStart(2, "0")}`;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: getSenderName(role),
      senderInitials: getSenderInitials(role),
      isOwn: true,
      text: replyText.trim(),
      time: `Today ${timeStr}`,
    };
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c;
          return {
            ...c,
            messages: [...c.messages, newMsg],
            lastMessage: newMsg.text,
            lastTime: `Today ${timeStr}`,
            unread: false,
          };
        }),
      );
      setReplyText("");
      setSending(false);
      onAddToast("success", "Message sent.");
    }, 400);
  };

  const filtered = conversations.filter((c) => {
    const matchSearch =
      search === "" ||
      formatParticipants(c, role).toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase()) ||
      (c.relatedPlacement ?? "").toLowerCase().includes(search.toLowerCase());
    const matchUnread = !filterUnread || c.unread;
    return matchSearch && matchUnread;
  });

  const activeConv = conversations.find((c) => c.id === activeId) ?? null;
  const unreadCount = conversations.filter((c) => c.unread).length;

  return (
    <div className="flex h-full min-h-0">

      {/* ── Conversation list ── */}
      <div
        className={`flex flex-col flex-shrink-0 ${
          activeId ? "hidden md:flex md:w-80 xl:w-96" : "flex w-full md:w-80 xl:w-96"
        }`}
        style={{ backgroundColor: "#fff", borderRight: "1px solid #e2e8f0" }}
      >
        {/* Panel heading */}
        <div
          className="px-4 pt-5 pb-4 flex-shrink-0"
          style={{ borderBottom: "1px solid #eef2f7" }}
        >
          <h1
            className="ep-section-title"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#1a2540" }}
          >
            Messages
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#5b6a8a" }}>
            {unreadCount > 0 ? `${unreadCount} unread` : "All read"}
          </p>
        </div>

        {/* Search + filter */}
        <div className="p-3 flex-shrink-0" style={{ borderBottom: "1px solid #eef2f7" }}>
          <div className="relative mb-2">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#9ca3af" }}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="w-full rounded-xl border pl-8 pr-3 py-2 text-sm"
              style={{ borderColor: "#d5e2f0", outline: "none", color: "#1a2540" }}
            />
          </div>
          <button
            onClick={() => setFilterUnread(!filterUnread)}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors"
            style={{
              borderColor: filterUnread ? "#1b5db4" : "#d5e2f0",
              color: filterUnread ? "#1b5db4" : "#5b6a8a",
              backgroundColor: filterUnread ? "#ebf3fc" : "transparent",
              fontFamily: "var(--font-display)",
            }}
            aria-pressed={filterUnread}
          >
            <Filter size={11} /> Unread only
          </button>
        </div>

        {/* List — scrollable, clears bottom nav on mobile */}
        <ul className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {filtered.length === 0 && (
            <li className="flex flex-col items-center py-12 text-center px-4">
              <MessageSquare size={24} style={{ color: "#d5e2f0", marginBottom: 8 }} />
              <p className="text-sm" style={{ color: "#9ca3af" }}>
                {search ? "No conversations match your search." : "No messages yet."}
              </p>
            </li>
          )}
          {filtered.map((conv) => {
            const active = conv.id === activeId;
            const other = formatParticipants(conv, role);
            return (
              <li key={conv.id}>
                <button
                  onClick={() => openConversation(conv.id)}
                  className="w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors"
                  style={{
                    borderBottom: "1px solid #eef2f7",
                    backgroundColor: active ? "#ebf3fc" : conv.unread ? "#f6f9fd" : "transparent",
                    borderLeft: active ? "3px solid #1b5db4" : "3px solid transparent",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                    style={{
                      backgroundColor: active ? "#1b5db4" : "#e8f0f8",
                      color: active ? "#fff" : "#4b82c8",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {other
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p
                        className="text-sm truncate"
                        style={{
                          color: "#1a2540",
                          fontFamily: "var(--font-display)",
                          fontWeight: conv.unread ? 600 : 500,
                        }}
                      >
                        {other}
                      </p>
                      <span className="text-xs flex-shrink-0" style={{ color: "#9ca3af" }}>
                        {conv.lastTime}
                      </span>
                    </div>
                    {conv.relatedPlacement && (
                      <p className="text-xs truncate" style={{ color: "#1b5db4" }}>
                        {conv.relatedPlacement}
                      </p>
                    )}
                    <p className="text-xs truncate mt-0.5" style={{ color: "#5b6a8a" }}>
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread && (
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                      style={{ backgroundColor: "#1b5db4" }}
                      aria-label="Unread"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Active thread ── */}
      <div
        className={`flex-1 flex flex-col min-w-0 ${!activeId ? "hidden md:flex" : "flex"}`}
        style={{ backgroundColor: "#eef2f7" }}
      >
        {!activeConv ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageSquare size={36} style={{ color: "#c7d7ec", marginBottom: 12 }} />
            <p
              className="text-base font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
            >
              Select a conversation
            </p>
            <p className="text-sm mt-1" style={{ color: "#5b6a8a" }}>
              Choose a conversation from the list to read and reply.
            </p>
          </div>
        ) : (
          <>
            {/* Conversation header — clean, no card border */}
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{
                backgroundColor: "#fff",
                boxShadow: "0 1px 0 rgba(20, 35, 65, 0.07)",
              }}
            >
              <button
                className="md:hidden p-1.5 rounded-xl"
                style={{ color: "#5b6a8a" }}
                onClick={backToList}
                aria-label="Back to conversations"
              >
                <ArrowLeft size={18} />
              </button>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                style={{
                  backgroundColor: "#1b5db4",
                  color: "#fff",
                  fontFamily: "var(--font-display)",
                }}
                aria-hidden="true"
              >
                {formatParticipants(activeConv, role)
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: "#1a2540" }}
                >
                  {formatParticipants(activeConv, role)}
                </p>
                {activeConv.relatedPlacement && (
                  <p className="text-xs" style={{ color: "#1b5db4" }}>
                    {activeConv.relatedPlacement}
                  </p>
                )}
              </div>
            </div>

            {/* Message stream — page scrolls, no inner scrollbar visible */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2.5">
              {activeConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex flex-col ${msg.isOwn ? "items-end" : "items-start"}`}
                    style={{ maxWidth: "78%" }}
                  >
                    <div
                      className="px-4 py-2.5 text-sm"
                      style={{
                        backgroundColor: msg.isOwn ? "#1b5db4" : "#ffffff",
                        color: msg.isOwn ? "#fff" : "#1a2540",
                        borderRadius: 12,
                        boxShadow: msg.isOwn
                          ? "none"
                          : "0 1px 4px rgba(20, 35, 65, 0.08)",
                        lineHeight: 1.6,
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.text}
                    </div>
                    <p className="text-xs mt-1 px-1" style={{ color: "#9ca3af" }}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky composer — above bottom nav on mobile */}
            <div
              className="flex items-end gap-2 px-4 py-3 flex-shrink-0 pb-24 md:pb-3"
              style={{
                backgroundColor: "#fff",
                boxShadow: "0 -1px 0 rgba(20, 35, 65, 0.07)",
              }}
            >
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendReply();
                  }
                }}
                placeholder="Write a reply… (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="flex-1 rounded-xl border px-3 py-2.5 text-sm"
                style={{
                  borderColor: "#d5e2f0",
                  color: "#1a2540",
                  outline: "none",
                  resize: "none",
                  minHeight: 44,
                  backgroundColor: "#fff",
                }}
                aria-label="Reply message"
              />
              <button
                onClick={sendReply}
                disabled={!replyText.trim() || sending}
                className="flex items-center justify-center rounded-xl transition-opacity"
                style={{
                  backgroundColor: "#1b5db4",
                  color: "#fff",
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  opacity: !replyText.trim() || sending ? 0.45 : 1,
                }}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
