import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/state/authStore";

const WS_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000")
  .replace(/^http/, "ws");

type WSEvent =
  | { type: "task_created"; task_id: number; project_id: number }
  | { type: "task_updated"; task_id: number; project_id: number }
  | { type: "task_status_changed"; task_id: number; project_id: number; status: string }
  | { type: "task_deleted"; task_id: number; project_id: number }
  | { type: "github_event"; event_type: string; repo: string };

export function useWebSocket() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryDelay = useRef(1000);
  const unmountedRef = useRef(false);

  function connect(token: string) {
    if (unmountedRef.current) return;

    const ws = new WebSocket(`${WS_URL}/ws?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      retryDelay.current = 1000;
    };

    ws.onmessage = (e) => {
      let event: WSEvent;
      try {
        event = JSON.parse(e.data);
      } catch {
        return;
      }

      switch (event.type) {
        case "task_created":
        case "task_updated":
        case "task_status_changed":
        case "task_deleted":
          queryClient.invalidateQueries({ queryKey: ["tasks", event.project_id] });
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          break;
        case "github_event":
          queryClient.invalidateQueries({ queryKey: ["github-activity"] });
          break;
      }
    };

    ws.onclose = (e) => {
      if (unmountedRef.current || e.code === 4001) return;
      retryRef.current = setTimeout(() => {
        retryDelay.current = Math.min(retryDelay.current * 2, 30_000);
        connect(token);
      }, retryDelay.current);
    };
  }

  useEffect(() => {
    unmountedRef.current = false;

    if (!accessToken) return;

    connect(accessToken);

    return () => {
      unmountedRef.current = true;
      if (retryRef.current) clearTimeout(retryRef.current);
      wsRef.current?.close();
    };
  }, [accessToken]);
}
