import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GitCommit, Calendar, AlertCircle } from "lucide-react";
import type { Task } from "@/lib/types";

const PRIORITY_DOT: Record<string, { bg: string; text: string; glow: string }> = {
  low:    { bg: "rgba(100,116,139,0.15)", text: "#94a3b8", glow: "" },
  medium: { bg: "rgba(59,130,246,0.15)",  text: "#60a5fa", glow: "0 0 8px rgba(59,130,246,0.3)" },
  high:   { bg: "rgba(245,158,11,0.15)",  text: "#fbbf24", glow: "0 0 8px rgba(245,158,11,0.3)" },
  urgent: { bg: "rgba(239,68,68,0.15)",   text: "#f87171", glow: "0 0 8px rgba(239,68,68,0.4)" },
};

interface Props {
  task: Task;
  overlay?: boolean;
  onClick?: () => void;
}

export default function TaskCard({ task, overlay, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging && !overlay ? 0.3 : 1,
  };

  const isOverdue = task.due_date && !isDragging && new Date(task.due_date) < new Date();
  const p         = PRIORITY_DOT[task.priority] ?? PRIORITY_DOT.medium;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: overlay
          ? "rgba(20,25,38,0.98)"
          : "rgba(13,17,23,0.75)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        transform: overlay
          ? `${CSS.Translate.toString(transform)} rotate(2deg) scale(1.03)`
          : CSS.Translate.toString(transform),
        boxShadow: overlay
          ? "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(139,92,246,0.15)"
          : undefined,
        transition: isDragging ? "none" : "box-shadow 0.2s, transform 0.2s",
      }}
      {...listeners}
      {...attributes}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      className="rounded-xl p-3 cursor-grab active:cursor-grabbing select-none group"
      onMouseEnter={(e) => {
        if (!isDragging) {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.25)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
          (e.currentTarget as HTMLElement).style.transform = "";
          (e.currentTarget as HTMLElement).style.boxShadow = "";
        }
      }}
    >
      <p className="text-sm font-medium text-slate-200 leading-snug mb-2.5">{task.title}</p>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Priority badge */}
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize"
          style={{ background: p.bg, color: p.text, boxShadow: p.glow }}
        >
          {task.priority}
        </span>

        {/* Due date */}
        {task.due_date && (
          <span
            className="flex items-center gap-1 text-[10px] font-medium"
            style={{ color: isOverdue ? "#f87171" : "#64748b" }}
          >
            {isOverdue && <AlertCircle size={10} />}
            <Calendar size={10} />
            {new Date(task.due_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </span>
        )}

        {/* Commit */}
        {task.commit_hash && (
          <span className="flex items-center gap-1 text-[10px] font-mono text-slate-600">
            <GitCommit size={10} />
            {task.commit_hash.slice(0, 7)}
          </span>
        )}
      </div>
    </div>
  );
}
