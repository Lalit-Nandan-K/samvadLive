import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("themeIs") || "night",
  setTheme: (theme) => {
    localStorage.setItem("themeIs", theme);
    set({ theme });
  },
}));
