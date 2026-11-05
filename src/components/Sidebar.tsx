import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Inbox, Activity, Layers, Settings,
  LogOut, Zap, ChevronRight, Pin, PinOff,
  Plus, ExternalLink, BarChart2, Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/state/authStore";
import { useProjects } from "@/hooks/useProjects";
import { useProjectStore } from "@/state/projectStore";
import NewProjectModal from "./NewProjectModal";

const W_COLLAPSED = 64;
const W_EXPANDED  = 240;

const GRADIENTS = [
  "linear-gradient(135deg,#7c3aed,#4f46e5)",
  "linear-gradient(135deg,#0891b2,#06b6d4)",
  "linear-gradient(135deg,#059669,#10b981)",
  "linear-gradient(135deg,#d97706,#f59e0b)",
  "linear-gradient(135deg,#be185d,#ec4899)",
  "linear-gradient(135deg,#2563eb,#3b82f6)",
];

export default function Sidebar() {
  const [pinned, setPinned]         = useState(() => localStorage.getItem("sb-pin") === "1");
  const [hovered, setHovered]       = useState(false);
  const [boardsOpen, setBoardsOpen] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);

  const expanded = pinned || hovered;

  const { logout, user }                    = useAuthStore();
  const { data: projects }                  = useProjects();
  const { activeProjectId, setActiveProject } = useProjectStore();
  const navigate                            = useNavigate();
  const location                            = useLocation();

  const isBoardActive = location.pathname.startsWith("/projects/");

  useEffect(() => {
    localStorage.setItem("sb-pin", pinned ? "1" : "0");
  }, [pinned]);

  // Auto-open boards accordion when on a board route
  useEffect(() => {
    if (isBoardActive) setBoardsOpen(true);
  }, [isBoardActive]);

  const labelStyle = (show: boolean): React.CSSProperties => ({
    opacity: show ? 1 : 0,
    transform: show ? "translateX(0)" : "translateX(-6px)",
    transition: "opacity 0.18s ease, transform 0.18s ease",
    whiteSpace: "nowrap",
    overflow: "hidden",
    pointerEvents: show ? "auto" : "none",
  });

  return (
    <>
    <div
      className="shrink-0 flex flex-col h-screen sticky top-0 z-40 overflow-hidden"
      style={{
        width: expanded ? W_EXPANDED : W_COLLAPSED,
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1), background 0.3s ease",
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-subtle)",
      }}
      onMouseEnter={() => !pinned && setHovered(true)}
      onMouseLeave={() => !pinned && setHovered(false)}
    >
      {/* Inner content — always 240px wide; outer clips it when collapsed */}
      <div className="flex flex-col h-full" style={{ width: W_EXPANDED }}>

        {/* ── Logo + pin ──────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 h-14 shrink-0">
          <div
            className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              boxShadow: "0 0 16px rgba(124,58,237,0.5)",
            }}
          >
            <Zap size={16} className="text-white" />
          </div>

          <span className="font-bold text-sm gradient-text flex-1" style={labelStyle(expanded)}>
            OpsVerse
          </span>

          {/* Pin / unpin */}
          <button
            onClick={() => { setPinned((p) => !p); setHovered(false); }}
            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all"
            title={pinned ? "Unpin sidebar" : "Pin sidebar"}
            style={labelStyle(expanded)}
          >
            {pinned ? <PinOff size={13} /> : <Pin size={13} />}
          </button>
        </div>

        {/* ── Divider ─────────────────────────────────── */}
        <div className="mx-4 mb-3" style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

        {/* ── Main nav ────────────────────────────────── */}
        <nav className="flex-1 flex flex-col gap-0.5 px-2 overflow-y-auto overflow-x-hidden">

          {/* Section label */}
          <p
            className="text-[9px] font-bold uppercase tracking-widest text-slate-700 px-3 mb-1"
            style={labelStyle(expanded)}
          >
            Menu
          </p>

          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" expanded={expanded} end />
          <NavItem to="/inbox"    icon={Inbox}    label="Inbox"     expanded={expanded} />
          <NavItem to="/messages" icon={Activity} label="Activity"  expanded={expanded} />

          {/* Boards with accordion */}
          <div>
            <button
              onClick={() => {
                if (!expanded) {
                  setHovered(true);
                  setBoardsOpen(true);
                } else {
                  setBoardsOpen((o) => !o);
                }
              }}
              className="relative w-full flex items-center gap-3 px-3 h-10 rounded-xl transition-all duration-150 group"
              style={{
                background: (isBoardActive || boardsOpen) ? "rgba(139,92,246,0.1)" : undefined,
                color: (isBoardActive || boardsOpen) ? "#a78bfa" : "#64748b",
              }}
              onMouseEnter={(e) => {
                if (!isBoardActive && !boardsOpen)
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                if (!isBoardActive && !boardsOpen)
                  (e.currentTarget as HTMLElement).style.background = "";
              }}
            >
              {/* Active accent bar */}
              {(isBoardActive || boardsOpen) && (
                <span
                  className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                  style={{ background: "linear-gradient(to bottom,#8b5cf6,#06b6d4)" }}
                />
              )}

              <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                <Layers size={18} />
              </div>

              <span className="text-sm font-medium flex-1 text-left" style={labelStyle(expanded)}>
                Boards
              </span>

              <ChevronRight
                size={13}
                className="shrink-0 transition-transform duration-200"
                style={{
                  ...labelStyle(expanded),
                  transform: boardsOpen
                    ? "rotate(90deg)"
                    : (expanded ? "rotate(0deg)" : "translateX(-6px)"),
                }}
              />
            </button>

            {/* Boards accordion content */}
            <div
              style={{
                maxHeight: boardsOpen && expanded ? 300 : 0,
                overflow: "hidden",
                transition: "max-height 0.25s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <div className="pl-4 pr-2 pb-1 pt-0.5 flex flex-col gap-0.5">
                {projects?.length ? (
                  projects.map((project, i) => {
                    const isActive = activeProjectId === project.id;
                    return (
                      <button
                        key={project.id}
                        onClick={() => {
                          setActiveProject(project.id);
                          navigate(`/projects/${project.id}/board`);
                        }}
                        className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg text-left transition-all duration-150"
                        style={{
                          background: isActive ? "rgba(139,92,246,0.15)" : undefined,
                          color: isActive ? "#c4b5fd" : "#64748b",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                          if (!isActive) (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) (e.currentTarget as HTMLElement).style.background = "";
                          if (!isActive) (e.currentTarget as HTMLElement).style.color = "#64748b";
                        }}
                      >
                        <div
                          className="w-4 h-4 rounded-md shrink-0 flex items-center justify-center text-white"
                          style={{ background: GRADIENTS[i % GRADIENTS.length], fontSize: 8, fontWeight: 700 }}
                        >
                          {project.name[0].toUpperCase()}
                        </div>
                        <span className="text-xs font-medium truncate">{project.name}</span>
                        {isActive && <ExternalLink size={10} className="ml-auto shrink-0 opacity-50" />}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-[11px] text-slate-700 px-2 py-1">No projects yet</p>
                )}

                {/* New project shortcut */}
                <button
                  onClick={() => setShowNewProject(true)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] transition-all mt-0.5"
                  style={{ color: "var(--text-4)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
                    (e.currentTarget as HTMLElement).style.color = "var(--accent-violet)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-4)";
                  }}
                >
                  <Plus size={12} />
                  New project
                </button>
              </div>
            </div>
          </div>

          {/* ── Section: Tools (future-ready placeholder) ── */}
          <div className="mt-3">
            <p
              className="text-[9px] font-bold uppercase tracking-widest text-slate-700 px-3 mb-1"
              style={labelStyle(expanded)}
            >
              Tools
            </p>
            <NavItem to="/reports"  icon={BarChart2} label="Reports"  expanded={expanded} />
            <NavItem to="/copilot"  icon={Sparkles}  label="AI Co-Pilot" expanded={expanded} />
          </div>
        </nav>

        {/* ── Divider ─────────────────────────────────── */}
        <div className="mx-4 mt-2" style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

        {/* ── Bottom ──────────────────────────────────── */}
        <div className="flex flex-col gap-0.5 px-2 py-3 shrink-0">
          <NavItem to="/settings" icon={Settings} label="Settings" expanded={expanded} />

          <button
            onClick={() => { logout(); navigate("/login"); }}
            title="Sign out"
            className="relative flex items-center gap-3 w-full px-3 h-10 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/8 transition-all duration-150"
          >
            <div className="shrink-0 w-5 h-5 flex items-center justify-center">
              <LogOut size={18} />
            </div>
            <span className="text-sm font-medium" style={labelStyle(expanded)}>Sign out</span>
          </button>

          {/* User card */}
          <div
            className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl transition-all duration-150"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div
              className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                boxShadow: "0 0 10px rgba(124,58,237,0.4)",
              }}
            >
              {user?.username?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0 flex-1" style={labelStyle(expanded)}>
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.username}</p>
              <p className="text-[10px] text-slate-600 capitalize truncate">{user?.role}</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} />}
  </>
  );
}

