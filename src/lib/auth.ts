import bcrypt from 'bcryptjs';
import { db } from './database';
import type { User } from '@/types';

const TOKEN_KEY = 'todone_auth_token';
const USER_KEY = 'todone_current_user';

export interface AuthToken {
  token: string;
  userId: string;
  expiresAt: number;
}

const BCRYPT_ROUNDS = 10;

const hashPassword = (password: string): Promise<string> => bcrypt.hash(password, BCRYPT_ROUNDS);

const verifyPassword = (password: string, hash: string): Promise<boolean> => bcrypt.compare(password, hash);

export const generateToken = (userId: string): AuthToken => {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const token = btoa(JSON.stringify({ userId, timestamp: Date.now() }));
  return { token, userId, expiresAt };
};

export const saveAuthToken = (authToken: AuthToken): void => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(authToken));
};

export const getAuthToken = (): AuthToken | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const authToken = JSON.parse(token) as AuthToken;
    if (authToken.expiresAt < Date.now()) {
      clearAuthToken();
      return null;
    }
    return authToken;
  } catch {
    return null;
  }
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const saveCurrentUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;

  try {
    return JSON.parse(user) as User;
  } catch {
    return null;
  }
};

export const register = async (
  email: string,
  password: string,
  name: string,
): Promise<User> => {
  const existingUser = await db.users.where('email').equals(email).first();
  if (existingUser) {
    throw new Error('User already exists');
  }

  const passwordHash = await hashPassword(password);

  const user: User = {
    id: crypto.randomUUID(),
    email,
    name,
    passwordHash,
    settings: {
      theme: 'system',
      language: 'en',
      startOfWeek: 'monday',
      dateFormat: 'MMM dd, yyyy',
      timeFormat: '24h',
      defaultView: 'today',
      notificationPreferences: {
        taskReminders: true,
        commentsMentions: true,
        taskAssignments: true,
        dailySummary: false,
        overdueTasks: true,
        goalAchievements: true,
      },
    },
    preferences: {
      autoAddTime: false,
      showWeekends: true,
      enableKarma: true,
      dailyGoal: 5,
      weeklyGoal: 25,
      daysOff: [0, 6],
      vacationMode: false,
      goalCelebration: true,
    },
    karmaStats: {
      totalKarma: 0,
      level: 'Beginner',
      currentStreak: 0,
      longestStreak: 0,
      weeklyStreak: 0,
      totalCompleted: 0,
      karmaHistory: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.users.add(user);

  const authToken = generateToken(user.id);
  saveAuthToken(authToken);
  saveCurrentUser(user);

  return user;
};

export const login = async (email: string, password: string): Promise<User> => {
  const user = await db.users.where('email').equals(email).first();
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (user.passwordHash) {
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }
  }

  const authToken = generateToken(user.id);
  saveAuthToken(authToken);
  saveCurrentUser(user);

  return user;
};

export const logout = (): void => {
  clearAuthToken();
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return token !== null;
};
