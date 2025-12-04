import { addDays, nextMonday, parse } from 'date-fns';
import type { Priority } from '@/types';

interface QuickTaskParseOptions {
  fallbackProjectId?: string;
}

interface QuickTaskParseResult {
  content: string;
  description?: string;
  projectName?: string;
  labels: string[];
  priority: Priority;
  dueDate?: Date;
  duration?: number;
}

const PRIORITY_MAP: Record<string, Priority> = {
  p1: 'p1',
  '!!!': 'p1',
  p2: 'p2',
  '!!': 'p2',
  p3: 'p3',
  '!': 'p3',
  p4: 'p4',
};

const DATE_KEYWORDS: Record<string, () => Date> = {
  today: () => new Date(),
  tomorrow: () => addDays(new Date(), 1),
  'next week': () => addDays(new Date(), 7),
  monday: () => nextMonday(new Date()),
};

export const parseQuickTaskInput = (
  input: string,
  options: QuickTaskParseOptions = {},
): QuickTaskParseResult => {
  const tokens = input.split(/\s+/);
  let contentTokens: string[] = [];
  const labels: string[] = [];
  let priority: Priority = null;
  let dueDate: Date | undefined;
  let duration: number | undefined;
  let projectName: string | undefined;

  tokens.forEach((token) => {
    const normalized = token.toLowerCase();

    if (normalized.startsWith('#')) {
      projectName = normalized.replace('#', '');
      return;
    }

    if (normalized.startsWith('@')) {
      labels.push(normalized.replace('@', ''));
      return;
    }

    if (PRIORITY_MAP[normalized]) {
      priority = PRIORITY_MAP[normalized];
      return;
    }

    if (normalized.startsWith('for')) {
      const value = parseInt(normalized.replace(/[^0-9]/g, ''), 10);
      if (!Number.isNaN(value)) {
        duration = value;
        return;
      }
    }

    if (DATE_KEYWORDS[normalized]) {
      dueDate = DATE_KEYWORDS[normalized]();
      return;
    }

    // Attempt to parse natural language date like Jan 15
    const parsed = parse(token, 'MMM d', new Date());
    if (!Number.isNaN(parsed.getTime())) {
      dueDate = parsed;
      return;
    }

    contentTokens.push(token);
  });

  return {
    content: contentTokens.join(' ').trim() || input,
    labels,
    priority,
    dueDate,
    duration,
    projectName,
  };
};
