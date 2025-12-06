import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

interface CalendarViewProps {
  tasks: Task[];
  onDayClick?: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTasksForDay = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button variant="ghost" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="secondary" size="sm" onClick={handleToday}>
          Today
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-8 border border-white/10 bg-slate-900/40 p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-white/60 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isDayToday = isToday(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => onDayClick?.(day)}
                className={cn(
                  'min-h-[80px] rounded-6 border p-2 text-left transition',
                  'hover:border-white/20 hover:bg-white/5',
                  isCurrentMonth ? 'border-white/10' : 'border-white/5 opacity-40',
                  isDayToday && 'border-brand-500 bg-brand-500/10'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isDayToday ? 'text-brand-400' : 'text-white',
                      !isCurrentMonth && 'text-white/40'
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-xs text-white/60">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        'rounded-4 px-1.5 py-0.5 text-xs truncate',
                        task.priority === 'p1' && 'bg-red-500/20 text-red-200',
                        task.priority === 'p2' && 'bg-orange-500/20 text-orange-200',
                        task.priority === 'p3' && 'bg-blue-500/20 text-blue-200',
                        !task.priority && 'bg-white/10 text-white/80'
                      )}
                    >
                      {task.content}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-white/40 px-1.5">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
