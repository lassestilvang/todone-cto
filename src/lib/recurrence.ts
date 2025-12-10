import { format } from 'date-fns';
import type { RecurringPattern } from '@/types';

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDaySuffix = (day: number): string => {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const describeRecurringPattern = (pattern: RecurringPattern): string => {
  const { type, interval } = pattern;
  const plural = interval > 1 ? 's' : '';
  const endSuffix = pattern.endDate ? ` (ends ${format(pattern.endDate, 'MMM d, yyyy')})` : '';
  const exceptionSuffix = pattern.exceptions?.length
    ? `, skips ${pattern.exceptions.length} date${pattern.exceptions.length === 1 ? '' : 's'}`
    : '';

  switch (type) {
    case 'daily':
      return `${interval === 1 ? 'Daily' : `Every ${interval} day${plural}`}${endSuffix}${exceptionSuffix}`;
    case 'weekly': {
      const days = pattern.daysOfWeek?.length
        ? pattern.daysOfWeek.map((d) => WEEKDAY_SHORT[d]).join(', ')
        : undefined;
      const base = interval === 1 ? 'Weekly' : `Every ${interval} week${plural}`;
      return `${base}${days ? ` on ${days}` : ''}${endSuffix}${exceptionSuffix}`;
    }
    case 'monthly': {
      const day = pattern.dayOfMonth;
      const dayText = day ? ` on the ${day}${getDaySuffix(day)}` : '';
      const base = interval === 1 ? 'Monthly' : `Every ${interval} month${plural}`;
      return `${base}${dayText}${endSuffix}${exceptionSuffix}`;
    }
    case 'yearly':
      return `${interval === 1 ? 'Yearly' : `Every ${interval} year${plural}`}${endSuffix}${exceptionSuffix}`;
    case 'custom':
    default:
      return `Repeats${endSuffix}${exceptionSuffix}`;
  }
};
