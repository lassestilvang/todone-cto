import { useEffect, useMemo, useState } from 'react';
import { Bookmark, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useFilterStore } from '@/stores/useFilterStore';
import { useTaskStore } from '@/stores/useTaskStore';
import { Badge } from '@/components/ui/Badge';
import { executeFilterQuery } from '@/lib/filterParser';
import { cn } from '@/lib/utils';

const FILTER_COLORS = [
  '#f97316',
  '#f59e0b',
  '#22c55e',
  '#0ea5e9',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#64748b',
  '#a855f7',
];

interface FilterFormState {
  id?: string;
  name: string;
  query: string;
  color: string;
  favorite: boolean;
}

const defaultState: FilterFormState = {
  name: '',
  query: 'today',
  color: FILTER_COLORS[0],
  favorite: false,
};

export const FilterManager: React.FC = () => {
  const { filters, load, addFilter, updateFilter, deleteFilter } = useFilterStore();
  const { tasks } = useTaskStore();
  const [form, setForm] = useState<FilterFormState>(defaultState);
  const [previewTasks, setPreviewTasks] = useState(tasks.slice(0, 5));
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    try {
      const results = executeFilterQuery(tasks, form.query);
      setPreviewTasks(results.slice(0, 5));
    } catch {
      setPreviewTasks([]);
    }
  }, [form.query, tasks]);

  const favoriteFilters = useMemo(() => filters.filter((filter) => filter.favorite), [filters]);
  const otherFilters = useMemo(() => filters.filter((filter) => !filter.favorite), [filters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setIsSubmitting(true);

    try {
      if (isEditing && form.id) {
        await updateFilter(form.id, {
          name: form.name,
          query: form.query,
          color: form.color,
          favorite: form.favorite,
        });
      } else {
        await addFilter({
          name: form.name,
          query: form.query,
          color: form.color,
          favorite: form.favorite,
        });
      }
      setForm(defaultState);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (filter: FilterFormState) => {
    setForm(filter);
    setIsEditing(true);
  };

  const handleDelete = async (filterId: string) => {
    if (window.confirm('Delete this filter? This action cannot be undone.')) {
      await deleteFilter(filterId);
    }
  };

  const handleCancel = () => {
    setForm(defaultState);
    setIsEditing(false);
  };

  const renderFilterCard = (filter: FilterFormState) => (
    <div key={filter.id} className="flex flex-col rounded-8 border border-white/5 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-white" style={{ color: filter.color }}>
            {filter.name}
          </p>
          <p className="text-xs text-white/50">Query: {filter.query}</p>
        </div>
        <div className="flex items-center gap-2">
          {filter.favorite && <Star className="h-4 w-4 text-amber-400" fill="currentColor" />}
          <button
            type="button"
            onClick={() => handleEdit(filter)}
            className="rounded-6 border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:text-white"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(filter.id!)}
            className="rounded-6 border border-red-400/40 px-3 py-1 text-xs text-red-300 transition hover:text-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-8 border border-white/10 bg-white/5 p-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">{isEditing ? 'Edit filter' : 'Create filter'}</h2>
            <p className="text-sm text-white/60">Build powerful queries to surface tasks automatically.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Filter name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. High priority work"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Query</label>
            <Textarea
              value={form.query}
              onChange={(e) => setForm((prev) => ({ ...prev, query: e.target.value }))}
              rows={3}
              placeholder="Examples: today & @urgent, #work & overdue, p1 | p2"
            />
            <p className="text-xs text-white/50">
              Supported tokens: today, overdue, no date, p1-p4, @label, #project, search:term, recurring,
              subtask, !subtask
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Color</label>
            <div className="flex flex-wrap gap-2">
              {FILTER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, color }))}
                  className={cn(
                    'h-8 w-8 rounded-full border border-transparent transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300',
                    form.color === color ? 'ring-2 ring-white/80' : 'opacity-70 hover:opacity-100',
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.favorite}
              onChange={(e) => setForm((prev) => ({ ...prev, favorite: e.target.checked }))}
              className="h-4 w-4 rounded border-white/20 bg-transparent text-amber-400 focus:ring-amber-400"
            />
            Add to favorites
          </label>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" loading={isSubmitting}>
              {isEditing ? 'Save filter' : 'Create filter'}
            </Button>
            {isEditing && (
              <Button type="button" variant="ghost" className="flex-1" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-8 border border-white/10 bg-slate-900/40 p-4">
          <div className="flex items-center gap-3">
            <Bookmark className="h-5 w-5 text-brand-400" />
            <div>
              <p className="font-semibold text-white">Preview</p>
              <p className="text-sm text-white/60">Showing first {previewTasks.length} tasks</p>
            </div>
          </div>

          {previewTasks.length === 0 ? (
            <div className="mt-4 rounded-8 border border-dashed border-white/10 p-4 text-sm text-white/60">
              No tasks match this filter yet.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {previewTasks.map((task) => (
                <div key={task.id} className="rounded-6 border border-white/5 bg-slate-900/60 px-3 py-2 text-sm text-white">
                  <p className="font-medium">{task.content}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-white/60">
                    {task.priority && <Badge variant="outline">{task.priority.toUpperCase()}</Badge>}
                    {task.labels.map((label) => (
                      <Badge key={label} variant="outline">
                        @{label}
                      </Badge>
                    ))}
                    {task.dueDate && <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>

      {favoriteFilters.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-300">Favorite Filters</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {favoriteFilters.map((filter) => renderFilterCard(filter))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">All Filters</h3>
          <span className="text-xs text-white/40">{filters.length} saved filters</span>
        </div>

        {filters.length === 0 ? (
          <div className="rounded-8 border border-dashed border-white/10 p-6 text-center text-sm text-white/60">
            Create your first filter to see it listed here.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {otherFilters.map((filter) => renderFilterCard(filter))}
          </div>
        )}
      </div>
    </div>
  );
};
