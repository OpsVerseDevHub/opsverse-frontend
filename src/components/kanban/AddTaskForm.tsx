import { useState } from "react";
import { useCreateTask } from "@/hooks/useTasks";
import { X } from "lucide-react";

interface Props {
  projectId:     number;
  defaultStatus: string;
  onClose:       () => void;
}

export default function AddTaskForm({ projectId, defaultStatus, onClose }: Props) {
  const [title, setTitle]       = useState("");
  const [priority, setPriority] = useState("medium");
  const { mutate: createTask, isPending } = useCreateTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createTask(
      { title: title.trim(), project_id: projectId, status: defaultStatus, priority },
      { onSuccess: onClose }
    );
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#e2e8f0",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-3 flex flex-col gap-2"
      style={{ background: "rgba(20,25,38,0.9)", border: "1px solid rgba(139,92,246,0.3)" }}
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title…"
        className="w-full text-sm rounded-lg px-2.5 py-1.5 outline-none placeholder-slate-600"
        style={inputStyle}
        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)"; }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
      />
      <div className="flex items-center gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="text-xs rounded-lg px-2 py-1 outline-none flex-1"
          style={inputStyle}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X size={15} />
        </button>
        <button
          type="submit"
          disabled={!title.trim() || isPending}
          className="text-xs text-white rounded-lg px-3 py-1 transition-all duration-200 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
        >
          {isPending ? "…" : "Add"}
        </button>
      </div>
    </form>
  );
}
