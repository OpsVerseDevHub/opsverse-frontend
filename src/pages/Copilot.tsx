import { useState, useRef, useEffect } from "react";
import { Send, Trash2, Bot, Sparkles, Database, Zap, User } from "lucide-react";
import { useCopilot } from "@/hooks/useCopilot";

const TOOL_LABELS: Record<string, string> = {
  get_projects: "Reading projects…",
  get_tasks: "Fetching tasks…",
  get_project_health: "Analysing health…",
  get_team_metrics: "Pulling metrics…",
};

const SUGGESTIONS = [
  "What's the overall health of my projects?",
  "Show me all blocked tasks",
  "Which project has the most critical tasks?",
  "Give me a team performance summary",
];

function ToolBadge({ name }: { name: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
      style={{
        background: "rgba(6,182,212,0.12)",
        border: "1px solid rgba(6,182,212,0.25)",
        color: "#06b6d4",
      }}
    >
      <Database size={9} />
      {name.replace(/_/g, " ")}
    </span>
  );
}

function Cursor() {
  return (
    <span
      className="inline-block w-[2px] h-[14px] ml-0.5 align-middle rounded-sm"
      style={{
        background: "#8b5cf6",
        animation: "copilot-blink 1s step-start infinite",
      }}
    />
  );
}

export default function Copilot() {
  const { messages, loading, activeTool, send, clear } = useCopilot();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTool]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    send(input);
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: "var(--bg-base)" }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        style={{ borderBottom: "1px solid var(--border-primary)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              boxShadow: "0 0 20px rgba(124,58,237,0.4)",
            }}
          >
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>
              OpsVerse IQ
            </h1>
            <p className="text-[10px]" style={{ color: "var(--text-3)" }}>
              AI Co-Pilot · Powered by Claude
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={clear}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-150"
            style={{
              color: "var(--text-3)",
              border: "1px solid var(--border-subtle)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.3)";
              (e.currentTarget as HTMLElement).style.color = "#f87171";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-3)";
            }}
          >
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>

      {/* ── Chat area ── */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {/* Hero */}
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.2))",
                  border: "1px solid rgba(139,92,246,0.3)",
                  boxShadow: "0 0 40px rgba(124,58,237,0.15)",
                }}
              >
                <Bot size={28} style={{ color: "#8b5cf6" }} />
              </div>
              <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text-1)" }}>
                Ask me anything about your workspace
              </h2>
              <p className="text-sm" style={{ color: "var(--text-3)" }}>
                I can query your projects, tasks, and team metrics in real-time
              </p>
            </div>

            {/* Suggestion chips */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="text-left text-xs px-4 py-3 rounded-xl transition-all duration-150"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-2)",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.4)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-primary)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-2)";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
                  style={
                    msg.role === "assistant"
                      ? {
                          background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                          boxShadow: "0 0 12px rgba(124,58,237,0.3)",
                        }
                      : {
                          background: "var(--bg-hover)",
                          border: "1px solid var(--border-primary)",
                        }
                  }
                >
                  {msg.role === "assistant" ? (
                    <Sparkles size={12} className="text-white" />
                  ) : (
                    <User size={12} style={{ color: "var(--text-2)" }} />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? {
                          background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.15))",
                          border: "1px solid rgba(139,92,246,0.25)",
                          color: "var(--text-1)",
                        }
                      : {
                          background: "var(--bg-card)",
                          border: "1px solid var(--border-primary)",
                          color: "var(--text-1)",
                          backdropFilter: "blur(8px)",
                        }
                  }
                >
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {msg.toolCalls.map((t, i) => (
                        <ToolBadge key={i} name={t} />
                      ))}
                    </div>
                  )}

                  <span style={{ whiteSpace: "pre-wrap" }}>
                    {msg.content}
                    {msg.streaming && msg.role === "assistant" && <Cursor />}
                  </span>
                </div>
              </div>
            ))}

            {/* Active tool indicator */}
            {activeTool && (
              <div className="flex gap-3 items-center">
                <div
                  className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                    boxShadow: "0 0 12px rgba(124,58,237,0.3)",
                  }}
                >
                  <Sparkles size={12} className="text-white" />
                </div>
                <div
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl"
                  style={{
                    background: "rgba(6,182,212,0.08)",
                    border: "1px solid rgba(6,182,212,0.2)",
                    color: "#06b6d4",
                  }}
                >
                  <Zap size={11} className="animate-pulse" />
                  {TOOL_LABELS[activeTool] ?? `Running ${activeTool}…`}
                </div>
              </div>
            )}

            {loading && !activeTool && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-3 items-center">
                <div
                  className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
                >
                  <Sparkles size={12} className="text-white" />
                </div>
                <div
                  className="flex gap-1 px-4 py-3 rounded-2xl"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "var(--text-3)",
                        animation: `copilot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div
        className="shrink-0 px-6 py-4"
        style={{ borderTop: "1px solid var(--border-primary)" }}
      >
        <div
          className="flex gap-3 items-end rounded-2xl p-3 transition-all duration-150"
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-primary)",
          }}
          onFocus={() => {}}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about your projects, tasks, team…"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm outline-none"
            style={{
              color: "var(--text-1)",
              maxHeight: 120,
              lineHeight: 1.5,
            }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 120) + "px";
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 disabled:opacity-40"
            style={{
              background: input.trim() && !loading
                ? "linear-gradient(135deg,#7c3aed,#4f46e5)"
                : "var(--bg-hover)",
              boxShadow: input.trim() && !loading ? "0 0 16px rgba(124,58,237,0.3)" : "none",
            }}
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
        <p className="text-[10px] text-center mt-2" style={{ color: "var(--text-4)" }}>
          Shift+Enter for new line · Enter to send
        </p>
      </div>

      <style>{`
        @keyframes copilot-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes copilot-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
