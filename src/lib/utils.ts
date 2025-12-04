import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatDate(date: Date | undefined, format: string = 'MMM dd, yyyy'): string {
  if (!date) return '';
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = new Date(date);
  
  return format
    .replace('MMM', months[d.getMonth()])
    .replace('dd', d.getDate().toString().padStart(2, '0'))
    .replace('yyyy', d.getFullYear().toString());
}

export function getRelativeDate(date: Date): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return target.toLocaleDateString('en-US', { weekday: 'long' });
  
  return formatDate(target);
}

export function isOverdue(dueDate: Date | undefined): boolean {
  if (!dueDate) return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < now;
}

export function isDueToday(dueDate: Date | undefined): boolean {
  if (!dueDate) return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due.getTime() === now.getTime();
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function getPriorityColor(priority: string | null): string {
  switch (priority) {
    case 'p1':
      return 'text-priority-p1';
    case 'p2':
      return 'text-priority-p2';
    case 'p3':
      return 'text-priority-p3';
    default:
      return 'text-priority-p4';
  }
}

export function getPriorityLabel(priority: string | null): string {
  switch (priority) {
    case 'p1':
      return 'Priority 1';
    case 'p2':
      return 'Priority 2';
    case 'p3':
      return 'Priority 3';
    case 'p4':
      return 'Priority 4';
    default:
      return 'No priority';
  }
}
