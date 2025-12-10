import { useState } from 'react';
import { ChevronRight, ChevronDown, Calendar, Flag, MoreHorizontal, Repeat } from 'lucide-react';
import type { Task } from '@/types';
import { Checkbox } from '@/components/ui/Checkbox';
import { cn, formatDate, getPriorityColor, isOverdue } from '@/lib/utils';
import { describeRecurringPattern } from '@/lib/recurrence';
import { useTaskStore } from '@/stores/useTaskStore';
import { AddSubTask } from '@/components/tasks/AddSubTask';

interface SubTaskItemProps {
  task: Task;
  depth?: number;
  onClick?: () => void;
}

export const SubTaskItem: React.FC<SubTaskItemProps> = ({ task, depth = 0, onClick }) => {
  const { tasks, completeTask, uncompleteTask } = useTaskStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const subTasks = tasks.filter((t) => t.parentTaskId === task.id);
  const hasSubTasks = subTasks.length > 0;

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

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const overdue = isOverdue(task.dueDate);

  return (
    <>
      <div
        className={cn(
          'group flex items-start gap-2 rounded-6 border border-transparent px-3 py-2.5 transition hover:border-white/10 hover:bg-white/5',
          task.completed && 'opacity-50',
          depth > 0 && 'ml-8',
        )}
        style={{ marginLeft: depth > 0 ? `${depth * 2}rem` : undefined }}
        onClick={onClick}
      >
        {hasSubTasks && (
          <button
            onClick={handleToggle}
            className="mt-0.5 text-white/60 transition hover:text-white"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}

        {!hasSubTasks && depth > 0 && <div className="w-4" />}

        <div onClick={handleCheckboxClick} className="cursor-pointer pt-0.5">
          <Checkbox checked={task.completed} onChange={handleCheck} />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <p className={cn('text-sm text-white', task.completed && 'line-through')}>
              {task.content}
            </p>
            {hasSubTasks && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
                {subTasks.length}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
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

            {task.recurringPattern && (
              <div className="flex items-center gap-1 text-brand-300">
                <Repeat className="h-3 w-3" />
                <span>{describeRecurringPattern(task.recurringPattern)}</span>
              </div>
            )}
          </div>

          <div className="pt-1">
            <AddSubTask parentTaskId={task.id} />
          </div>
        </div>

        <button
          className="opacity-0 transition group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4 text-white/60 hover:text-white" />
        </button>
      </div>

      {hasSubTasks && isExpanded && (
        <div>
          {subTasks.map((subTask) => (
            <SubTaskItem key={subTask.id} task={subTask} depth={depth + 1} onClick={onClick} />
          ))}
        </div>
      )}
    </>
  );
};
