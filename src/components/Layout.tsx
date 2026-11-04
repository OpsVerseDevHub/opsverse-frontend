import { type ReactNode, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useThemeStore } from "@/state/themeStore";

interface Props { children: ReactNode; }

export default function Layout({ children }: Props) {
  useWebSocket();
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Ambient orbs + grid */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="orb orb-violet" style={{ width: 600, height: 600, top: -200, left: -100 }} />
        <div className="orb orb-cyan"   style={{ width: 500, height: 500, bottom: -150, right: -100 }} />
        <div className="orb orb-blue"   style={{ width: 400, height: 400, top: "40%", left: "40%" }} />
        <div className="bg-grid absolute inset-0" />
      </div>

      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 relative z-10">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
