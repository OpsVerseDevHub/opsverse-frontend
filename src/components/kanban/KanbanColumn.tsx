import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";
import TaskDetailModal from "./TaskDetailModal";
import type { Task } from "@/lib/types";

const COLUMN_STYLES: Record<string, string> = {
  todo: "border-t-slate-400",
  in_progress: "border-t-blue-500",
  review: "border-t-amber-500",
  done: "border-t-green-500",
};

interface Props {
  status: string;
  label: string;
  tasks: Task[];
  projectId: number;
}

export default function KanbanColumn({ status, label, tasks, projectId }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const [adding, setAdding] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <>
      <div className="flex flex-col w-72 shrink-0">
        {/* Column header */}
        <div className={`flex items-center justify-between mb-3 pb-2 border-b-2 ${COLUMN_STYLES[status] ?? "border-b-gray-300"}`}>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-700">{label}</span>
            <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 font-medium">
              {tasks.length}
            </span>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="text-gray-400 hover:text-blue-600 transition"
            title={`Add task to ${label}`}
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Drop zone */}
        <div
          ref={setNodeRef}
          className={`flex-1 flex flex-col gap-2 min-h-32 rounded-lg p-1 transition-colors
            ${isOver ? "bg-blue-50 ring-2 ring-blue-300 ring-inset" : ""}`}
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
              className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-xs text-gray-400 hover:border-blue-300 hover:text-blue-400 transition text-center"
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
