import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  useWebSocket();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50">
        <Navbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
