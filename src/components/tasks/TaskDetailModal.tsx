import { useEffect, useState } from 'react';
import { X, Calendar, Flag, Tag, MessageSquare, Trash2, Edit2, Repeat } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { RecurringPatternPicker } from '@/components/tasks/RecurringPatternPicker';
import type { Task, RecurringPattern } from '@/types';
import { useTaskStore } from '@/stores/useTaskStore';
import { useCommentStore } from '@/stores/useCommentStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatDate, getPriorityColor } from '@/lib/utils';
import { describeRecurringPattern } from '@/lib/recurrence';
import { format } from 'date-fns';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose }) => {
  const { updateTask, deleteTask, completeTask, uncompleteTask } = useTaskStore();
  const { comments, load: loadComments, addComment, deleteComment } = useCommentStore();
  const { user } = useAuthStore();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [description, setDescription] = useState('');
  const [recurringPattern, setRecurringPattern] = useState<RecurringPattern | undefined>();

  useEffect(() => {
    if (task) {
      loadComments(task.id);
      setDescription(task.description || '');
      setRecurringPattern(task.recurringPattern);
    }
  }, [task, loadComments]);

  if (!task) return null;

  const taskComments = comments.filter((c) => c.taskId === task.id);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(task.id, newComment.trim());
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDescription = async () => {
    await updateTask(task.id, { description: description.trim() || undefined });
    setEditingDescription(false);
  };

  const handleRecurringChange = async (pattern: RecurringPattern | undefined) => {
    setRecurringPattern(pattern);
    await updateTask(task.id, { recurringPattern: pattern });
  };

  const handleDelete = async () => {
    if (confirm('Delete this task? This cannot be undone.')) {
      await deleteTask(task.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" className="max-w-3xl">
      <div className="space-y-6">
        {/* Task Header */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => {
              if (task.completed) {
                uncompleteTask(task.id);
              } else {
                completeTask(task.id);
              }
            }}
            className="mt-1 h-5 w-5 cursor-pointer rounded border-white/20 bg-transparent text-brand-500 focus:ring-brand-500"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">{task.content}</h2>
          </div>
          <button onClick={onClose} className="rounded-6 p-2 text-white/60 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Task Metadata */}
        <div className="flex flex-wrap gap-3 text-sm">
          {task.dueDate && (
            <div className="flex items-center gap-2 rounded-6 border border-white/10 bg-white/5 px-3 py-1.5">
              <Calendar className="h-4 w-4 text-white/60" />
              <span className="text-white/80">{formatDate(new Date(task.dueDate))}</span>
            </div>
          )}

          {task.priority && (
            <div
              className={`flex items-center gap-2 rounded-6 border border-white/10 bg-white/5 px-3 py-1.5 ${getPriorityColor(task.priority)}`}
            >
              <Flag className="h-4 w-4" />
              <span className="uppercase">{task.priority}</span>
            </div>
          )}

          {task.labels.length > 0 && (
            <div className="flex items-center gap-2 rounded-6 border border-white/10 bg-white/5 px-3 py-1.5">
              <Tag className="h-4 w-4 text-white/60" />
              <span className="text-white/80">{task.labels.join(', ')}</span>
            </div>
          )}

          {task.recurringPattern && (
            <div className="flex items-center gap-2 rounded-6 border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-brand-200">
              <Repeat className="h-4 w-4" />
              <span>{describeRecurringPattern(task.recurringPattern)}</span>
            </div>
          )}
          </div>

        {/* Recurring Pattern Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Recurring Pattern</h3>
            {recurringPattern && (
              <button
                onClick={() => handleRecurringChange(undefined)}
                className="text-xs text-white/60 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
          <RecurringPatternPicker value={recurringPattern} onChange={handleRecurringChange} />
          <p className="text-xs text-white/50">
            {recurringPattern ? describeRecurringPattern(recurringPattern) : 'Not repeating'}
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Description</h3>
            {!editingDescription && (
              <button
                onClick={() => setEditingDescription(true)}
                className="flex items-center gap-1 text-xs text-white/60 hover:text-white"
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </button>
            )}
          </div>

          {editingDescription ? (
            <div className="space-y-2">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows={4}
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveDescription}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setDescription(task.description || '');
                    setEditingDescription(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/70">
              {task.description || (
                <span className="text-white/40">No description yet. Click edit to add one.</span>
              )}
            </p>
          )}
        </div>

        {/* Comments */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-400" />
            <h3 className="text-sm font-semibold text-white">
              Comments ({taskComments.length})
            </h3>
          </div>

          {/* Comment List */}
          <div className="space-y-3">
            {taskComments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-6 border border-white/10 bg-white/5 p-3 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{user?.name || 'You'}</p>
                    <p className="text-xs text-white/50">
                      {format(new Date(comment.createdAt), 'MMM d, yyyy at h:mm a')}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="rounded-6 p-1 text-white/40 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-white/80 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}

            {taskComments.length === 0 && (
              <p className="text-center text-sm text-white/40 py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment... (use @name to mention someone)"
              rows={3}
            />
            <div className="flex justify-between">
              <Button
                type="submit"
                size="sm"
                loading={isSubmitting}
                disabled={!newComment.trim()}
              >
                Add Comment
              </Button>
            </div>
          </form>
        </div>

        {/* Actions */}
        <div className="border-t border-white/10 pt-4">
          <Button variant="ghost" onClick={handleDelete} className="text-red-400 hover:text-red-300">
            <Trash2 className="h-4 w-4" />
            Delete Task
          </Button>
        </div>
      </div>
    </Modal>
  );
};
