export interface TemplateTask {
  content: string;
  description?: string;
  priority?: 'p1' | 'p2' | 'p3' | 'p4';
  durationMinutes?: number;
  sectionName?: string;
  subtasks?: string[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  color: string;
  sections: string[];
  tasks: TemplateTask[];
  tags: string[];
  estimatedTasks: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export type TemplateCategory =
  | 'work'
  | 'personal'
  | 'education'
  | 'management'
  | 'marketing'
  | 'support'
  | 'creative'
  | 'finance'
  | 'health';

export const TEMPLATE_CATEGORIES: Record<TemplateCategory, { label: string; description: string }> = {
  work: {
    label: 'Work & Business',
    description: 'Professional workflows and business processes',
  },
  personal: {
    label: 'Personal Life',
    description: 'Personal goals, habits, and daily routines',
  },
  education: {
    label: 'Education & Learning',
    description: 'Study plans, courses, and skill development',
  },
  management: {
    label: 'Team Management',
    description: 'Leadership, team coordination, and project management',
  },
  marketing: {
    label: 'Marketing & Sales',
    description: 'Campaigns, content creation, and sales processes',
  },
  support: {
    label: 'Customer Support',
    description: 'Help desk, bug tracking, and customer success',
  },
  creative: {
    label: 'Creative Projects',
    description: 'Content creation, design, and creative workflows',
  },
  finance: {
    label: 'Finance & Accounting',
    description: 'Financial planning, budgeting, and bookkeeping',
  },
  health: {
    label: 'Health & Fitness',
    description: 'Wellness routines, fitness goals, and health tracking',
  },
};
