import { create } from 'zustand';
import { db } from '@/lib/database';
import type { Project, Section } from '@/types';
import { generateId } from '@/lib/utils';

interface ProjectState {
  projects: Project[];
  sections: Section[];
  isLoading: boolean;
  load: () => Promise<void>;
  addProject: (input: Pick<Project, 'name' | 'color' | 'viewType'>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addSection: (input: { name: string; projectId: string; order?: number }) => Promise<Section>;
  updateSection: (id: string, updates: Partial<Section>) => Promise<void>;
  deleteSection: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  sections: [],
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    const [projects, sections] = await Promise.all([
      db.projects.orderBy('order').toArray(),
      db.sections.orderBy('order').toArray(),
    ]);
    set({ projects, sections, isLoading: false });
  },

  addProject: async (input) => {
    const newProject: Project = {
      id: generateId(),
      name: input.name,
      color: input.color,
      viewType: input.viewType,
      favorite: false,
      shared: false,
      parentProjectId: undefined,
      order: get().projects.length,
      userId: get().projects[0]?.userId ?? 'demo-user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.projects.add(newProject);
    set((state) => ({ projects: [...state.projects, newProject] }));
    return newProject;
  },

  updateProject: async (id, updates) => {
    await db.projects.update(id, { ...updates, updatedAt: new Date() });
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...updates, updatedAt: new Date() } : project,
      ),
    }));
  },

  deleteProject: async (id) => {
    await db.projects.delete(id);
    set((state) => ({ projects: state.projects.filter((project) => project.id !== id) }));
  },

  addSection: async ({ name, projectId, order }) => {
    const newSection: Section = {
      id: generateId(),
      name,
      projectId,
      order: order ?? get().sections.filter((section) => section.projectId === projectId).length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.sections.add(newSection);
    set((state) => ({ sections: [...state.sections, newSection] }));
    return newSection;
  },

  updateSection: async (id, updates) => {
    await db.sections.update(id, { ...updates, updatedAt: new Date() });
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === id ? { ...section, ...updates, updatedAt: new Date() } : section,
      ),
    }));
  },

  deleteSection: async (id) => {
    await db.sections.delete(id);
    set((state) => ({ sections: state.sections.filter((section) => section.id !== id) }));
  },
}));
