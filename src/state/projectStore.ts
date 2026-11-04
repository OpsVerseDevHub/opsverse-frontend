import { create } from "zustand";

interface ProjectState {
  activeProjectId: number | null;
  setActiveProject: (id: number) => void;
  clearActiveProject: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  activeProjectId: null,
  setActiveProject: (id) => set({ activeProjectId: id }),
  clearActiveProject: () => set({ activeProjectId: null }),
}));
