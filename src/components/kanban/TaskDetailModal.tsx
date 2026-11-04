import { useState, useEffect } from "react";
import { X, GitCommit, Trash2 } from "lucide-react";
import { useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import type { Task } from "@/lib/types";

const STATUSES   = ["todo", "in_progress", "review", "done"];
const PRIORITIES = ["low", "medium", "high", "urgent"];

interface Props {
  task:    Task;
  onClose: () => void;
}

export default function TaskDetailModal({ task, onClose }: Props) {
  const [title, setTitle]           = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [status, setStatus]         = useState(task.status);
  const [priority, setPriority]     = useState(task.priority);
  const [dueDate, setDueDate]       = useState(task.due_date ?? "");
  const [dirty, setDirty]           = useState(false);

  const { mutate: updateTask, isPending: saving  } = useUpdateTask();
  const { mutate: deleteTask, isPending: deleting } = useDeleteTask();

  useEffect(() => {
    setDirty(
      title !== task.title ||
      description !== (task.description ?? "") ||
      status !== task.status ||
      priority !== task.priority ||
      dueDate !== (task.due_date ?? "")
    );
  }, [title, description, status, priority, dueDate, task]);

  const handleSave = () => {
    updateTask(
      { taskId: task.id, data: { title, description, status, priority, due_date: dueDate || undefined } },
      { onSuccess: onClose }
    );
  };

  const handleDelete = () => {
    if (!confirm("Delete this task?")) return;
    deleteTask(task.id, { onSuccess: onClose });
  };

  const fieldStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#e2e8f0",
    borderRadius: 10,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4 animate-slide-up"
        style={{
          background: "rgba(13,17,23,0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 0 60px rgba(139,92,246,0.1), 0 32px 64px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-base font-semibold bg-transparent outline-none text-slate-100 border-b pb-1 transition-colors"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)"; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
          <button
            onClick={onClose}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description…"
          rows={3}
          className="w-full text-sm resize-none outline-none p-3 rounded-xl placeholder-slate-700 transition-colors"
          style={fieldStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)"; }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
        />

        {/* Fields */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Status",   val: status,   set: setStatus,   opts: STATUSES   },
            { label: "Priority", val: priority, set: setPriority, opts: PRIORITIES },
          ].map(({ label, val, set, opts }) => (
            <div key={label}>
              <label className="block text-xs text-slate-500 mb-1.5 font-medium">{label}</label>
              <select
                value={val}
                onChange={(e) => set(e.target.value)}
                className="w-full text-sm px-2.5 py-1.5 outline-none capitalize"
                style={fieldStyle}
              >
                {opts.map((o) => (
                  <option key={o} value={o} style={{ background: "#0d1117" }}>
                    {o.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div>
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-sm px-2.5 py-1.5 outline-none"
              style={{ ...fieldStyle, colorScheme: "dark" }}
            />
          </div>

          {task.assignee_id && (
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 font-medium">Assignee</label>
              <p className="text-sm text-slate-400 py-1.5">#{task.assignee_id}</p>
            </div>
          )}
        </div>

        {/* GitHub info */}
        {task.commit_hash && (
          <div
            className="flex items-center gap-2 text-xs text-slate-500 rounded-xl px-3 py-2"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <GitCommit size={12} />
            <span>Commit: <code className="font-mono text-violet-400">{task.commit_hash.slice(0, 12)}</code></span>
            {task.github_issue_id && <span>· Issue #{task.github_issue_id}</span>}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            <Trash2 size={14} /> {deleting ? "Deleting…" : "Delete"}
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="text-sm text-slate-500 hover:text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!dirty || saving}
              className="text-sm text-white rounded-lg px-4 py-1.5 transition-all duration-200 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
              onMouseEnter={(e) => { if (!saving && dirty) (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(124,58,237,0.4)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
