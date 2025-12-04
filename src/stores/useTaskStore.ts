import { create } from 'zustand';
import { db } from '@/lib/database';
import type { Task } from '@/types';
import { generateId } from '@/lib/utils';
import { useProductivityStore } from './useProductivityStore';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  load: () => Promise<void>;
  addTask: (input: Pick<Task, 'content' | 'projectId' | 'sectionId' | 'dueDate' | 'priority'> & Partial<Task>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  uncompleteTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  getTasksByProject: (projectId: string) => Task[];
  getTasksBySection: (sectionId: string) => Task[];
  getTodayTasks: () => Task[];
  getOverdueTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    const tasks = await db.tasks.orderBy('order').toArray();
    set({ tasks, isLoading: false });
  },

  addTask: async (input) => {
    const existingTasks = get().tasks;
    const projectTasks = input.projectId
      ? existingTasks.filter((task) => task.projectId === input.projectId)
      : existingTasks.filter((task) => !task.projectId);

    const newTask: Task = {
      id: generateId(),
      content: input.content,
      projectId: input.projectId,
      sectionId: input.sectionId,
      priority: input.priority ?? null,
      labels: input.labels ?? [],
      dueDate: input.dueDate,
      dueTime: input.dueTime,
      duration: input.duration,
      recurringPattern: input.recurringPattern,
      assigneeId: input.assigneeId,
      parentTaskId: input.parentTaskId,
      description: input.description,
      order: projectTasks.length,
      completed: false,
      userId: existingTasks[0]?.userId ?? 'demo-user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.tasks.add(newTask);
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    return newTask;
  },

  updateTask: async (id, updates) => {
    await db.tasks.update(id, { ...updates, updatedAt: new Date() });
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task,
      ),
    }));
  },

  deleteTask: async (id) => {
    await db.tasks.delete(id);
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
  },

  completeTask: async (id) => {
    await db.tasks.update(id, { completed: true, completedAt: new Date(), updatedAt: new Date() });
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, completed: true, completedAt: new Date(), updatedAt: new Date() }
          : task,
      ),
    }));
    
    // Update productivity stats when task is completed
    useProductivityStore.getState().updateStats();
  },

  uncompleteTask: async (id) => {
    await db.tasks.update(id, { completed: false, completedAt: undefined, updatedAt: new Date() });
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, completed: false, completedAt: undefined, updatedAt: new Date() }
          : task,
      ),
    }));

    useProductivityStore.getState().updateStats();
  },

  getTaskById: (id) => {
    return get().tasks.find((task) => task.id === id);
  },

  getTasksByProject: (projectId) => {
    return get().tasks.filter((task) => task.projectId === projectId && !task.parentTaskId);
  },

  getTasksBySection: (sectionId) => {
    return get().tasks.filter((task) => task.sectionId === sectionId && !task.parentTaskId);
  },

  getTodayTasks: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return get().tasks.filter((task) => {
      if (task.completed) return false;
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);
      return due.getTime() === today.getTime();
    });
  },

  getOverdueTasks: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return get().tasks.filter((task) => {
      if (task.completed) return false;
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);
      return due < today;
    });
  },
}));
