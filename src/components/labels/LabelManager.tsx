import { useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLabelStore } from '@/stores/useLabelStore';
import type { Label } from '@/types';
import { cn } from '@/lib/utils';

const LABEL_COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#64748b',
  '#71717a',
  '#737373',
];

interface LabelFormState {
  id?: string;
  name: string;
  color: string;
  personal: boolean;
}

const defaultState: LabelFormState = {
  name: '',
  color: LABEL_COLORS[6],
  personal: true,
};

export const LabelManager: React.FC = () => {
  const { labels, load, addLabel, updateLabel, deleteLabel } = useLabelStore();
  const [form, setForm] = useState<LabelFormState>(defaultState);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  const filteredLabels = useMemo(() => {
    if (!search) return labels;
    return labels.filter((label) => label.name.toLowerCase().includes(search.toLowerCase()));
  }, [labels, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setIsSubmitting(true);

    try {
      if (isEditing && form.id) {
        await updateLabel(form.id, {
          name: form.name,
          color: form.color,
          personal: form.personal,
        });
      } else {
        await addLabel({
          name: form.name,
          color: form.color,
          personal: form.personal,
        });
      }
      setForm(defaultState);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (label: Label) => {
    setForm({
      id: label.id,
      name: label.name,
      color: label.color,
      personal: label.personal,
    });
    setIsEditing(true);
  };

  const handleDelete = async (label: Label) => {
    if (window.confirm(`Delete label "${label.name}"? This cannot be undone.`)) {
      await deleteLabel(label.id);
    }
  };

  const handleCancel = () => {
    setForm(defaultState);
    setIsEditing(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-8 border border-white/10 bg-white/5 p-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{isEditing ? 'Edit label' : 'Create label'}</h2>
          <p className="text-sm text-white/60">Labels help you organize contexts, energy levels, and more.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Label name</label>
          <Input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. @deep_work"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Color</label>
          <div className="grid grid-cols-5 gap-2">
            {LABEL_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, color }))}
                className={cn(
                  'h-8 rounded-6 border border-transparent transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300',
                  form.color === color ? 'ring-2 ring-white/80' : 'opacity-80 hover:opacity-100',
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-white/70">
          <input
            id="personal"
            type="checkbox"
            checked={form.personal}
            onChange={(e) => setForm((prev) => ({ ...prev, personal: e.target.checked }))}
            className="h-4 w-4 rounded border-white/20 bg-transparent text-brand-500 focus:ring-brand-500"
          />
          <label htmlFor="personal">Personal label (visible only to you)</label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" loading={isSubmitting} className="flex-1">
            {isEditing ? 'Save changes' : 'Create label'}
          </Button>
          {isEditing && (
            <Button type="button" variant="ghost" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="rounded-8 border border-white/10 bg-white/5 p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Labels</h2>
            <p className="text-sm text-white/50">{labels.length} labels available</p>
          </div>
          <div className="w-64">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search labels" />
          </div>
        </div>

        {filteredLabels.length === 0 ? (
          <div className="rounded-8 border border-dashed border-white/10 p-6 text-center text-sm text-white/60">
            No labels found. Create your first label to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLabels.map((label) => (
              <div
                key={label.id}
                className="flex items-center justify-between rounded-6 border border-white/5 bg-slate-900/40 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: label.color }} />
                  <div>
                    <p className="font-medium text-white">@{label.name}</p>
                    <p className="text-xs text-white/50">{label.personal ? 'Personal' : 'Shared'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(label)}
                    className="rounded-6 border border-white/10 p-2 text-white/70 transition hover:text-white"
                    aria-label={`Edit label ${label.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(label)}
                    className="rounded-6 border border-red-500/30 p-2 text-red-300 transition hover:text-red-200"
                    aria-label={`Delete label ${label.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
