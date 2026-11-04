import { useState } from "react";
import { useCreateTask } from "@/hooks/useTasks";
import { X } from "lucide-react";

interface Props {
  projectId: number;
  defaultStatus: string;
  onClose: () => void;
}

export default function AddTaskForm({ projectId, defaultStatus, onClose }: Props) {
  const [title, setTitle] = useState("");
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

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border shadow-sm p-3 space-y-2">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title…"
        className="w-full text-sm border rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="flex items-center gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="text-xs border rounded px-2 py-1 focus:outline-none"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <div className="flex-1" />
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
        <button
          type="submit"
          disabled={!title.trim() || isPending}
          className="text-xs bg-blue-600 text-white rounded px-3 py-1 disabled:opacity-50 hover:bg-blue-700 transition"
        >
          {isPending ? "Adding…" : "Add"}
        </button>
      </div>
    </form>
  );
}
