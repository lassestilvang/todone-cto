import { create } from 'zustand';
import { db } from '@/lib/database';
import { startOfDay, subDays, format, isToday, isYesterday } from 'date-fns';

interface ProductivityStats {
  totalCompleted: number;
  karma: number;
  karmaLevel: string;
  currentStreak: number;
  longestStreak: number;
  dailyGoal: number;
  weeklyGoal: number;
  dailyStreak: number;
  weeklyStreak: number;
  todayCompleted: number;
  thisWeekCompleted: number;
  lastUpdated: Date;
}

interface ProductivitySettings {
  karmaEnabled: boolean;
  dailyGoal: number;
  weeklyGoal: number;
  daysOff: number[]; // 0-6 for Sunday-Saturday
  vacationMode: boolean;
  celebrateGoals: boolean;
}

interface ProductivityState {
  stats: ProductivityStats;
  settings: ProductivitySettings;
  isLoading: boolean;
  load: () => Promise<void>;
  updateStats: () => Promise<void>;
  updateSettings: (settings: Partial<ProductivitySettings>) => Promise<void>;
  calculateKarma: (completedCount: number, overdueTasks: number) => number;
  getKarmaLevel: (karma: number) => string;
  getCompletionHistory: (days: number) => Promise<{ date: string; count: number }[]>;
  calculateStreaks: (
    completedTasks: Array<{ completedAt?: Date }>,
  ) => { currentStreak: number; longestStreak: number };
}

const KARMA_LEVELS = [
  { name: 'Beginner', min: 0, max: 999 },
  { name: 'Novice', min: 1000, max: 2499 },
  { name: 'Intermediate', min: 2500, max: 4999 },
  { name: 'Advanced', min: 5000, max: 9999 },
  { name: 'Professional', min: 10000, max: 19999 },
  { name: 'Expert', min: 20000, max: 39999 },
  { name: 'Master', min: 40000, max: 79999 },
  { name: 'Grandmaster', min: 80000, max: 159999 },
  { name: 'Enlightened', min: 160000, max: Infinity },
];

const DEFAULT_STATS: ProductivityStats = {
  totalCompleted: 0,
  karma: 0,
  karmaLevel: 'Beginner',
  currentStreak: 0,
  longestStreak: 0,
  dailyGoal: 5,
  weeklyGoal: 25,
  dailyStreak: 0,
  weeklyStreak: 0,
  todayCompleted: 0,
  thisWeekCompleted: 0,
  lastUpdated: new Date(),
};

const DEFAULT_SETTINGS: ProductivitySettings = {
  karmaEnabled: true,
  dailyGoal: 5,
  weeklyGoal: 25,
  daysOff: [],
  vacationMode: false,
  celebrateGoals: true,
};

export const useProductivityStore = create<ProductivityState>((set, get) => ({
  stats: DEFAULT_STATS,
  settings: DEFAULT_SETTINGS,
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('todone-productivity-settings');
    if (savedSettings) {
      set({ settings: JSON.parse(savedSettings) });
    }

    // Load stats from localStorage
    const savedStats = localStorage.getItem('todone-productivity-stats');
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      stats.lastUpdated = new Date(stats.lastUpdated);
      set({ stats });
    }

    // Update stats based on current tasks
    await get().updateStats();
    
    set({ isLoading: false });
  },

  updateStats: async () => {
    const tasks = await db.tasks.toArray();
    const completedTasks = tasks.filter((task) => task.completed);
    
    // Total completed
    const totalCompleted = completedTasks.length;
    
    // Today's completed tasks
    const today = startOfDay(new Date());
    const todayCompleted = completedTasks.filter(
      (task) => task.completedAt && startOfDay(new Date(task.completedAt)).getTime() === today.getTime()
    ).length;

    // This week's completed tasks
    const weekStart = startOfDay(subDays(new Date(), 7));
    const thisWeekCompleted = completedTasks.filter(
      (task) => task.completedAt && new Date(task.completedAt) >= weekStart
    ).length;

    // Overdue tasks
    const now = new Date();
    const overdueTasks = tasks.filter(
      (task) => !task.completed && task.dueDate && new Date(task.dueDate) < now
    ).length;

    // Calculate karma
    const karma = get().calculateKarma(totalCompleted, overdueTasks);
    const karmaLevel = get().getKarmaLevel(karma);

    // Calculate streaks
    const { currentStreak, longestStreak } = get().calculateStreaks(completedTasks);

    const stats: ProductivityStats = {
      totalCompleted,
      karma,
      karmaLevel,
      currentStreak,
      longestStreak,
      dailyGoal: get().settings.dailyGoal,
      weeklyGoal: get().settings.weeklyGoal,
      dailyStreak: 0, // Simplified for now
      weeklyStreak: 0, // Simplified for now
      todayCompleted,
      thisWeekCompleted,
      lastUpdated: new Date(),
    };

    set({ stats });
    localStorage.setItem('todone-productivity-stats', JSON.stringify(stats));
  },

  updateSettings: async (updates) => {
    const newSettings = { ...get().settings, ...updates };
    set({ settings: newSettings });
    localStorage.setItem('todone-productivity-settings', JSON.stringify(newSettings));
    
    // Update stats to reflect new goals
    await get().updateStats();
  },

  calculateKarma: (completedToday, overdueTasks) => {
    const baseKarma = completedToday * 10;
    const overdueePenalty = overdueTasks * 2;
    return Math.max(0, baseKarma - overdueePenalty);
  },

  getKarmaLevel: (karma) => {
    const level = KARMA_LEVELS.find((level) => karma >= level.min && karma <= level.max);
    return level?.name ?? 'Beginner';
  },

  getCompletionHistory: async (days) => {
    const tasks = await db.tasks.toArray();
    const completedTasks = tasks.filter((task) => task.completed && task.completedAt);
    
    const history: { date: string; count: number }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = completedTasks.filter(
        (task) =>
          task.completedAt &&
          format(new Date(task.completedAt), 'yyyy-MM-dd') === dateStr
      ).length;
      
      history.push({ date: dateStr, count });
    }
    
    return history;
  },

  calculateStreaks: (completedTasks: Array<{ completedAt?: Date }>) => {
    // Group tasks by date
    const tasksByDate = new Map<string, number>();
    completedTasks.forEach((task) => {
      if (task.completedAt) {
        const dateStr = format(new Date(task.completedAt), 'yyyy-MM-dd');
        tasksByDate.set(dateStr, (tasksByDate.get(dateStr) || 0) + 1);
      }
    });

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = new Date();
    const dailyGoal = get().settings.dailyGoal;
    let streakBroken = false;

    while (!streakBroken) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const count = tasksByDate.get(dateStr) || 0;

      if (count >= dailyGoal || isToday(checkDate) || isYesterday(checkDate)) {
        if (count >= dailyGoal) {
          currentStreak++;
        }
        checkDate = subDays(checkDate, 1);
      } else {
        streakBroken = true;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    const sortedDates = Array.from(tasksByDate.keys()).sort();

    sortedDates.forEach((dateStr) => {
      const count = tasksByDate.get(dateStr) || 0;
      if (count >= dailyGoal) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    });

    return { currentStreak, longestStreak };
  },
}));
