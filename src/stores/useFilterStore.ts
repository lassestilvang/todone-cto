import { create } from 'zustand';
import { db } from '@/lib/database';
import type { Filter } from '@/types';
import { generateId } from '@/lib/utils';

interface FilterState {
  filters: Filter[];
  isLoading: boolean;
  load: () => Promise<void>;
  addFilter: (input: Pick<Filter, 'name' | 'query' | 'color' | 'favorite'>) => Promise<Filter>;
  updateFilter: (id: string, updates: Partial<Filter>) => Promise<void>;
  deleteFilter: (id: string) => Promise<void>;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: [],
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    const filters = await db.filters.orderBy('name').toArray();
    set({ filters, isLoading: false });
  },

  addFilter: async (input) => {
    const existingFilters = get().filters;
    const userId = existingFilters[0]?.userId ?? 'demo-user';

    const newFilter: Filter = {
      id: generateId(),
      name: input.name,
      query: input.query,
      color: input.color,
      favorite: input.favorite,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.filters.add(newFilter);
    set((state) => ({ filters: [...state.filters, newFilter] }));
    return newFilter;
  },

  updateFilter: async (id, updates) => {
    await db.filters.update(id, { ...updates, updatedAt: new Date() });
    set((state) => ({
      filters: state.filters.map((filter) =>
        filter.id === id ? { ...filter, ...updates, updatedAt: new Date() } : filter,
      ),
    }));
  },

  deleteFilter: async (id) => {
    await db.filters.delete(id);
    set((state) => ({ filters: state.filters.filter((filter) => filter.id !== id) }));
  },
}));
