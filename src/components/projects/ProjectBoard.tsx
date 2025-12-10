import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskComposer } from '@/components/tasks/TaskComposer';
import type { Section, Task } from '@/types';

interface ProjectBoardProps {
  sections: Section[];
  tasks: Task[];
  projectId: string;
}

export const ProjectBoard: React.FC<ProjectBoardProps> = ({ sections, tasks, projectId }) => {
  if (sections.length === 0) {
    return (
      <div className="rounded-8 border border-dashed border-white/10 p-6 text-center text-sm text-white/60">
        Create sections to visualize tasks on the board.
      </div>
    );
  }

  return (
    <div className="grid gap-4 overflow-x-auto md:grid-cols-3">
      {sections.map((section) => {
        const sectionTasks = tasks.filter((task) => task.sectionId === section.id && !task.completed);

        return (
          <div key={section.id} className="min-h-[300px] rounded-8 border border-white/10 bg-slate-900/40 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{section.name}</p>
                <p className="text-xs text-white/50">{sectionTasks.length} tasks</p>
              </div>
            </div>

            <div className="space-y-2">
              {sectionTasks.map((task) => (
                <div key={task.id} className="rounded-6 border border-white/10 bg-slate-900/80 p-3">
                  <TaskItem task={task} />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <TaskComposer projectId={projectId} sectionId={section.id} placeholder={`Add task to ${section.name}`} compact />
            </div>
          </div>
        );
      })}
    </div>
  );
};
