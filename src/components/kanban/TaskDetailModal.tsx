import { useState, useEffect } from "react";
import { X, GitCommit, Trash2 } from "lucide-react";
import { useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import type { Task } from "@/lib/types";

const STATUSES = ["todo", "in_progress", "review", "done"];
const PRIORITIES = ["low", "medium", "high", "urgent"];

interface Props {
  task: Task;
  onClose: () => void;
}

export default function TaskDetailModal({ task, onClose }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.due_date ?? "");
  const [dirty, setDirty] = useState(false);

  const { mutate: updateTask, isPending: saving } = useUpdateTask();
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-lg font-semibold focus:outline-none border-b border-transparent focus:border-blue-400 pb-0.5"
          />
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description…"
          rows={3}
          className="w-full text-sm text-gray-700 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />

        {/* Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-sm border rounded px-2 py-1.5 focus:outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full text-sm border rounded px-2 py-1.5 focus:outline-none"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-sm border rounded px-2 py-1.5 focus:outline-none"
            />
          </div>
          {task.assignee_id && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Assignee ID</label>
              <p className="text-sm text-gray-700 py-1.5">{task.assignee_id}</p>
            </div>
          )}
        </div>

        {/* GitHub info */}
        {task.commit_hash && (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded px-3 py-2">
            <GitCommit size={13} />
            <span>Commit: <code className="font-mono">{task.commit_hash.slice(0, 12)}</code></span>
            {task.github_issue_id && <span>· Issue #{task.github_issue_id}</span>}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            <Trash2 size={14} /> {deleting ? "Deleting…" : "Delete"}
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!dirty || saving}
              className="text-sm bg-blue-600 text-white rounded px-4 py-1.5 hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
