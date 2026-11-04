import { useRef, useState, useEffect } from "react";
import { Bell, Search, CheckCheck, Zap, GitCommit, MessageSquare, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/state/authStore";
import { useNotifStore, type AppNotif } from "@/state/notificationStore";

const TYPE_ICON: Record<AppNotif["type"], React.ReactNode> = {
  task:   <Zap size={13} />,
  github: <GitCommit size={13} />,
  slack:  <MessageSquare size={13} />,
  system: <AlertCircle size={13} />,
};
const TYPE_COLOR: Record<AppNotif["type"], string> = {
  task:   "linear-gradient(135deg,#7c3aed,#4f46e5)",
  github: "linear-gradient(135deg,#2563eb,#3b82f6)",
  slack:  "linear-gradient(135deg,#059669,#10b981)",
  system: "linear-gradient(135deg,#d97706,#f59e0b)",
};

function timeAgo(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Navbar() {
  const { user }                          = useAuthStore();
  const { items, unread, markAllRead }    = useNotifStore();
  const [showNotif, setShowNotif]         = useState(false);
  const notifRef                          = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openNotif = () => {
    setShowNotif((v) => !v);
    if (!showNotif && unread > 0) setTimeout(markAllRead, 1500);
  };

  return (
    <header
      className="h-14 flex items-center px-5 gap-4 sticky top-0 z-30"
      style={{
        background: "var(--bg-navbar)",
        borderBottom: "1px solid var(--border-subtle)",
        backdropFilter: "blur(20px)",
        transition: "background 0.3s ease",
      }}
    >
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div
          className="flex items-center gap-2 px-3 h-8 rounded-lg text-sm transition-all duration-200 cursor-pointer"
          style={{ background: "var(--bg-input)", border: "1px solid var(--border-primary)" }}
        >
          <Search size={13} style={{ color: "var(--text-3)" }} />
          <span className="text-xs flex-1" style={{ color: "var(--text-3)" }}>Search…</span>
          <kbd
            className="text-[10px] px-1 py-0.5 rounded"
            style={{
              color: "var(--text-4)",
              background: "var(--bg-hover)",
              border: "1px solid var(--border-primary)",
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex-1" />

      {/* Bell + dropdown */}
      <div ref={notifRef} className="relative">
        <button
          onClick={openNotif}
          className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
          style={{ color: "var(--text-3)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "";
            (e.currentTarget as HTMLElement).style.color = "var(--text-3)";
          }}
        >
          <Bell size={16} />
          {unread > 0 && (
            <span
              className="absolute top-1 right-1 w-4 h-4 text-[9px] font-bold text-white rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 8px rgba(124,58,237,0.6)" }}
            >
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {showNotif && (
          <div
            className="absolute right-0 top-10 w-80 rounded-2xl overflow-hidden animate-dropdown"
            style={{
              background: "var(--bg-modal)",
              border: "1px solid var(--border-primary)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(139,92,246,0.08)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <span className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>
                Notifications
              </span>
              {items.length > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] transition-colors"
                  style={{ color: "var(--accent-violet)" }}
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Bell size={24} style={{ color: "var(--text-4)" }} />
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>All caught up</p>
                </div>
              ) : (
                items.slice(0, 20).map((n) => (
                  <div
                    key={n.id}
                    className="flex gap-3 px-4 py-3 transition-colors cursor-default"
                    style={{
                      background: n.read ? "transparent" : "rgba(139,92,246,0.05)",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = n.read ? "transparent" : "rgba(139,92,246,0.05)"; }}
                  >
                    <div
                      className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-white mt-0.5"
                      style={{ background: TYPE_COLOR[n.type] }}
                    >
                      {TYPE_ICON[n.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold leading-snug" style={{ color: "var(--text-1)" }}>
                        {n.title}
                      </p>
                      <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--text-3)" }}>
                        {n.body}
                      </p>
                      <p className="text-[10px] mt-1" style={{ color: "var(--text-4)" }}>
                        {timeAgo(n.ts)}
                      </p>
                    </div>
                    {!n.read && (
                      <div
                        className="shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                        style={{ background: "var(--accent-violet)", boxShadow: "0 0 6px rgba(139,92,246,0.7)" }}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-5" style={{ background: "var(--border-primary)" }} />

      {/* User chip */}
      <div className="flex items-center gap-2 pl-1">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-semibold"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
            boxShadow: "0 0 12px rgba(124,58,237,0.4)",
          }}
        >
          {user?.username?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-medium leading-none" style={{ color: "var(--text-1)" }}>
            {user?.username ?? "User"}
          </p>
          <p className="text-[10px] mt-0.5 capitalize" style={{ color: "var(--text-3)" }}>
            {user?.role ?? "member"}
          </p>
        </div>
      </div>
    </header>
  );
}
