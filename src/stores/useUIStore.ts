import { create } from 'zustand';

export type ActiveView = 'inbox' | 'today' | 'upcoming' | 'project' | 'filters' | 'labels';

interface UIState {
  activeView: ActiveView;
  isSidebarOpen: boolean;
  isQuickAddOpen: boolean;
  isCommandPaletteOpen: boolean;
  selectedProjectId: string | null;
  toggleSidebar: () => void;
  openQuickAdd: () => void;
  closeQuickAdd: () => void;
  setActiveView: (view: ActiveView) => void;
  setSelectedProjectId: (id: string | null) => void;
  toggleCommandPalette: () => void;
  closeCommandPalette: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeView: 'today',
  isSidebarOpen: true,
  isQuickAddOpen: false,
  isCommandPaletteOpen: false,
  selectedProjectId: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  openQuickAdd: () => set({ isQuickAddOpen: true }),
  closeQuickAdd: () => set({ isQuickAddOpen: false }),

  setActiveView: (view) => set({ activeView: view }),
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),

  toggleCommandPalette: () =>
    set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
}));
