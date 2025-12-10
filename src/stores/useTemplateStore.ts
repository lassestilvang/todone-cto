import { create } from 'zustand';
import { TEMPLATE_LIBRARY } from '@/data/templates';
import type { Template, TemplateStructure } from '@/types';
import { generateId } from '@/lib/utils';

interface TemplateState {
  templates: Template[];
  getTemplateById: (id: string) => Template | undefined;
  getTemplatesByCategory: (category: string) => Template[];
  getCategories: () => string[];
  addCustomTemplate: (
    name: string,
    description: string,
    category: string,
    structure: TemplateStructure,
  ) => Template;
}

const CATEGORY_ORDER = ['Work', 'Personal', 'Education', 'Management', 'Marketing & Sales', 'Customer Support'];

const buildInitialTemplates = (): Template[] =>
  (TEMPLATE_LIBRARY.length > 0 ? TEMPLATE_LIBRARY : []).map((template) => ({
    ...template,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: buildInitialTemplates(),

  getTemplateById: (id) => get().templates.find((template) => template.id === id),

  getTemplatesByCategory: (category) =>
    get().templates.filter((template) => template.category === category),

  getCategories: () => {
    const categories = Array.from(new Set(get().templates.map((template) => template.category)));
    return categories.sort((a, b) => {
      const indexA = CATEGORY_ORDER.indexOf(a);
      const indexB = CATEGORY_ORDER.indexOf(b);

      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  },

  addCustomTemplate: (name, description, category, structure) => {
    const newTemplate: Template = {
      id: generateId(),
      name,
      description,
      category,
      icon: '📋',
      structure,
      isCustom: true,
      userId: 'demo-user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({ templates: [...state.templates, newTemplate] }));
    return newTemplate;
  },
}));
