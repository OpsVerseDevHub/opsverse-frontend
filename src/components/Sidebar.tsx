import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, Inbox, Layers, Users, Settings, MessageSquare, BarChart2,
} from "lucide-react";
import SpaceList from "./SpaceList";
import { useAuthStore } from "@/state/authStore";

type Section = "home" | "inbox" | "tasks" | "spaces" | "settings";

export default function Sidebar() {
  const [expanded, setExpanded] = useState<Section | null>(null);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const toggle = (section: Section) =>
    setExpanded((prev) => (prev === section ? null : section));

  const close = () => setExpanded(null);

  const iconCls = (section: Section) =>
    `hover:text-blue-400 transition ${expanded === section ? "text-blue-400" : "text-gray-400"}`;

  return (
    <div className="flex h-screen sticky top-0">
      {/* Icon strip */}
      <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-4 gap-6">
        <NavLink to="/" title="Home" onClick={close} className={iconCls("home")}>
          <Home size={22} />
        </NavLink>

        <button onClick={() => toggle("inbox")} title="Inbox" className={iconCls("inbox")}>
          <Inbox size={22} />
        </button>

        <button onClick={() => toggle("tasks")} title="Tasks" className={iconCls("tasks")}>
          <Layers size={22} />
        </button>

        <button onClick={() => toggle("spaces")} title="Spaces" className={iconCls("spaces")}>
          <Users size={22} />
        </button>

        <div className="flex-1" />

        <button onClick={() => toggle("settings")} title="Settings" className={iconCls("settings")}>
          <Settings size={22} />
        </button>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="w-56 bg-gray-50 border-r flex flex-col p-4 gap-1 animate-fade-in">
          {expanded === "home" && (
            <>
              <h2 className="font-bold mb-2 text-sm text-gray-700">Home</h2>
              <NavLink to="/" onClick={close} className="nav-item">Dashboard</NavLink>
              <NavLink to="/reports" onClick={close} className="nav-item">Reports</NavLink>
            </>
          )}

          {expanded === "inbox" && (
            <>
              <h2 className="font-bold mb-2 text-sm text-gray-700">Inbox</h2>
              <NavLink to="/inbox" onClick={close} className="nav-item flex items-center gap-2">
                <MessageSquare size={15} /> Slack Messages
              </NavLink>
              <NavLink to="/messages" onClick={close} className="nav-item flex items-center gap-2">
                <BarChart2 size={15} /> All Conversations
              </NavLink>
            </>
          )}

          {expanded === "tasks" && (
            <>
              <h2 className="font-bold mb-2 text-sm text-gray-700">Tasks</h2>
              <p className="text-xs text-gray-400 italic">Select a project from Spaces to open its board.</p>
            </>
          )}

          {expanded === "spaces" && (
            <>
              <h2 className="font-bold mb-2 text-sm text-gray-700">Spaces</h2>
              <SpaceList />
            </>
          )}

          {expanded === "settings" && (
            <>
              <h2 className="font-bold mb-2 text-sm text-gray-700">Settings</h2>
              <NavLink to="/settings" onClick={close} className="nav-item">Profile & Preferences</NavLink>
              <button
                onClick={() => { logout(); navigate("/login"); }}
                className="nav-item text-left text-red-500 hover:text-red-600 mt-2"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
