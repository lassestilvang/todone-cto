import { useState } from 'react';
import { Plus, Hash, AtSign, Clock, Flag } from 'lucide-react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useTaskStore } from '@/stores/useTaskStore';
import { useProjectStore } from '@/stores/useProjectStore';
import type { Priority } from '@/types';
import { parseQuickTaskInput } from '@/features/tasks/parser';

interface TaskComposerProps {
  placeholder?: string;
  autoFocus?: boolean;
  projectId?: string;
  sectionId?: string;
  compact?: boolean;
}

export const TaskComposer: React.FC<TaskComposerProps> = ({
  placeholder = 'Add a task... (#project, @label, p1, today)',
  autoFocus,
  projectId,
  sectionId,
  compact = false,
}) => {
  const [value, setValue] = useState('');
  const [duration, setDuration] = useState<number | undefined>();
  const [priority, setPriority] = useState<Priority>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [targetProjectId, setTargetProjectId] = useState<string | undefined>(projectId);
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);

  const { addTask } = useTaskStore();
  const { projects } = useProjectStore();

  const resetState = () => {
    setValue('');
    setDuration(undefined);
    setPriority(null);
    setLabels([]);
    setDueDate(undefined);
    setTargetProjectId(projectId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    setIsProcessing(true);

    const parsed = parseQuickTaskInput(value);
    const normalizedProjectName = parsed.projectName
      ?.replace(/[^a-z0-9]/gi, '')
      .toLowerCase();
    const matchedProject = normalizedProjectName
      ? projects.find(
          (project) =>
            project.name
              .replace(/[^a-z0-9]/gi, '')
              .toLowerCase() === normalizedProjectName,
        )
      : undefined;

    const resolvedProjectId = matchedProject?.id ?? projectId ?? targetProjectId;

    await addTask({
      content: parsed.content,
      description: parsed.description,
      projectId: resolvedProjectId,
      sectionId,
      labels: parsed.labels.length ? parsed.labels : labels,
      priority: parsed.priority ?? priority,
      dueDate: parsed.dueDate ?? dueDate,
      duration: parsed.duration ?? duration,
    });

    resetState();
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className={`rounded-8 border border-white/10 bg-white/5 ${compact ? 'p-2' : 'p-4'}`}>
      <Textarea
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={compact ? 1 : 2}
      />

      {!compact && (
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/60">
        <div className="flex items-center gap-1">
          <Hash className="h-3 w-3" />
          <select
            value={targetProjectId}
            onChange={(e) => setTargetProjectId(e.target.value || undefined)}
            className="rounded-4 border border-white/10 bg-transparent px-2 py-1 text-xs text-white focus:border-brand-500 focus:outline-none"
          >
            <option value="">Inbox</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id} className="bg-slate-900">
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <button type="button" className="flex items-center gap-1" onClick={() => setLabels([...labels, '@energy'])}>
          <AtSign className="h-3 w-3" />
          Labels
        </button>

        <button type="button" className="flex items-center gap-1" onClick={() => setDuration((prev) => (prev ? prev + 15 : 30))}>
          <Clock className="h-3 w-3" />
          Duration {duration ? `(${duration} min)` : ''}
        </button>

        <button type="button" className="flex items-center gap-1" onClick={() => setPriority((prev) => (prev === 'p1' ? null : 'p1'))}>
          <Flag className="h-3 w-3" />
          Priority {priority ? priority.toUpperCase() : ''}
        </button>

        <div className="ml-auto flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={resetState}>
            Cancel
          </Button>
          <Button type="submit" size="sm" loading={isProcessing}>
            <Plus className="h-4 w-4" /> Add task
          </Button>
        </div>
      </div>
      )}

      {compact && (
        <div className="mt-2">
          <Button type="submit" size="sm" loading={isProcessing} disabled={!value.trim()}>
            Add
          </Button>
        </div>
      )}
    </form>
  );
};
