import { useState, useRef, useCallback } from "react";
import { useAuthStore } from "@/state/authStore";

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: string[];
  streaming?: boolean;
}

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export function useCopilot() {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const accessToken = useAuthStore((s) => s.accessToken);

  const send = useCallback(async (userText: string) => {
    if (!userText.trim() || loading) return;

    const userMsg: CopilotMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userText.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setActiveTool(null);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", streaming: true },
    ]);

    // Build history for the API (exclude the placeholder assistant msg)
    const history = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    abortRef.current = new AbortController();

    try {
      const res = await fetch(`${API_BASE}/copilot/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          let evt: { type: string; text?: string; tool?: string };
          try { evt = JSON.parse(raw); } catch { continue; }

          if (evt.type === "text" && evt.text) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + evt.text! }
                  : m
              )
            );
          } else if (evt.type === "tool_start" && evt.tool) {
            setActiveTool(evt.tool);
          } else if (evt.type === "tool_result") {
            setActiveTool(null);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, toolCalls: [...(m.toolCalls ?? []), evt.tool!] }
                  : m
              )
            );
          } else if (evt.type === "done") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, streaming: false } : m
              )
            );
          } else if (evt.type === "error") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: evt.text ?? "Error", streaming: false }
                  : m
              )
            );
          }
        }
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "Connection error. Is the server running?", streaming: false }
              : m
          )
        );
      }
    } finally {
      setLoading(false);
      setActiveTool(null);
    }
  }, [messages, loading, accessToken]);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setLoading(false);
    setActiveTool(null);
  }, []);

  return { messages, loading, activeTool, send, clear };
}
