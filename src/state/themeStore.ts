import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light";

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggle: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "opsverse-theme" }
  )
);

// Legacy hook alias used by Settings.tsx
export const useTheme = () => {
  const { theme, setTheme } = useThemeStore();
  return { theme, setTheme };
};
