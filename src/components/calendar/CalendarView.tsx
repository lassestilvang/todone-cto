import { useState, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, CalendarRange } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfDay,
  parseISO,
} from 'date-fns';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/stores/useTaskStore';
import type { Task } from '@/types';

interface CalendarViewProps {
  tasks: Task[];
  onDayClick?: (date: Date) => void;
}

type ViewMode = 'month' | 'week' | 'day';

interface DraggableTaskCardProps {
  task: Task;
}

interface DroppableDayProps {
  date: Date;
  tasks: Task[];
  isCurrentPeriod: boolean;
  isToday: boolean;
  viewMode: ViewMode;
  onDayClick?: (date: Date) => void;
}

// Draggable task card component - memoized for performance
const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }
    : { cursor: 'grab' };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        className={cn(
          'rounded-4 px-1.5 py-0.5 text-xs truncate transition-opacity',
          task.priority === 'p1' && 'bg-red-500/20 text-red-200',
          task.priority === 'p2' && 'bg-orange-500/20 text-orange-200',
          task.priority === 'p3' && 'bg-blue-500/20 text-blue-200',
          !task.priority && 'bg-white/10 text-white/80'
        )}
      >
        {task.content}
      </div>
    </div>
  );
};

// Droppable day cell component - memoized for performance
const DroppableDay: React.FC<DroppableDayProps> = ({ date, tasks, isCurrentPeriod, isToday, viewMode, onDayClick }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: date.toISOString(),
    data: { date },
  });

  const maxTasksToShow = viewMode === 'day' ? 20 : viewMode === 'week' ? 5 : 3;

  return (
    <button
      type="button"
      onClick={() => onDayClick?.(date)}
      ref={setNodeRef}
      className={cn(
        'min-h-[80px] rounded-6 border p-2 text-left transition',
        'hover:border-white/20 hover:bg-white/5',
        isCurrentPeriod ? 'border-white/10' : 'border-white/5 opacity-40',
        isToday && 'border-brand-500 bg-brand-500/10',
        isOver && 'border-brand-400 bg-brand-400/20'
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={cn(
            'text-sm font-medium',
            isToday ? 'text-brand-400' : 'text-white',
            !isCurrentPeriod && 'text-white/40'
          )}
        >
          {viewMode === 'day' ? format(date, 'EEEE, MMMM d') : format(date, 'd')}
        </span>
        {tasks.length > 0 && (
          <span className="text-xs text-white/60">{tasks.length}</span>
        )}
      </div>

      <div className="space-y-1">
        {tasks.slice(0, maxTasksToShow).map((task) => (
          <DraggableTaskCard key={task.id} task={task} />
        ))}
        {tasks.length > maxTasksToShow && (
          <div className="text-xs text-white/40 px-1.5">
            +{tasks.length - maxTasksToShow} more
          </div>
        )}
      </div>
    </button>
  );
};

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const { updateTask } = useTaskStore();

  // Compute days to display based on view mode
  const days = useMemo(() => {
    if (viewMode === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    } else if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    } else {
      // day view
      return [startOfDay(currentDate)];
    }
  }, [currentDate, viewMode]);

  // Group tasks by date - memoized for performance
  const tasksByDate = useMemo(() => {
    const grouped = new Map<string, Task[]>();
    
    days.forEach((day) => {
      grouped.set(day.toISOString(), []);
    });

    tasks.forEach((task) => {
      if (!task.dueDate) return;
      
      const taskDate = typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate;
      const matchingDay = days.find((day) => isSameDay(day, taskDate));
      
      if (matchingDay) {
        const key = matchingDay.toISOString();
        const existing = grouped.get(key) || [];
        grouped.set(key, [...existing, task]);
      }
    });

    return grouped;
  }, [tasks, days]);

  // Get tasks for a specific date
  const getTasksForDay = useCallback(
    (date: Date) => {
      return tasksByDate.get(date.toISOString()) || [];
    },
    [tasksByDate]
  );

  // Handle drag and drop
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveTaskId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTaskId(null);

      if (!over) return;

      const taskId = String(active.id);
      const targetDateString = String(over.id);

      try {
        const targetDate = new Date(targetDateString);
        
        // Update task's due date
        updateTask(taskId, { dueDate: targetDate });
      } catch (error) {
        console.error('Error updating task date:', error);
      }
    },
    [updateTask]
  );

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  }, [currentDate, viewMode]);

  const handleNext = useCallback(() => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  }, [currentDate, viewMode]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Format title based on view mode
  const title = useMemo(() => {
    if (viewMode === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  }, [currentDate, viewMode]);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Get active task for drag overlay
  const activeTask = useMemo(() => {
    if (!activeTaskId) return null;
    return tasks.find((task) => task.id === activeTaskId);
  }, [activeTaskId, tasks]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold text-white min-w-[280px] text-center">
              {title}
            </h2>
            <Button variant="ghost" size="sm" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleToday}>
              Today
            </Button>
            <div className="flex gap-1 ml-2">
              <Button
                variant={viewMode === 'month' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('month')}
                title="Month view"
              >
                <CalendarRange className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'week' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('week')}
                title="Week view"
              >
                <CalendarDays className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'day' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('day')}
                title="Day view"
              >
                <CalendarDays className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="rounded-8 border border-white/10 bg-slate-900/40 p-4">
          {/* Weekday Headers - only show in month and week view */}
          {viewMode !== 'day' && (
            <div className={cn('grid gap-2 mb-2', viewMode === 'month' ? 'grid-cols-7' : 'grid-cols-7')}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-white/60 py-2"
                >
                  {day}
                </div>
              ))}
            </div>
          )}

          {/* Calendar Days */}
          <div
            className={cn(
              'grid gap-2',
              viewMode === 'month' && 'grid-cols-7',
              viewMode === 'week' && 'grid-cols-7',
              viewMode === 'day' && 'grid-cols-1'
            )}
          >
            {days.map((day) => {
              const dayTasks = getTasksForDay(day);
              const isCurrentPeriod =
                viewMode === 'month'
                  ? day.getMonth() === currentDate.getMonth()
                  : true;
              const isDayToday = isToday(day);

              return (
                <DroppableDay
                  key={day.toISOString()}
                  date={day}
                  tasks={dayTasks}
                  isCurrentPeriod={isCurrentPeriod}
                  isToday={isDayToday}
                  viewMode={viewMode}
                  onDayClick={onDayClick}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask && (
          <div
            className={cn(
              'rounded-4 px-1.5 py-0.5 text-xs truncate shadow-lg',
              activeTask.priority === 'p1' && 'bg-red-500/20 text-red-200',
              activeTask.priority === 'p2' && 'bg-orange-500/20 text-orange-200',
              activeTask.priority === 'p3' && 'bg-blue-500/20 text-blue-200',
              !activeTask.priority && 'bg-white/10 text-white/80'
            )}
          >
            {activeTask.content}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
