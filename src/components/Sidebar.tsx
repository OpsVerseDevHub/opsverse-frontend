import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Inbox, Layers, Users, Settings,
  MessageSquare, Activity, LogOut, Zap,
} from "lucide-react";
import SpaceList from "./SpaceList";
import { useAuthStore } from "@/state/authStore";
import { useState } from "react";

type Panel = "spaces" | "inbox" | "settings" | null;

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/",       panel: null       as Panel },
  { icon: Inbox,           label: "Inbox",     to: "/inbox",  panel: null       as Panel },
  { icon: Activity,        label: "Activity",  to: "/messages", panel: null     as Panel },
  { icon: Layers,          label: "Boards",    to: null,      panel: "spaces"   as Panel },
];

export default function Sidebar() {
  const [panel, setPanel] = useState<Panel>(null);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const toggle = (p: Panel) => setPanel((prev) => (prev === p ? null : p));

  return (
    <div className="flex h-screen sticky top-0 z-40">
      {/* Icon rail */}
      <div className="w-16 flex flex-col items-center py-5 gap-1"
           style={{ background: "rgba(6,10,20,0.95)", borderRight: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Logo */}
        <div className="mb-5 w-9 h-9 rounded-xl gradient-violet flex items-center justify-center glow-violet-sm">
          <Zap size={18} className="text-white" />
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-1 flex-1 w-full px-2">
          {NAV.map(({ icon: Icon, label, to, panel: p }) => {
            const active = panel === p && p !== null;
            if (to && !p) {
              return (
                <NavLink
                  key={label}
                  to={to}
                  end={to === "/"}
                  title={label}
                  className={({ isActive }) =>
                    `flex items-center justify-center w-full h-10 rounded-xl transition-all duration-200 group
                     ${isActive
                       ? "bg-violet-600/20 text-violet-400"
                       : "text-slate-500 hover:text-slate-200 hover:bg-white/5"}`
                  }
                >
                  <Icon size={20} />
                </NavLink>
              );
            }
            return (
              <button
                key={label}
                onClick={() => toggle(p!)}
                title={label}
                className={`flex items-center justify-center w-full h-10 rounded-xl transition-all duration-200
                  ${active
                    ? "bg-violet-600/20 text-violet-400"
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/5"}`}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>

        {/* Bottom: settings + logout */}
        <div className="flex flex-col gap-1 w-full px-2 pb-2">
          <NavLink
            to="/settings"
            title="Settings"
            className={({ isActive }) =>
              `flex items-center justify-center w-full h-10 rounded-xl transition-all duration-200
               ${isActive ? "text-violet-400 bg-violet-600/20" : "text-slate-500 hover:text-slate-200 hover:bg-white/5"}`
            }
          >
            <Settings size={20} />
          </NavLink>

          <button
            title="Sign out"
            onClick={() => { logout(); navigate("/login"); }}
            className="flex items-center justify-center w-full h-10 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={18} />
          </button>

          {/* User avatar */}
          <div className="mt-2 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full gradient-violet flex items-center justify-center text-white text-xs font-bold ring-2 ring-violet-500/30">
              {user?.username?.[0]?.toUpperCase() ?? "U"}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out panel */}
      {panel && (
        <div
          className="w-56 flex flex-col p-4 gap-2 animate-slide-in"
          style={{
            background: "rgba(10,13,22,0.95)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
          }}
        >
          {panel === "spaces" && (
            <>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Projects</p>
              <SpaceList />
            </>
          )}
          {panel === "inbox" && (
            <>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Inbox</p>
              <NavLink to="/inbox"    onClick={() => setPanel(null)} className="nav-item flex items-center gap-2"><MessageSquare size={14}/>Slack Messages</NavLink>
              <NavLink to="/messages" onClick={() => setPanel(null)} className="nav-item flex items-center gap-2"><Activity size={14}/>GitHub Activity</NavLink>
            </>
          )}
          {panel === "settings" && (
            <>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Settings</p>
              <NavLink to="/settings" onClick={() => setPanel(null)} className="nav-item">Preferences</NavLink>
            </>
          )}
        </div>
      )}
    </div>
  );
}
