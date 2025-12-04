import type { Task, Project, Label, Filter } from '@/types';

export interface SearchResult {
  type: 'task' | 'project' | 'label' | 'filter';
  id: string;
  title: string;
  subtitle?: string;
  priority?: string;
  color?: string;
  item: Task | Project | Label | Filter;
}

const normalizeString = (str: string): string => {
  return str.toLowerCase().trim();
};

const calculateRelevanceScore = (searchTerm: string, text: string): number => {
  const normalizedSearch = normalizeString(searchTerm);
  const normalizedText = normalizeString(text);

  if (normalizedText === normalizedSearch) return 100;
  if (normalizedText.startsWith(normalizedSearch)) return 90;
  if (normalizedText.includes(` ${normalizedSearch}`)) return 80;
  if (normalizedText.includes(normalizedSearch)) return 70;

  const words = normalizedSearch.split(' ');
  const matchedWords = words.filter((word) => normalizedText.includes(word));
  return (matchedWords.length / words.length) * 50;
};

export const fuzzySearch = (searchTerm: string, text: string): boolean => {
  const score = calculateRelevanceScore(searchTerm, text);
  return score > 30;
};

export const searchTasks = (tasks: Task[], query: string): SearchResult[] => {
  if (!query.trim()) return [];

  return tasks
    .filter((task) => {
      const searchableText = [
        task.content,
        task.description || '',
        ...task.labels,
      ].join(' ');
      return fuzzySearch(query, searchableText);
    })
    .map((task) => ({
      type: 'task' as const,
      id: task.id,
      title: task.content,
      subtitle: task.description,
      priority: task.priority || undefined,
      item: task,
    }))
    .sort((a, b) => {
      const scoreA = calculateRelevanceScore(query, a.title);
      const scoreB = calculateRelevanceScore(query, b.title);
      return scoreB - scoreA;
    });
};

export const searchProjects = (projects: Project[], query: string): SearchResult[] => {
  if (!query.trim()) return [];

  return projects
    .filter((project) => fuzzySearch(query, project.name))
    .map((project) => ({
      type: 'project' as const,
      id: project.id,
      title: project.name,
      color: project.color,
      item: project,
    }))
    .sort((a, b) => {
      const scoreA = calculateRelevanceScore(query, a.title);
      const scoreB = calculateRelevanceScore(query, b.title);
      return scoreB - scoreA;
    });
};

export const searchLabels = (labels: Label[], query: string): SearchResult[] => {
  if (!query.trim()) return [];

  return labels
    .filter((label) => fuzzySearch(query, label.name))
    .map((label) => ({
      type: 'label' as const,
      id: label.id,
      title: `@${label.name}`,
      color: label.color,
      item: label,
    }))
    .sort((a, b) => {
      const scoreA = calculateRelevanceScore(query, a.title);
      const scoreB = calculateRelevanceScore(query, b.title);
      return scoreB - scoreA;
    });
};

export const searchFilters = (filters: Filter[], query: string): SearchResult[] => {
  if (!query.trim()) return [];

  return filters
    .filter((filter) => fuzzySearch(query, filter.name))
    .map((filter) => ({
      type: 'filter' as const,
      id: filter.id,
      title: filter.name,
      subtitle: filter.query,
      color: filter.color,
      item: filter,
    }))
    .sort((a, b) => {
      const scoreA = calculateRelevanceScore(query, a.title);
      const scoreB = calculateRelevanceScore(query, b.title);
      return scoreB - scoreA;
    });
};

export const globalSearch = (
  query: string,
  tasks: Task[],
  projects: Project[],
  labels: Label[],
  filters: Filter[],
): SearchResult[] => {
  if (!query.trim()) return [];

  const taskResults = searchTasks(tasks, query);
  const projectResults = searchProjects(projects, query);
  const labelResults = searchLabels(labels, query);
  const filterResults = searchFilters(filters, query);

  return [
    ...taskResults.slice(0, 5),
    ...projectResults.slice(0, 3),
    ...labelResults.slice(0, 3),
    ...filterResults.slice(0, 2),
  ];
};
