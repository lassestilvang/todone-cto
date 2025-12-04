import { create } from 'zustand';
import { db } from '@/lib/database';
import type { Comment } from '@/types';
import { generateId } from '@/lib/utils';

interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  load: (taskId?: string) => Promise<void>;
  getCommentsByTask: (taskId: string) => Comment[];
  addComment: (taskId: string, content: string) => Promise<Comment>;
  deleteComment: (id: string) => Promise<void>;
  updateComment: (id: string, content: string) => Promise<void>;
}

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: [],
  isLoading: false,

  load: async (taskId) => {
    set({ isLoading: true });
    const comments = taskId
      ? await db.comments.where('taskId').equals(taskId).sortBy('createdAt')
      : await db.comments.orderBy('createdAt').toArray();
    set({ comments, isLoading: false });
  },

  getCommentsByTask: (taskId) => {
    return get().comments.filter((comment) => comment.taskId === taskId);
  },

  addComment: async (taskId, content) => {
    const newComment: Comment = {
      id: generateId(),
      taskId,
      userId: 'demo-user',
      content,
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.comments.add(newComment);
    set((state) => ({ comments: [...state.comments, newComment] }));
    return newComment;
  },

  deleteComment: async (id) => {
    await db.comments.delete(id);
    set((state) => ({ comments: state.comments.filter((comment) => comment.id !== id) }));
  },

  updateComment: async (id, content) => {
    await db.comments.update(id, { content, updatedAt: new Date() });
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === id ? { ...comment, content, updatedAt: new Date() } : comment,
      ),
    }));
  },
}));
