import { TaskList } from '@/components/tasks/TaskList';
import { TaskComposer } from '@/components/tasks/TaskComposer';
import { useTaskStore } from '@/stores/useTaskStore';
import { Inbox } from 'lucide-react';

export const InboxView: React.FC = () => {
  const { tasks } = useTaskStore();
  const inboxTasks = tasks.filter((task) => !task.projectId && !task.completed);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Inbox className="h-6 w-6 text-brand-400" />
        <h1 className="text-2xl font-bold text-white">Inbox</h1>
        <span className="text-sm text-white/50">{inboxTasks.length} tasks</span>
      </div>

      <TaskComposer placeholder="Add a task to Inbox..." />

      <div className="mt-6">
        <TaskList
          tasks={inboxTasks}
          emptyMessage="Your inbox is clear. Add a new task or enjoy the clarity!"
          enableDragDrop
        />
      </div>
    </div>
  );
};
