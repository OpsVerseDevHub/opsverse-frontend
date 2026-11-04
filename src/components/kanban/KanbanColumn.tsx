import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";
import TaskDetailModal from "./TaskDetailModal";
import type { Task } from "@/lib/types";

const COLUMN_CONFIG: Record<string, { accent: string; glow: string; pill: string }> = {
  todo:        { accent: "#64748b", glow: "rgba(100,116,139,0.15)", pill: "status-todo"     },
  in_progress: { accent: "#3b82f6", glow: "rgba(59,130,246,0.15)",  pill: "status-progress" },
  review:      { accent: "#f59e0b", glow: "rgba(245,158,11,0.15)",  pill: "status-review"   },
  done:        { accent: "#10b981", glow: "rgba(16,185,129,0.15)",  pill: "status-done"     },
};

interface Props {
  status:    string;
  label:     string;
  tasks:     Task[];
  projectId: number;
}

export default function KanbanColumn({ status, label, tasks, projectId }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const [adding, setAdding]   = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const cfg = COLUMN_CONFIG[status] ?? COLUMN_CONFIG.todo;

  return (
    <>
      <div className="flex flex-col w-72 shrink-0">
        {/* Column header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: cfg.accent, boxShadow: `0 0 8px ${cfg.accent}` }}
            />
            <span className="font-semibold text-sm text-slate-300">{label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${cfg.pill}`}
            >
              {tasks.length}
            </span>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
            title={`Add task to ${label}`}
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Drop zone */}
        <div
          ref={setNodeRef}
          className="flex-1 flex flex-col gap-2 min-h-32 rounded-2xl p-2 transition-all duration-200"
          style={{
            background: isOver
              ? `rgba(${cfg.accent.replace("#", "").match(/.{2}/g)?.map(h => parseInt(h,16)).join(",")},0.08)`
              : "var(--bg-card)",
            border: `1px solid ${isOver ? cfg.accent + "40" : "rgba(255,255,255,0.05)"}`,
            boxShadow: isOver ? `inset 0 0 20px ${cfg.glow}` : undefined,
          }}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => setSelectedTask(task)}
            />
          ))}

          {adding && (
            <AddTaskForm
              projectId={projectId}
              defaultStatus={status}
              onClose={() => setAdding(false)}
            />
          )}

          {!adding && tasks.length === 0 && (
            <button
              onClick={() => setAdding(true)}
              className="rounded-xl p-4 text-xs text-slate-700 hover:text-slate-500 transition-all duration-200 text-center"
              style={{
                border: "1px dashed rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = cfg.accent + "50"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              + Add a task
            </button>
          )}
        </div>
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
}
