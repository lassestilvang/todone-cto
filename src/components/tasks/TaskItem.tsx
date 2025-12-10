import { Calendar, Flag, MoreHorizontal, GripVertical } from 'lucide-react';
import type { Task } from '@/types';
import { Checkbox } from '@/components/ui/Checkbox';
import { cn, formatDate, getPriorityColor, isOverdue } from '@/lib/utils';
import { useTaskStore } from '@/stores/useTaskStore';
import { useUIStore } from '@/stores/useUIStore';

interface TaskItemProps {
  task: Task;
  onClick?: () => void;
  draggable?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onClick, draggable = false }) => {
  const { completeTask, uncompleteTask } = useTaskStore();
  const { openTaskDetail } = useUIStore();

  const handleCheck = () => {
    if (task.completed) {
      uncompleteTask(task.id);
    } else {
      completeTask(task.id);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleCheck();
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      openTaskDetail(task.id);
    }
  };

  const overdue = isOverdue(task.dueDate);

  return (
    <div
      className={cn(
        'group flex items-start gap-3 rounded-6 border border-transparent px-3 py-2.5 transition hover:border-white/10 hover:bg-white/5 cursor-pointer',
        task.completed && 'opacity-50',
      )}
      onClick={handleClick}
    >
      {draggable && (
        <button className="mt-0.5 opacity-0 transition group-hover:opacity-100">
          <GripVertical className="h-4 w-4 text-white/40" />
        </button>
      )}

      <div onClick={handleCheckboxClick} className="cursor-pointer pt-0.5">
        <Checkbox checked={task.completed} onChange={handleCheck} />
      </div>

      <div className="flex-1 space-y-1">
        <p className={cn('text-sm text-white', task.completed && 'line-through')}>
          {task.content}
        </p>

        <div className="flex items-center gap-3 text-xs text-white/60">
          {task.dueDate && (
            <div
              className={cn(
                'flex items-center gap-1',
                overdue && !task.completed && 'text-red-400',
              )}
            >
              <Calendar className="h-3 w-3" />
              <span>{formatDate(new Date(task.dueDate))}</span>
            </div>
          )}

          {task.priority && (
            <div className={cn('flex items-center gap-1', getPriorityColor(task.priority))}>
              <Flag className="h-3 w-3" />
              <span className="uppercase">{task.priority}</span>
            </div>
          )}
        </div>
      </div>

      <button className="opacity-0 transition group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
        <MoreHorizontal className="h-4 w-4 text-white/60 hover:text-white" />
      </button>
    </div>
  );
};
