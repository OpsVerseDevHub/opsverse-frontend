import { useState, useRef, useEffect, type FormEvent } from "react";
import { X, Layers, ArrowRight } from "lucide-react";
import { useCreateProject } from "@/hooks/useProjects";
import { useProjectStore } from "@/state/projectStore";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
}

const COLORS = [
  { label: "Violet", from: "#7c3aed", to: "#4f46e5" },
  { label: "Cyan",   from: "#0891b2", to: "#06b6d4" },
  { label: "Green",  from: "#059669", to: "#10b981" },
  { label: "Amber",  from: "#d97706", to: "#f59e0b" },
  { label: "Pink",   from: "#be185d", to: "#ec4899" },
  { label: "Blue",   from: "#2563eb", to: "#3b82f6" },
];

export default function NewProjectModal({ onClose }: Props) {
  const [name, setName]           = useState("");
  const [description, setDesc]    = useState("");
  const [colorIdx, setColorIdx]   = useState(0);
  const { mutate: create, isPending, error } = useCreateProject();
  const { setActiveProject }      = useProjectStore();
  const navigate                  = useNavigate();
  const inputRef                  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    create(
      { name: name.trim(), description: description.trim() || undefined },
      {
        onSuccess: (project) => {
          setActiveProject(project.id);
          navigate(`/projects/${project.id}/board`);
          onClose();
        },
      }
    );
  };

  const color = COLORS[colorIdx];
  const preview = name.trim() || "P";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl flex flex-col animate-slide-up"
        style={{
          background: "var(--bg-modal)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 60px rgba(139,92,246,0.12), 0 32px 64px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg,${color.from},${color.to})`,
                boxShadow: `0 0 20px ${color.from}50`,
                transition: "all 0.3s ease",
              }}
            >
              <Layers size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">New project</h2>
              <p className="text-xs text-slate-500">Set up your workspace board</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "0 24px" }} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          {/* Preview avatar + name input */}
          <div className="flex items-center gap-4">
            <div
              className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
              style={{
                background: `linear-gradient(135deg,${color.from},${color.to})`,
                boxShadow: `0 0 24px ${color.from}40`,
                transition: "all 0.3s ease",
              }}
            >
              {preview[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1.5 font-medium">
                Project name <span className="text-red-500">*</span>
              </label>
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Backend API, Mobile App…"
                maxLength={50}
                required
                className="w-full h-10 px-3 rounded-xl text-sm text-slate-100 placeholder-slate-700 outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = `${color.from}80`;
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${color.from}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What is this project about? (optional)"
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-700 outline-none resize-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = `${color.from}60`;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${color.from}15`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-xs text-slate-500 mb-2 font-medium">Color</label>
            <div className="flex gap-2">
              {COLORS.map((c, i) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setColorIdx(i)}
                  className="w-7 h-7 rounded-lg transition-all duration-200"
                  title={c.label}
                  style={{
                    background: `linear-gradient(135deg,${c.from},${c.to})`,
                    transform: colorIdx === i ? "scale(1.15)" : "scale(1)",
                    boxShadow: colorIdx === i ? `0 0 12px ${c.from}70` : "none",
                    outline: colorIdx === i ? `2px solid ${c.from}` : "none",
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p
              className="text-xs text-red-400 px-3 py-2 rounded-xl"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              {(error as any)?.response?.data?.detail ?? "Failed to create project"}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl text-sm text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isPending}
              className="flex-1 h-10 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg,${color.from},${color.to})`,
                boxShadow: name.trim() ? `0 0 24px ${color.from}40` : "none",
              }}
            >
              {isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
              ) : (
                <>Create project <ArrowRight size={15} /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
