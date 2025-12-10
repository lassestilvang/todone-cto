import { startOfDay } from 'date-fns';
import type { Task } from '@/types';

export interface FilterQuery {
  search?: string;
  priority?: string[];
  labels?: string[];
  projects?: string[];
  dates?: {
    today?: boolean;
    overdue?: boolean;
    noDate?: boolean;
    before?: Date;
    after?: Date;
    next?: number;
  };
  completed?: boolean;
  recurring?: boolean;
  hasSubtasks?: boolean;
}

export const parseFilterQuery = (query: string): FilterQuery => {
  const result: FilterQuery = {};
  const tokens = query.split(/\s+/);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].toLowerCase();

    if (token.startsWith('search:')) {
      result.search = tokens[i].substring(7);
    } else if (token === 'today') {
      result.dates = { ...result.dates, today: true };
    } else if (token === 'overdue') {
      result.dates = { ...result.dates, overdue: true };
    } else if (token === 'no' && tokens[i + 1]?.toLowerCase() === 'date') {
      result.dates = { ...result.dates, noDate: true };
      i++;
    } else if (token.startsWith('p') && ['p1', 'p2', 'p3', 'p4'].includes(token)) {
      result.priority = result.priority || [];
      result.priority.push(token);
    } else if (token.startsWith('@')) {
      result.labels = result.labels || [];
      result.labels.push(token.substring(1));
    } else if (token.startsWith('#')) {
      result.projects = result.projects || [];
      result.projects.push(token.substring(1));
    } else if (token === 'recurring') {
      result.recurring = true;
    } else if (token === 'subtask') {
      result.hasSubtasks = true;
    } else if (token === '!subtask') {
      result.hasSubtasks = false;
    }
  }

  return result;
};

export const applyFilterQuery = (tasks: Task[], query: FilterQuery): Task[] => {
  let filtered = [...tasks];

  if (query.search) {
    const search = query.search.toLowerCase();
    filtered = filtered.filter((task) => task.content.toLowerCase().includes(search));
  }

  if (query.priority && query.priority.length > 0) {
    filtered = filtered.filter((task) => task.priority && query.priority!.includes(task.priority));
  }

  if (query.labels && query.labels.length > 0) {
    filtered = filtered.filter((task) =>
      query.labels!.some((label) =>
        task.labels.some((taskLabel) => taskLabel.toLowerCase() === label.toLowerCase()),
      ),
    );
  }

  if (query.dates) {
    if (query.dates.today) {
      const today = startOfDay(new Date());
      filtered = filtered.filter((task) => {
        if (!task.dueDate) return false;
        const due = startOfDay(new Date(task.dueDate));
        return due.getTime() === today.getTime();
      });
    }

    if (query.dates.overdue) {
      const today = startOfDay(new Date());
      filtered = filtered.filter((task) => {
        if (!task.dueDate) return false;
        const due = startOfDay(new Date(task.dueDate));
        return due < today && !task.completed;
      });
    }

    if (query.dates.noDate) {
      filtered = filtered.filter((task) => !task.dueDate);
    }
  }

  if (query.recurring !== undefined) {
    filtered = filtered.filter((task) => (query.recurring ? !!task.recurringPattern : !task.recurringPattern));
  }

  if (query.hasSubtasks !== undefined) {
    filtered = filtered.filter((task) => (query.hasSubtasks ? !!task.parentTaskId : !task.parentTaskId));
  }

  if (query.completed !== undefined) {
    filtered = filtered.filter((task) => task.completed === query.completed);
  }

  return filtered;
};

export const executeFilterQuery = (tasks: Task[], queryString: string): Task[] => {
  const query = parseFilterQuery(queryString);
  return applyFilterQuery(tasks, query);
};