/* ── Reusable nav item ──────────────────────────────────────── */
interface NavItemProps {
  to:       string;
  icon:     React.ElementType;
  label:    string;
  expanded: boolean;
  end?:     boolean;
}

function NavItem({ to, icon: Icon, label, expanded, end }: NavItemProps) {
  const labelStyle: React.CSSProperties = {
    opacity: expanded ? 1 : 0,
    transform: expanded ? "translateX(0)" : "translateX(-6px)",
    transition: "opacity 0.18s ease, transform 0.18s ease",
    whiteSpace: "nowrap",
    overflow: "hidden",
    pointerEvents: expanded ? "auto" : "none",
  };

  return (
    <NavLink
      to={to}
      end={end}
      title={!expanded ? label : undefined}
      className="relative block"
    >
      {({ isActive }) => (
        <div
          className="relative flex items-center gap-3 px-3 h-10 rounded-xl transition-all duration-150"
          style={{
            background: isActive ? "rgba(139,92,246,0.12)" : undefined,
            color: isActive ? "#a78bfa" : "#64748b",
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              (e.currentTarget as HTMLElement).style.background = "";
              (e.currentTarget as HTMLElement).style.color = "#64748b";
            }
          }}
        >
          {/* Left accent bar */}
          {isActive && (
            <span
              className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
              style={{ background: "linear-gradient(to bottom,#8b5cf6,#06b6d4)" }}
            />
          )}

          <div className="shrink-0 w-5 h-5 flex items-center justify-center">
            <Icon size={18} />
          </div>

          <span className="text-sm font-medium flex-1" style={labelStyle}>
            {label}
          </span>
        </div>
      )}
    </NavLink>
  );
}
