import '@testing-library/jest-dom';

// Import vi globally for vitest
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock crypto for bcryptjs
Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr: unknown[]) => arr,
  },
});

// Mock Dexie (IndexedDB) for tests
const mockDexie = {
  tasks: {
    toArray: vi.fn().mockResolvedValue([]),
    put: vi.fn().mockResolvedValue(1),
    delete: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  },
  projects: {
    toArray: vi.fn().mockResolvedValue([]),
    put: vi.fn().mockResolvedValue(1),
    delete: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  },
  sections: {
    toArray: vi.fn().mockResolvedValue([]),
    put: vi.fn().mockResolvedValue(1),
    delete: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  },
  labels: {
    toArray: vi.fn().mockResolvedValue([]),
    put: vi.fn().mockResolvedValue(1),
    delete: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  },
  filters: {
    toArray: vi.fn().mockResolvedValue([]),
    put: vi.fn().mockResolvedValue(1),
    delete: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  },
  comments: {
    toArray: vi.fn().mockResolvedValue([]),
    put: vi.fn().mockResolvedValue(1),
    delete: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  },
  users: {
    toArray: vi.fn().mockResolvedValue([]),
    put: vi.fn().mockResolvedValue(1),
    delete: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  },
  templates: {
    toArray: vi.fn().mockResolvedValue([]),
    put: vi.fn().mockResolvedValue(1),
    delete: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  },
  open: vi.fn().mockResolvedValue(undefined),
};

vi.mock('dexie', () => ({
  default: vi.fn().mockImplementation(() => mockDexie),
}));

// Mock Zustand stores to avoid real state management in tests
vi.mock('@/stores/useTaskStore', () => ({
  useTaskStore: vi.fn(() => ({
    tasks: [],
    getTasksByProject: vi.fn().mockReturnValue([]),
    addTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    toggleTaskComplete: vi.fn(),
    getTaskById: vi.fn(),
  })),
}));

vi.mock('@/stores/useProjectStore', () => ({
  useProjectStore: vi.fn(() => ({
    projects: [],
    sections: [],
    addProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
    getProjectById: vi.fn(),
    getSectionsByProject: vi.fn().mockReturnValue([]),
  })),
}));

vi.mock('@/stores/useUIStore', () => ({
  useUIStore: vi.fn(() => ({
    activeView: 'today',
    isSidebarOpen: true,
    isQuickAddOpen: false,
    isCommandPaletteOpen: false,
    selectedProjectId: null,
    selectedTaskId: null,
    isTaskDetailOpen: false,
    toggleSidebar: vi.fn(),
    openQuickAdd: vi.fn(),
    closeQuickAdd: vi.fn(),
    setActiveView: vi.fn(),
    setSelectedProjectId: vi.fn(),
    openTaskDetail: vi.fn(),
    closeTaskDetail: vi.fn(),
    toggleCommandPalette: vi.fn(),
    closeCommandPalette: vi.fn(),
  })),
}));

vi.mock('@/stores/useSettingsStore', () => ({
  useSettingsStore: vi.fn(() => ({
    appearance: {
      theme: 'dark',
      accentColor: '#10b981',
      compactMode: false,
      showCompletedTasks: true,
    },
    notifications: {
      emailNotifications: {
        taskReminders: true,
        commentsAndMentions: true,
        taskAssignments: true,
        dailySummary: false,
        overdueTasks: true,
        goalAchievements: true,
      },
      pushNotificationsEnabled: false,
    },
    general: {
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      startOfWeek: 'sunday',
      defaultView: 'today',
      autoAddTime: false,
      showWeekends: true,
    },
    updateAppearance: vi.fn(),
    updateNotifications: vi.fn(),
    updateGeneralSettings: vi.fn(),
    resetToDefaults: vi.fn(),
    loadFromStorage: vi.fn(),
  })),
}));

vi.mock('@/stores/useTemplateStore', () => ({
  useTemplateStore: vi.fn(() => ({
    templates: [],
    getTemplateById: vi.fn(),
    getTemplatesByCategory: vi.fn().mockReturnValue([]),
    getCategories: vi.fn().mockReturnValue([]),
    addCustomTemplate: vi.fn(),
  })),
}));

// Simple date-fns mock
vi.mock('date-fns', () => ({
  format: vi.fn((date: Date, formatStr: string) => {
    if (formatStr === 'yyyy-MM-dd') {
      return date.toISOString().split('T')[0];
    }
    if (formatStr === 'MMM d, yyyy') {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
    return date.toISOString();
  }),
  isToday: vi.fn(() => false),
  isTomorrow: vi.fn(() => false),
  addDays: vi.fn((date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }),
  startOfWeek: vi.fn((date: Date) => new Date(date)),
  endOfWeek: vi.fn((date: Date) => new Date(date)),
  startOfMonth: vi.fn((date: Date) => new Date(date)),
  endOfMonth: vi.fn((date: Date) => new Date(date)),
  getDay: vi.fn((date: Date) => date.getDay()),
  getDate: vi.fn((date: Date) => date.getDate()),
  getMonth: vi.fn((date: Date) => date.getMonth()),
  getYear: vi.fn((date: Date) => date.getFullYear()),
}));