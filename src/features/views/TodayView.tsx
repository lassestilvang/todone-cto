import { addDays, format } from 'date-fns';
import { Flame, AlertCircle } from 'lucide-react';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskComposer } from '@/components/tasks/TaskComposer';
import { useTaskStore } from '@/stores/useTaskStore';
import { Card } from '@/components/ui/Card';

export const TodayView: React.FC = () => {
  const { getTodayTasks, getOverdueTasks } = useTaskStore();
  const todayTasks = getTodayTasks();
  const overdueTasks = getOverdueTasks();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Flame className="h-6 w-6 text-brand-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Today</h1>
          <p className="text-sm text-white/60">{format(new Date(), 'EEEE, MMM d')}</p>
        </div>
        <span className="ml-auto rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-white/60">
          {todayTasks.length} tasks
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-white/60">Due today</p>
          <p className="text-3xl font-bold text-white">{todayTasks.length}</p>
          <p className="text-xs text-white/40">Focus on the essentials</p>
        </Card>
        <Card>
          <p className="text-sm text-white/60">Overdue</p>
          <p className="text-3xl font-bold text-red-400">{overdueTasks.length}</p>
          <p className="text-xs text-white/40">Bring them back on track</p>
        </Card>
        <Card>
          <p className="text-sm text-white/60">Tomorrow</p>
          <p className="text-3xl font-bold text-white">{
            todayTasks.filter((task) => {
              if (!task.dueDate) return false;
              return format(new Date(task.dueDate), 'yyyy-MM-dd') ===
                format(addDays(new Date(), 1), 'yyyy-MM-dd');
            }).length
          }</p>
          <p className="text-xs text-white/40">Prepare for what's next</p>
        </Card>
      </div>

      <TaskComposer placeholder="Plan your day..." />

      {overdueTasks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/60">
            <AlertCircle className="h-4 w-4 text-red-400" />
            Overdue
          </div>
          <TaskList tasks={overdueTasks} emptyMessage="No overdue tasks" enableDragDrop />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/60">
          <Flame className="h-4 w-4 text-brand-400" />
          Today
        </div>
        <TaskList tasks={todayTasks} emptyMessage="No tasks scheduled for today." enableDragDrop />
      </div>
    </div>
  );
};
