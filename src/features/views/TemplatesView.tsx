import { useState } from 'react';
import { useTemplateStore } from '@/stores/useTemplateStore';
import { useProjectStore } from '@/stores/useProjectStore';
import { useTaskStore } from '@/stores/useTaskStore';
import { useNavigate } from 'react-router-dom';
import { Search, X, Check, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import type { Template } from '@/types';

const DEFAULT_TEMPLATE_CATEGORIES = ['Work', 'Personal', 'Education', 'Management', 'Marketing & Sales', 'Customer Support'];

export const TemplatesView: React.FC = () => {
  const navigate = useNavigate();
  const { templates, getCategories, addCustomTemplate } = useTemplateStore();
  const { projects, sections, addProject, addSection } = useProjectStore();
  const { tasks, addTask } = useTaskStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  
  // Custom template creation state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customCategory, setCustomCategory] = useState(DEFAULT_TEMPLATE_CATEGORIES[0]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const categories = getCategories();
  const categoryOptions = Array.from(new Set([...DEFAULT_TEMPLATE_CATEGORIES, ...categories]));
  const allCategories = ['all', ...categories];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDefaultCategory = () => categoryOptions[0] ?? DEFAULT_TEMPLATE_CATEGORIES[0];
  const getDefaultProjectId = () => projects[0]?.id ?? '';

  const resetCreateForm = () => {
    setCustomName('');
    setCustomDescription('');
    setCustomCategory(getDefaultCategory());
    setSelectedProjectId(getDefaultProjectId());
    setFormError(null);
  };

  const handleOpenCreateModal = () => {
    if (!projects.length) return;
    resetCreateForm();
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    if (isSaving) return;
    resetCreateForm();
    setIsCreateModalOpen(false);
  };

  const handleCreateTemplate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customName.trim()) {
      setFormError('Please provide a template name.');
      return;
    }
    if (!selectedProjectId) {
      setFormError('Please choose a project to base this template on.');
      return;
    }

    const sourceProject = projects.find((project) => project.id === selectedProjectId);
    if (!sourceProject) {
      setFormError('Selected project could not be found.');
      return;
    }

    setIsSaving(true);
    try {
      const projectSections = sections
        .filter((section) => section.projectId === sourceProject.id)
        .sort((a, b) => a.order - b.order);
      const sectionIndexMap = new Map<string, number>();
      const templateSections = projectSections.map((section, index) => {
        sectionIndexMap.set(section.id, index);
        return { name: section.name, order: index };
      });

      const projectTasks = tasks
        .filter((task) => task.projectId === sourceProject.id && !task.parentTaskId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((task, index) => ({
          content: task.content,
          description: task.description,
          sectionIndex: task.sectionId ? sectionIndexMap.get(task.sectionId) : undefined,
          priority: task.priority ?? undefined,
          labels: task.labels.length ? task.labels : undefined,
          order: index,
        }));

      const structure = {
        projectName: sourceProject.name,
        projectColor: sourceProject.color,
        sections: templateSections,
        tasks: projectTasks,
      };

      const newTemplate = addCustomTemplate(
        customName.trim(),
        customDescription.trim() || `Template created from ${sourceProject.name}`,
        customCategory,
        structure,
      );

      setSelectedCategory('all');
      setSelectedTemplate(newTemplate);
      setIsCreateModalOpen(false);
      resetCreateForm();
    } catch (error) {
      console.error('Failed to create template:', error);
      setFormError('Unable to create template. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyTemplate = async (template: Template) => {
    setIsApplying(true);
    try {
      // Create the project
      const project = await addProject({
        name: template.structure.projectName,
        color: template.structure.projectColor,
        viewType: 'list',
      });

      // Create sections
      const sectionIds: string[] = [];
      for (const sectionData of template.structure.sections) {
        const section = await addSection({
          name: sectionData.name,
          projectId: project.id,
          order: sectionData.order,
        });
        sectionIds.push(section.id);
      }

      // Create tasks
      for (const taskData of template.structure.tasks) {
        await addTask({
          content: taskData.content,
          description: taskData.description,
          projectId: project.id,
          sectionId: taskData.sectionIndex !== undefined ? sectionIds[taskData.sectionIndex] : undefined,
          priority: taskData.priority || null,
          labels: taskData.labels || [],
          order: taskData.order,
        });
      }

      // Navigate to the new project
      navigate(`/project/${project.id}`);
    } catch (error) {
      console.error('Failed to apply template:', error);
    } finally {
      setIsApplying(false);
      setSelectedTemplate(null);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-brand-400" />
            <h1 className="text-2xl font-bold text-white">Project Templates</h1>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="ml-auto flex items-center gap-2"
            onClick={handleOpenCreateModal}
            disabled={!projects.length}
          >
            <Plus className="h-4 w-4" />
            Create template
          </Button>
        </div>
        <p className="text-white/60">
          Get started quickly with 50+ pre-built project templates across multiple categories
        </p>
      </div>

      {/* Search and Filters */}
      <div className="border-b border-white/10 p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-800/50 py-2 pl-10 pr-4 text-white placeholder-white/40 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-700/50 text-white/70 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group rounded-lg border border-white/10 bg-slate-800/30 p-4 transition hover:border-brand-500/50 hover:bg-slate-800/50"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{template.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white">{template.name}</h3>
                    <span className="text-xs text-white/50">{template.category}</span>
                  </div>
                </div>
                {template.isCustom && (
                  <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-xs text-brand-300">
                    Custom
                  </span>
                )}
              </div>

              <p className="mb-4 text-sm text-white/60 line-clamp-2">{template.description}</p>

              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span>{template.structure.sections.length} sections</span>
                  <span>•</span>
                  <span>{template.structure.tasks.length} tasks</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedTemplate(template)}
                >
                  Preview
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleApplyTemplate(template)}
                  disabled={isApplying}
                >
                  <Check className="h-4 w-4" />
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="flex h-64 flex-col items-center justify-center text-white/40">
            <Search className="mb-4 h-12 w-12" />
            <p className="text-lg">No templates found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-lg border border-white/10 bg-slate-900 shadow-xl">
            <div className="flex items-start justify-between border-b border-white/10 p-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedTemplate.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedTemplate.name}</h2>
                  <p className="text-sm text-white/50">{selectedTemplate.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-6">
              <p className="mb-6 text-white/70">{selectedTemplate.description}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/50">
                    Project Structure
                  </h3>
                  <div className="rounded-lg border border-white/10 bg-slate-800/30 p-4">
                    <p className="mb-4 text-white">
                      <span className="text-white/50">Project Name: </span>
                      {selectedTemplate.structure.projectName}
                    </p>
                    <div className="space-y-3">
                      {selectedTemplate.structure.sections.map((section, idx) => (
                        <div key={idx} className="rounded-lg bg-slate-700/30 p-3">
                          <p className="mb-2 font-medium text-white">{section.name}</p>
                          <div className="space-y-1.5 pl-3">
                            {selectedTemplate.structure.tasks
                              .filter((task) => task.sectionIndex === idx)
                              .map((task, taskIdx) => (
                                <div key={taskIdx} className="flex items-center gap-2 text-sm text-white/70">
                                  <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                                  {task.content}
                                  {task.priority && (
                                    <span
                                      className={`ml-auto rounded px-1.5 py-0.5 text-xs font-medium ${
                                        task.priority === 'p1'
                                          ? 'bg-red-500/20 text-red-300'
                                          : task.priority === 'p2'
                                          ? 'bg-yellow-500/20 text-yellow-300'
                                          : task.priority === 'p3'
                                          ? 'bg-blue-500/20 text-blue-300'
                                          : 'bg-gray-500/20 text-gray-300'
                                      }`}
                                    >
                                      {task.priority.toUpperCase()}
                                    </span>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 p-6">
              <Button variant="ghost" onClick={() => setSelectedTemplate(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleApplyTemplate(selectedTemplate)}
                disabled={isApplying}
              >
                <Check className="h-4 w-4" />
                {isApplying ? 'Creating...' : 'Use This Template'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title="Create custom template"
        className="max-w-xl"
      >
        {projects.length === 0 ? (
          <p className="text-sm text-white/70">
            You need at least one project before you can create a custom template.
          </p>
        ) : (
          <form className="space-y-4" onSubmit={handleCreateTemplate}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Template name</label>
              <Input
                placeholder="Quarterly planning"
                value={customName}
                error={formError?.includes('name') ? formError : undefined}
                onChange={(event) => {
                  setCustomName(event.target.value);
                  if (formError?.includes('name')) setFormError(null);
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Description</label>
              <Textarea
                placeholder="Describe what this template is best used for"
                rows={3}
                value={customDescription}
                onChange={(event) => setCustomDescription(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Category</label>
              <select
                value={customCategory}
                onChange={(event) => setCustomCategory(event.target.value)}
                className="w-full rounded-6 border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category} className="bg-slate-900 text-white">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Project to copy</label>
              <select
                value={selectedProjectId}
                onChange={(event) => setSelectedProjectId(event.target.value)}
                className="w-full rounded-6 border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id} className="bg-slate-900 text-white">
                    {project.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-white/50">
                We will capture the project's sections and top-level tasks as part of the template.
              </p>
            </div>

            {formError && !(formError?.includes('name')) && (
              <p className="text-sm text-red-400">{formError}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={handleCloseCreateModal} disabled={isSaving}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!customName.trim() || !selectedProjectId}
                loading={isSaving}
              >
                Save template
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
