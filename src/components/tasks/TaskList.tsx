import { TaskItem } from './TaskItem';
import type { Task } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';

interface TaskListProps {
  tasks: Task[];
  emptyMessage?: string;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, emptyMessage }) => {
  if (tasks.length === 0) {
    return <EmptyState title="No tasks yet" description={emptyMessage ?? 'Add a new task to get started.'} />;
  }

  return (
    <div className="space-y-1">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};
