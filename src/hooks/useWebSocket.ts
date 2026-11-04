import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/state/authStore";
import { useNotifStore } from "@/state/notificationStore";

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
  const addNotif    = useNotifStore((s) => s.add);
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
          queryClient.invalidateQueries({ queryKey: ["tasks", event.project_id] });
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          addNotif({ type: "task", title: "Task created", body: `Task #${event.task_id} added to project` });
          break;
        case "task_updated":
          queryClient.invalidateQueries({ queryKey: ["tasks", event.project_id] });
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          addNotif({ type: "task", title: "Task updated", body: `Task #${event.task_id} was modified` });
          break;
        case "task_status_changed":
          queryClient.invalidateQueries({ queryKey: ["tasks", event.project_id] });
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          addNotif({ type: "task", title: "Status changed", body: `Task #${event.task_id} → ${(event as any).status}` });
          break;
        case "task_deleted":
          queryClient.invalidateQueries({ queryKey: ["tasks", event.project_id] });
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          addNotif({ type: "task", title: "Task deleted", body: `Task #${event.task_id} removed` });
          break;
        case "github_event":
          queryClient.invalidateQueries({ queryKey: ["github-activity"] });
          addNotif({ type: "github", title: "GitHub event", body: `${event.event_type} on ${event.repo}` });
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
