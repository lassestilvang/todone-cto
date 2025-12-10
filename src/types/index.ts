export type Priority = 'p1' | 'p2' | 'p3' | 'p4' | null;

export type ViewType = 'list' | 'board' | 'calendar';

export type RecurringPattern = {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  endDate?: Date;
  exceptions?: Date[];
};

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  passwordHash?: string;
  settings: UserSettings;
  preferences: UserPreferences;
  karmaStats: KarmaStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  startOfWeek: 'sunday' | 'monday';
  dateFormat: string;
  timeFormat: '12h' | '24h';
  defaultView: string;
  notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences {
  taskReminders: boolean;
  commentsMentions: boolean;
  taskAssignments: boolean;
  dailySummary: boolean;
  overdueTasks: boolean;
  goalAchievements: boolean;
}

export interface UserPreferences {
  defaultProject?: string;
  defaultPriority?: Priority;
  autoAddTime: boolean;
  showWeekends: boolean;
  enableKarma: boolean;
  dailyGoal: number;
  weeklyGoal: number;
  daysOff: number[];
  vacationMode: boolean;
  goalCelebration: boolean;
}

export interface KarmaStats {
  totalKarma: number;
  level: string;
  currentStreak: number;
  longestStreak: number;
  weeklyStreak: number;
  totalCompleted: number;
  karmaHistory: KarmaHistoryEntry[];
}

export interface KarmaHistoryEntry {
  date: Date;
  karma: number;
  tasksCompleted: number;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  viewType: ViewType;
  favorite: boolean;
  shared: boolean;
  parentProjectId?: string;
  order: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Section {
  id: string;
  name: string;
  projectId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  content: string;
  description?: string;
  projectId?: string;
  sectionId?: string;
  priority: Priority;
  labels: string[];
  dueDate?: Date;
  dueTime?: string;
  duration?: number;
  recurringPattern?: RecurringPattern;
  assigneeId?: string;
  parentTaskId?: string;
  order: number;
  completed: boolean;
  completedAt?: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  personal: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Filter {
  id: string;
  name: string;
  query: string;
  color: string;
  favorite: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  fileName: string;
  url: string;
  type: string;
  size: number;
  createdAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  structure: TemplateStructure;
  isCustom: boolean;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateStructure {
  projectName: string;
  projectColor: string;
  sections: TemplateSectionData[];
  tasks: TemplateTaskData[];
}

export interface TemplateSectionData {
  name: string;
  order: number;
}

export interface TemplateTaskData {
  content: string;
  description?: string;
  sectionIndex?: number;
  priority?: Priority;
  labels?: string[];
  order: number;
}

export interface ActivityLogEntry {
  id: string;
  userId: string;
  action: string;
  entityType: 'task' | 'project' | 'section' | 'label' | 'filter';
  entityId: string;
  changes: Record<string, unknown>;
  createdAt: Date;
}

export interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  entityType: string;
  entityId: string;
  data: Record<string, unknown>;
  timestamp: Date;
  synced: boolean;
}

export const PROJECT_COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#64748b',
  '#71717a',
  '#737373',
] as const;

export const KARMA_LEVELS = [
  { name: 'Beginner', min: 0, max: 999 },
  { name: 'Novice', min: 1000, max: 2499 },
  { name: 'Intermediate', min: 2500, max: 4999 },
  { name: 'Advanced', min: 5000, max: 9999 },
  { name: 'Professional', min: 10000, max: 19999 },
  { name: 'Expert', min: 20000, max: 39999 },
  { name: 'Master', min: 40000, max: 79999 },
  { name: 'Grandmaster', min: 80000, max: 159999 },
  { name: 'Enlightened', min: 160000, max: Infinity },
] as const;
