import { useProjects } from "@/hooks/useProjects";
import { useProjectStore } from "@/state/projectStore";
import Skeleton from "./Skeleton";

const COLORS = [
  "bg-green-500", "bg-red-500", "bg-yellow-500",
  "bg-blue-500", "bg-purple-500", "bg-orange-500",
];

export default function SpaceList() {
  const { data: projects, isLoading } = useProjects();
  const { activeProjectId, setActiveProject } = useProjectStore();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => <Skeleton key={i} height="h-8" />)}
      </div>
    );
  }

  if (!projects?.length) {
    return <p className="text-xs text-gray-400 italic">No projects yet.</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      {projects.map((project, i) => (
        <button
          key={project.id}
          onClick={() => setActiveProject(project.id)}
          className={`flex items-center px-2 py-2 text-sm rounded transition ${
            activeProjectId === project.id
              ? "bg-blue-100 font-semibold text-blue-800"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs mr-3 shrink-0 ${COLORS[i % COLORS.length]}`}>
            {project.name[0].toUpperCase()}
          </div>
          <span className="truncate">{project.name}</span>
        </button>
      ))}
    </div>
  );
}
