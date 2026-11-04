import { useState } from "react";
import { useThemeStore } from "@/state/themeStore";
import { useAuthStore } from "@/state/authStore";
import { Moon, Sun, Bell, BellOff, Shield, Palette } from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const { theme, setTheme } = useThemeStore();
  const { user } = useAuthStore();
  const isDark = theme === "dark";

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--text-1)" }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-3)" }}>Manage your account and preferences</p>
      </div>

      {/* Profile card */}
      <section
        className="rounded-2xl p-5 flex items-center gap-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
            boxShadow: "0 0 24px rgba(124,58,237,0.4)",
          }}
        >
          {user?.username?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div>
          <p className="font-semibold text-base" style={{ color: "var(--text-1)" }}>
            {user?.username ?? "Username"}
          </p>
          <p className="text-sm mt-0.5 capitalize" style={{ color: "var(--text-3)" }}>
            {user?.email ?? "user@example.com"}
          </p>
          <span
            className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
            style={{
              background: "rgba(139,92,246,0.15)",
              color: "var(--accent-violet)",
              border: "1px solid rgba(139,92,246,0.25)",
            }}
          >
            {user?.role ?? "developer"}
          </span>
        </div>
      </section>

      {/* Appearance */}
      <section
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}
      >
        <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <Palette size={16} style={{ color: "var(--accent-violet)" }} />
          <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Appearance</p>
        </div>

        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: isDark ? "rgba(139,92,246,0.15)" : "rgba(245,158,11,0.15)" }}
            >
              {isDark
                ? <Moon size={16} style={{ color: "var(--accent-violet)" }} />
                : <Sun  size={16} style={{ color: "var(--accent-amber)" }} />}
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>
                {isDark ? "Dark mode" : "Light mode"}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                {isDark ? "Easy on the eyes in low light" : "Best for bright environments"}
              </p>
            </div>
          </div>

          {/* Custom toggle */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`theme-switch ${isDark ? "on" : ""}`}
            aria-label="Toggle dark mode"
          >
            <div className="theme-switch-knob" />
          </button>
        </div>

        {/* Theme preview cards */}
        <div className="px-5 pb-4 grid grid-cols-2 gap-3">
          {(["dark","light"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className="rounded-xl p-3 flex flex-col gap-2 text-left transition-all duration-200"
              style={{
                background: t === "dark" ? "rgba(6,10,20,0.6)" : "rgba(241,245,249,0.8)",
                border: `1px solid ${theme === t ? "rgba(139,92,246,0.5)" : "var(--border-primary)"}`,
                boxShadow: theme === t ? "0 0 12px rgba(139,92,246,0.2)" : "none",
              }}
            >
              <div className="flex gap-1.5">
                <div className="w-6 h-6 rounded-lg" style={{ background: t === "dark" ? "#0d1117" : "#ffffff", border: "1px solid rgba(139,92,246,0.3)" }} />
                <div className="flex-1 flex flex-col gap-1 justify-center">
                  <div className="h-1.5 rounded-full w-3/4" style={{ background: t === "dark" ? "#334155" : "#cbd5e1" }} />
                  <div className="h-1 rounded-full w-1/2" style={{ background: t === "dark" ? "#1e293b" : "#e2e8f0" }} />
                </div>
              </div>
              <p
                className="text-[11px] font-semibold capitalize"
                style={{ color: theme === t ? "var(--accent-violet)" : "var(--text-3)" }}
              >
                {t} {theme === t && "✓"}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}
      >
        <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <Bell size={16} style={{ color: "var(--accent-cyan)" }} />
          <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Notifications</p>
        </div>

        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: notifications ? "rgba(6,182,212,0.15)" : "rgba(100,116,139,0.1)" }}
            >
              {notifications
                ? <Bell    size={16} style={{ color: "var(--accent-cyan)" }} />
                : <BellOff size={16} style={{ color: "var(--text-3)" }} />}
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>In-app notifications</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                Task updates, GitHub events and Slack pings
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotifications((n) => !n)}
            className={`theme-switch ${notifications ? "on" : ""}`}
            style={notifications ? { background: "linear-gradient(135deg,#0891b2,#06b6d4)", boxShadow: "0 0 12px rgba(6,182,212,0.4)" } : {}}
          >
            <div className="theme-switch-knob" />
          </button>
        </div>
      </section>

      {/* Security (placeholder) */}
      <section
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}
      >
        <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <Shield size={16} style={{ color: "var(--accent-green)" }} />
          <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Security</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs" style={{ color: "var(--text-3)" }}>
            Session-based authentication active. Tokens rotate every 15 minutes.
          </p>
        </div>
      </section>
    </div>
  );
}
