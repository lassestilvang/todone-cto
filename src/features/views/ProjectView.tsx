import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LayoutGrid, Columns, CalendarRange, Sparkles } from 'lucide-react';
import { useProjectStore } from '@/stores/useProjectStore';
import { useTaskStore } from '@/stores/useTaskStore';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskComposer } from '@/components/tasks/TaskComposer';
import { Card } from '@/components/ui/Card';
import { ProjectBoard } from '@/components/projects/ProjectBoard';
import { cn } from '@/lib/utils';

const viewModes = [
  { id: 'list', label: 'List', icon: LayoutGrid },
  { id: 'board', label: 'Board', icon: Columns },
  { id: 'calendar', label: 'Calendar', icon: CalendarRange },
];

export const ProjectView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, sections } = useProjectStore();
  const { getTasksByProject } = useTaskStore();
  const [activeViewMode, setActiveViewMode] = useState<'list' | 'board' | 'calendar'>('list');

  const project = projects.find((p) => p.id === projectId);
  const projectSections = sections.filter((section) => section.projectId === projectId);
  const projectTasks = useMemo(() => (projectId ? getTasksByProject(projectId) : []), [
    getTasksByProject,
    projectId,
  ]);

  useEffect(() => {
    if (project?.viewType && ['list', 'board', 'calendar'].includes(project.viewType)) {
      setActiveViewMode(project.viewType as 'list' | 'board' | 'calendar');
    }
  }, [project?.viewType]);

  if (!project) {
    return (
      <Card className="text-center text-white/60">
        <p>Project not found. Please select another project.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="h-10 w-10 rounded-8" style={{ backgroundColor: project.color }} />
        <div>
          <h1 className="text-2xl font-bold text-white">{project.name}</h1>
          <p className="text-sm text-white/60">{projectSections.length} sections · {projectTasks.length} tasks</p>
        </div>
        <div className="ml-auto flex gap-2">
          {viewModes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveViewMode(id as 'list' | 'board' | 'calendar')}
              className={cn(
                'flex items-center gap-1 rounded-6 border px-3 py-1.5 text-xs transition',
                activeViewMode === id
                  ? 'border-brand-500 bg-brand-500/20 text-brand-300'
                  : 'border-white/10 text-white/60 hover:bg-white/5',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <TaskComposer projectId={projectId} placeholder={`Add a task to ${project.name}`} />

      {projectSections.length === 0 ? (
        <Card className="text-center text-white/60">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-brand-400" />
          <p>Create sections to organize tasks in this project.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {activeViewMode === 'list' && (
            projectSections.map((section) => (
              <div key={section.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-white">{section.name}</h2>
                  <span className="text-xs text-white/50">Order {section.order + 1}</span>
                </div>
                <TaskList
                  tasks={projectTasks.filter((task) => task.sectionId === section.id && !task.completed)}
                  emptyMessage="No tasks in this section yet"
                  enableDragDrop
                />
              </div>
            ))
          )}

          {activeViewMode === 'board' && (
            <ProjectBoard sections={projectSections} tasks={projectTasks} projectId={projectId!} />
          )}

          {activeViewMode === 'calendar' && (
            <Card className="text-center text-white/60">
              <Sparkles className="mx-auto mb-3 h-8 w-8 text-brand-400" />
              <p>Calendar view is coming soon!</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
