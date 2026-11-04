import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { useProjectStore } from "@/state/projectStore";

const GRADIENTS = [
  "linear-gradient(135deg, #7c3aed, #4f46e5)",
  "linear-gradient(135deg, #0891b2, #06b6d4)",
  "linear-gradient(135deg, #059669, #10b981)",
  "linear-gradient(135deg, #d97706, #f59e0b)",
  "linear-gradient(135deg, #be185d, #ec4899)",
  "linear-gradient(135deg, #2563eb, #3b82f6)",
];

export default function SpaceList() {
  const { data: projects, isLoading } = useProjects();
  const { activeProjectId, setActiveProject } = useProjectStore();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1.5">
        {[1, 2, 3].map((i) => <div key={i} className="h-8 skeleton rounded-lg" />)}
      </div>
    );
  }

  if (!projects?.length) {
    return <p className="text-xs text-slate-600 italic">No projects yet.</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      {projects.map((project, i) => {
        const active = activeProjectId === project.id;
        return (
          <button
            key={project.id}
            onClick={() => { setActiveProject(project.id); navigate(`/projects/${project.id}/board`); }}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-200 text-left"
            style={{
              background: active ? "rgba(139,92,246,0.15)" : "transparent",
              color: active ? "#c4b5fd" : "#64748b",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#64748b";
              }
            }}
          >
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{ background: GRADIENTS[i % GRADIENTS.length] }}
            >
              {project.name[0].toUpperCase()}
            </div>
            <span className="truncate text-xs font-medium">{project.name}</span>
          </button>
        );
      })}
    </div>
  );
}
