import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import KanbanColumn from "@/components/kanban/KanbanColumn";
import TaskCard from "@/components/kanban/TaskCard";
import { useTasks, useUpdateTaskStatus } from "@/hooks/useTasks";
import { useProject } from "@/hooks/useProjects";
import type { Task } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

const STATUSES = ["todo", "in_progress", "review", "done"] as const;
const STATUS_LABELS: Record<string, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

export default function Board() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);

  const { data: project } = useProject(projectId);
  const { data: tasks = [], isLoading } = useTasks(projectId);
  const { mutate: updateStatus } = useUpdateTaskStatus();

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const tasksByStatus = STATUSES.reduce<Record<string, Task[]>>((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {} as Record<string, Task[]>);

  function onDragStart({ active }: DragStartEvent) {
    const task = tasks.find((t) => t.id === Number(active.id));
    setActiveTask(task ?? null);
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null);
    if (!over) return;
    const task = tasks.find((t) => t.id === Number(active.id));
    if (!task || task.status === over.id) return;
    updateStatus({ taskId: task.id, status: String(over.id) });
  }

  if (isLoading) {
    return (
      <div className="flex gap-4 p-6 overflow-x-auto">
        {STATUSES.map((s) => (
          <div key={s} className="w-72 shrink-0 h-64 bg-white rounded-lg shadow-sm animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Board header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b bg-white">
        <Link to="/" className="text-gray-400 hover:text-gray-600 transition">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-bold text-gray-900">{project?.name ?? "Board"}</h1>
          <p className="text-xs text-gray-400">{tasks.length} task{tasks.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Columns */}
      <div className="flex-1 overflow-auto p-6">
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="flex gap-5 h-full">
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                label={STATUS_LABELS[status]}
                tasks={tasksByStatus[status]}
                projectId={projectId}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
            {activeTask && <TaskCard task={activeTask} overlay />}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
