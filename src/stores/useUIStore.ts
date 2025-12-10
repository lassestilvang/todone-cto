import { create } from 'zustand';

export type ActiveView =
  | 'inbox'
  | 'today'
  | 'upcoming'
  | 'project'
  | 'filters'
  | 'labels'
  | 'productivity'
  | 'settings';

interface UIState {
  activeView: ActiveView;
  isSidebarOpen: boolean;
  isQuickAddOpen: boolean;
  isCommandPaletteOpen: boolean;
  selectedProjectId: string | null;
  selectedTaskId: string | null;
  isTaskDetailOpen: boolean;
  toggleSidebar: () => void;
  openQuickAdd: () => void;
  closeQuickAdd: () => void;
  setActiveView: (view: ActiveView) => void;
  setSelectedProjectId: (id: string | null) => void;
  openTaskDetail: (taskId: string) => void;
  closeTaskDetail: () => void;
  toggleCommandPalette: () => void;
  closeCommandPalette: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeView: 'today',
  isSidebarOpen: true,
  isQuickAddOpen: false,
  isCommandPaletteOpen: false,
  selectedProjectId: null,
  selectedTaskId: null,
  isTaskDetailOpen: false,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  openQuickAdd: () => set({ isQuickAddOpen: true }),
  closeQuickAdd: () => set({ isQuickAddOpen: false }),

  setActiveView: (view) => set({ activeView: view }),
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),

  openTaskDetail: (taskId) => set({ selectedTaskId: taskId, isTaskDetailOpen: true }),
  closeTaskDetail: () => set({ selectedTaskId: null, isTaskDetailOpen: false }),

  toggleCommandPalette: () =>
    set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
}));
