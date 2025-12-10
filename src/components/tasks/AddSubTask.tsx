import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTaskStore } from '@/stores/useTaskStore';

interface AddSubTaskProps {
  parentTaskId: string;
  onComplete?: () => void;
}

export const AddSubTask: React.FC<AddSubTaskProps> = ({ parentTaskId, onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTask } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      await addTask({
        content: content.trim(),
        parentTaskId,
        projectId: undefined,
        sectionId: undefined,
        dueDate: undefined,
        priority: null,
      });
      setContent('');
      setIsOpen(false);
      onComplete?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-6 px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/5 hover:text-white"
      >
        <Plus className="h-3 w-3" />
        Add sub-task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-6 border border-white/10 bg-white/5 p-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Sub-task name..."
        autoFocus
        className="h-8 flex-1"
      />
      <div className="flex items-center gap-1">
        <Button type="submit" size="sm" loading={isSubmitting} disabled={!content.trim()}>
          Add
        </Button>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-6 border border-white/10 p-1.5 text-white/60 transition hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};
