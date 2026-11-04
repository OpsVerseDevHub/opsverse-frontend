import { Bell, Search, Command } from "lucide-react";
import { useAuthStore } from "@/state/authStore";

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <header
      className="h-14 flex items-center px-5 gap-4 sticky top-0 z-30"
      style={{
        background: "rgba(6,10,20,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Search bar */}
      <div className="flex-1 max-w-sm">
        <div
          className="flex items-center gap-2 px-3 h-8 rounded-lg text-sm transition-all duration-200 cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
          onClick={() => {}}
        >
          <Search size={13} className="text-slate-500 shrink-0" />
          <span className="text-slate-500 text-xs flex-1">Search…</span>
          <div className="flex items-center gap-0.5 ml-2">
            <kbd className="text-slate-600 text-[10px] px-1 py-0.5 rounded"
                 style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
        >
          <Bell size={16} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "#8b5cf6", boxShadow: "0 0 6px rgba(139,92,246,0.8)" }}
          />
        </button>

        {/* Divider */}
        <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.07)" }} />

        {/* User chip */}
        <div className="flex items-center gap-2 pl-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-semibold"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              boxShadow: "0 0 12px rgba(124,58,237,0.4)",
            }}
          >
            {user?.username?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-slate-200 leading-none">{user?.username ?? "User"}</p>
            <p className="text-[10px] text-slate-500 mt-0.5 capitalize">{user?.role ?? "member"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
