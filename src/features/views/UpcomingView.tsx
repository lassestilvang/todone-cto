import { addDays, format, startOfWeek, endOfWeek } from 'date-fns';
import { Calendar, ChevronRight } from 'lucide-react';
import { TaskList } from '@/components/tasks/TaskList';
import { useTaskStore } from '@/stores/useTaskStore';

export const UpcomingView: React.FC = () => {
  const { tasks } = useTaskStore();

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getTasksForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return tasks.filter((task) => {
      if (!task.dueDate || task.completed) return false;
      return format(new Date(task.dueDate), 'yyyy-MM-dd') === dayStr;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-brand-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Upcoming</h1>
          <p className="text-sm text-white/60">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {days.map((day) => {
          const dayTasks = getTasksForDay(day);
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

          return (
            <div key={day.toISOString()} className="space-y-3">
              <div className="flex items-center gap-2">
                <h2
                  className={`text-lg font-semibold ${isToday ? 'text-brand-400' : 'text-white/80'}`}
                >
                  {format(day, 'EEEE')}
                </h2>
                <span className="text-sm text-white/50">{format(day, 'MMM d')}</span>
                {isToday && (
                  <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs font-semibold uppercase text-white">
                    Today
                  </span>
                )}
                <span className="text-sm text-white/40">{dayTasks.length} tasks</span>
                <ChevronRight className="ml-auto h-5 w-5 text-white/40" />
              </div>

              {dayTasks.length > 0 ? (
                <TaskList tasks={dayTasks} enableDragDrop />
              ) : (
                <p className="py-4 text-center text-sm text-white/40">No tasks scheduled</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
