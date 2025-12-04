import { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SubTaskItem } from './SubTaskItem';
import type { Task } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTaskStore } from '@/stores/useTaskStore';

interface TaskListProps {
  tasks: Task[];
  emptyMessage?: string;
  enableDragDrop?: boolean;
}

const DraggableTask: React.FC<{ task: Task }> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SubTaskItem task={task} />
    </div>
  );
};

export const TaskList: React.FC<TaskListProps> = ({ tasks, emptyMessage, enableDragDrop = false }) => {
  const { updateTask } = useTaskStore();
  const topLevelTasks = useMemo(() => tasks.filter((task) => !task.parentTaskId), [tasks]);
  const [items, setItems] = useState(topLevelTasks);

  useEffect(() => {
    setItems(topLevelTasks);
  }, [topLevelTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        newItems.forEach((task, index) => {
          updateTask(task.id, { order: index });
        });

        return newItems;
      });
    }
  };

  if (topLevelTasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        description={emptyMessage ?? 'Add a new task to get started.'}
      />
    );
  }

  if (!enableDragDrop) {
    return (
      <div className="space-y-1">
        {topLevelTasks.map((task) => (
          <SubTaskItem key={task.id} task={task} />
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {items.map((task) => (
            <DraggableTask key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
