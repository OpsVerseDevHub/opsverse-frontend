import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GitCommit, Calendar } from "lucide-react";
import type { Task } from "@/lib/types";

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

interface Props {
  task: Task;
  overlay?: boolean;
  onClick?: () => void;
}

export default function TaskCard({ task, overlay, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging && !overlay ? 0.4 : 1,
  };

  const isOverdue =
    task.due_date && !isDragging && new Date(task.due_date) < new Date();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`bg-white rounded-lg border p-3 space-y-2 cursor-grab active:cursor-grabbing select-none
        ${overlay ? "shadow-xl rotate-1 scale-105" : "shadow-sm hover:shadow-md"}
        transition-shadow`}
    >
      <p className="text-sm font-medium text-gray-900 leading-snug">{task.title}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.medium}`}>
          {task.priority}
        </span>

        {task.due_date && (
          <span className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-500 font-medium" : "text-gray-400"}`}>
            <Calendar size={11} />
            {new Date(task.due_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </span>
        )}

        {task.commit_hash && (
          <span className="flex items-center gap-1 text-xs text-gray-400 font-mono">
            <GitCommit size={11} />
            {task.commit_hash.slice(0, 7)}
          </span>
        )}
      </div>
    </div>
  );
}
