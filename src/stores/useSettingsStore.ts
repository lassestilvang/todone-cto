import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
export type TimeFormat = '12h' | '24h';
export type StartOfWeek = 'sunday' | 'monday';
export type DefaultView = 'inbox' | 'today' | 'upcoming';
export type Language =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'ru'
  | 'ja'
  | 'zh';

export interface AppearanceSettings {
  theme: Theme;
  accentColor: string;
  compactMode: boolean;
  showCompletedTasks: boolean;
}

export interface NotificationSettings {
  emailNotifications: {
    taskReminders: boolean;
    commentsAndMentions: boolean;
    taskAssignments: boolean;
    dailySummary: boolean;
    overdueTasks: boolean;
    goalAchievements: boolean;
  };
  pushNotificationsEnabled: boolean;
}

export interface GeneralSettings {
  language: Language;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  startOfWeek: StartOfWeek;
  defaultView: DefaultView;
  autoAddTime: boolean;
  showWeekends: boolean;
}

export interface Settings {
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  general: GeneralSettings;
}

interface SettingsState extends Settings {
  updateAppearance: (settings: Partial<AppearanceSettings>) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  updateGeneralSettings: (settings: Partial<GeneralSettings>) => void;
  resetToDefaults: () => void;
  loadFromStorage: () => void;
}

const DEFAULT_SETTINGS: Settings = {
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
};

const STORAGE_KEY = 'todone-settings';

const saveToStorage = (settings: Settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
};

const loadFromStorageHelper = (): Settings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all fields exist
      return {
        appearance: { ...DEFAULT_SETTINGS.appearance, ...parsed.appearance },
        notifications: {
          emailNotifications: {
            ...DEFAULT_SETTINGS.notifications.emailNotifications,
            ...parsed.notifications?.emailNotifications,
          },
          pushNotificationsEnabled:
            parsed.notifications?.pushNotificationsEnabled ??
            DEFAULT_SETTINGS.notifications.pushNotificationsEnabled,
        },
        general: { ...DEFAULT_SETTINGS.general, ...parsed.general },
      };
    }
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error);
  }
  return DEFAULT_SETTINGS;
};

// Apply theme to document
const applyTheme = (theme: Theme) => {
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  } else {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
};

// Apply accent color to CSS variables
const applyAccentColor = (color: string) => {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Update CSS variables
  const root = document.documentElement;
  root.style.setProperty('--brand-rgb', `${r}, ${g}, ${b}`);
  root.style.setProperty('--brand-500', color);
};

export const useSettingsStore = create<SettingsState>((set, get) => {
  const initialSettings = loadFromStorageHelper();

  // Apply initial theme and accent color
  applyTheme(initialSettings.appearance.theme);
  applyAccentColor(initialSettings.appearance.accentColor);

  return {
    ...initialSettings,

    updateAppearance: (updates) => {
      const currentAppearance = get().appearance;
      const newAppearance = { ...currentAppearance, ...updates };

      // Apply theme if changed
      if (updates.theme !== undefined) {
        applyTheme(updates.theme);
      }

      // Apply accent color if changed
      if (updates.accentColor !== undefined) {
        applyAccentColor(updates.accentColor);
      }

      const newSettings: Settings = {
        appearance: newAppearance,
        notifications: get().notifications,
        general: get().general,
      };

      set({ appearance: newAppearance });
      saveToStorage(newSettings);
    },

    updateNotifications: (updates) => {
      const currentNotifications = get().notifications;
      const newNotifications = {
        ...currentNotifications,
        ...updates,
        emailNotifications: {
          ...currentNotifications.emailNotifications,
          ...(updates.emailNotifications || {}),
        },
      };

      const newSettings: Settings = {
        appearance: get().appearance,
        notifications: newNotifications,
        general: get().general,
      };

      set({ notifications: newNotifications });
      saveToStorage(newSettings);
    },

    updateGeneralSettings: (updates) => {
      const currentGeneral = get().general;
      const newGeneral = { ...currentGeneral, ...updates };

      const newSettings: Settings = {
        appearance: get().appearance,
        notifications: get().notifications,
        general: newGeneral,
      };

      set({ general: newGeneral });
      saveToStorage(newSettings);
    },

    resetToDefaults: () => {
      set(DEFAULT_SETTINGS);
      saveToStorage(DEFAULT_SETTINGS);
      applyTheme(DEFAULT_SETTINGS.appearance.theme);
      applyAccentColor(DEFAULT_SETTINGS.appearance.accentColor);
    },

    loadFromStorage: () => {
      const loaded = loadFromStorageHelper();
      set(loaded);
      applyTheme(loaded.appearance.theme);
      applyAccentColor(loaded.appearance.accentColor);
    },
  };
});
