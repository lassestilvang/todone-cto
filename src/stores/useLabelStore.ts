import { create } from 'zustand';
import { db } from '@/lib/database';
import type { Label } from '@/types';
import { generateId } from '@/lib/utils';

interface LabelState {
  labels: Label[];
  isLoading: boolean;
  load: () => Promise<void>;
  addLabel: (input: Pick<Label, 'name' | 'color' | 'personal'>) => Promise<Label>;
  updateLabel: (id: string, updates: Partial<Label>) => Promise<void>;
  deleteLabel: (id: string) => Promise<void>;
  getLabelById: (id: string) => Label | undefined;
  getLabelsByNames: (names: string[]) => Label[];
}

export const useLabelStore = create<LabelState>((set, get) => ({
  labels: [],
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    const labels = await db.labels.orderBy('name').toArray();
    set({ labels, isLoading: false });
  },

  addLabel: async (input) => {
    const existingLabels = get().labels;
    const userId = existingLabels[0]?.userId ?? 'demo-user';

    const newLabel: Label = {
      id: generateId(),
      name: input.name,
      color: input.color,
      personal: input.personal,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.labels.add(newLabel);
    set((state) => ({ labels: [...state.labels, newLabel] }));
    return newLabel;
  },

  updateLabel: async (id, updates) => {
    await db.labels.update(id, { ...updates, updatedAt: new Date() });
    set((state) => ({
      labels: state.labels.map((label) =>
        label.id === id ? { ...label, ...updates, updatedAt: new Date() } : label,
      ),
    }));
  },

  deleteLabel: async (id) => {
    await db.labels.delete(id);
    set((state) => ({ labels: state.labels.filter((label) => label.id !== id) }));
  },

  getLabelById: (id) => {
    return get().labels.find((label) => label.id === id);
  },

  getLabelsByNames: (names) => {
    const normalizedNames = names.map((name) => name.toLowerCase());
    return get().labels.filter((label) => normalizedNames.includes(label.name.toLowerCase()));
  },
}));
