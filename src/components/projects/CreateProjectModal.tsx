import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useProjectStore } from '@/stores/useProjectStore';

const PROJECT_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#64748b', '#71717a', '#737373',
];

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PROJECT_COLORS[6]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addProject } = useProjectStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    try {
      await addProject({ name: name.trim(), color });
      setName('');
      setColor(PROJECT_COLORS[6]);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setColor(PROJECT_COLORS[6]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Project" className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Project name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Work, Personal, Side Project"
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Color</label>
          <div className="grid grid-cols-10 gap-2">
            {PROJECT_COLORS.map((projectColor) => (
              <button
                key={projectColor}
                type="button"
                onClick={() => setColor(projectColor)}
                className={`h-8 w-8 rounded-6 transition ${
                  color === projectColor ? 'ring-2 ring-white/80 ring-offset-2 ring-offset-slate-900' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: projectColor }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" loading={isSubmitting} disabled={!name.trim()} className="flex-1">
            Create Project
          </Button>
          <Button type="button" variant="ghost" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
