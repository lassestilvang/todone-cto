import { Inbox, Calendar, ChevronRight, Plus, ChevronDown, Tags, Filter, TrendingUp, Settings as SettingsIcon, Sparkles } from 'lucide-react';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/useUIStore';
import { useProjectStore } from '@/stores/useProjectStore';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { activeView, setActiveView, setSelectedProjectId } = useUIStore();
  const { projects } = useProjectStore();
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const handleViewChange = (view: 'inbox' | 'today' | 'upcoming' | 'filters' | 'labels' | 'productivity' | 'settings' | 'templates') => {
    setActiveView(view);
    setSelectedProjectId(null);
    navigate(`/${view}`);
  };

  const handleProjectClick = (projectId: string) => {
    setActiveView('project');
    setSelectedProjectId(projectId);
    navigate(`/project/${projectId}`);
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/10 bg-slate-800/50">
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-6 bg-brand-500 font-bold text-white">
            T
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Todone</h1>
            <p className="text-xs text-white/50">From to-do to todone</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <button
          onClick={() => handleViewChange('inbox')}
          className={cn(
            'flex w-full items-center gap-3 rounded-6 px-3 py-2 text-sm transition',
            activeView === 'inbox'
              ? 'bg-brand-500/20 text-brand-300'
              : 'text-white/70 hover:bg-white/5 hover:text-white',
          )}
        >
          <Inbox className="h-4 w-4" />
          <span>Inbox</span>
        </button>

        <button
          onClick={() => handleViewChange('today')}
          className={cn(
            'flex w-full items-center gap-3 rounded-6 px-3 py-2 text-sm transition',
            activeView === 'today'
              ? 'bg-brand-500/20 text-brand-300'
              : 'text-white/70 hover:bg-white/5 hover:text-white',
          )}
        >
          <Calendar className="h-4 w-4" />
          <span>Today</span>
        </button>

        <button
          onClick={() => handleViewChange('upcoming')}
          className={cn(
            'flex w-full items-center gap-3 rounded-6 px-3 py-2 text-sm transition',
            activeView === 'upcoming'
              ? 'bg-brand-500/20 text-brand-300'
              : 'text-white/70 hover:bg-white/5 hover:text-white',
          )}
        >
          <Calendar className="h-4 w-4" />
          <span>Upcoming</span>
        </button>

        <div className="border-t border-white/10 pt-4 mt-4 space-y-1">
          <button
            onClick={() => handleViewChange('productivity')}
            className={cn(
              'flex w-full items-center gap-3 rounded-6 px-3 py-2 text-sm transition',
              activeView === 'productivity'
                ? 'bg-brand-500/20 text-brand-300'
                : 'text-white/70 hover:bg-white/5 hover:text-white',
            )}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Productivity</span>
          </button>

          <button
            onClick={() => handleViewChange('templates')}
            className={cn(
              'flex w-full items-center gap-3 rounded-6 px-3 py-2 text-sm transition',
              activeView === 'templates'
                ? 'bg-brand-500/20 text-brand-300'
                : 'text-white/70 hover:bg-white/5 hover:text-white',
            )}
          >
            <Sparkles className="h-4 w-4" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => handleViewChange('settings')}
            className={cn(
              'flex w-full items-center gap-3 rounded-6 px-3 py-2 text-sm transition',
              activeView === 'settings'
                ? 'bg-brand-500/20 text-brand-300'
                : 'text-white/70 hover:bg-white/5 hover:text-white',
            )}
          >
            <SettingsIcon className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>

        <div className="pt-4">
          <p className="px-1 text-xs font-semibold uppercase tracking-wide text-white/40">Filters & Labels</p>
          <button
            onClick={() => handleViewChange('filters')}
            className={cn(
              'mt-2 flex w-full items-center gap-3 rounded-6 px-3 py-2 text-sm transition',
              activeView === 'filters'
                ? 'bg-brand-500/20 text-brand-300'
                : 'text-white/70 hover:bg-white/5 hover:text-white',
            )}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>

          <button
            onClick={() => handleViewChange('labels')}
            className={cn(
              'flex w-full items-center gap-3 rounded-6 px-3 py-2 text-sm transition',
              activeView === 'labels'
                ? 'bg-brand-500/20 text-brand-300'
                : 'text-white/70 hover:bg-white/5 hover:text-white',
            )}
          >
            <Tags className="h-4 w-4" />
            <span>Labels</span>
          </button>
        </div>

        <div className="pt-6">
          <div className="flex items-center justify-between px-1 py-2">
            <button
              onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
              className="flex flex-1 items-center justify-between text-xs font-semibold uppercase tracking-wide text-white/50 hover:text-white/70"
            >
              <span>Projects</span>
              {isProjectsExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="ml-2 rounded-6 border border-white/10 p-1 text-white/50 transition hover:text-white"
              aria-label="Create project"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {isProjectsExpanded && (
            <div className="mt-1 space-y-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-6 px-3 py-2 text-sm transition',
                    activeView === 'project' && 'bg-brand-500/20 text-brand-300',
                    'text-white/70 hover:bg-white/5 hover:text-white',
                  )}
                >
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="truncate">{project.name}</span>
                </button>
              ))}

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => setIsCreateProjectOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add project
              </Button>
            </div>
          )}
        </div>
      </nav>
      <CreateProjectModal isOpen={isCreateProjectOpen} onClose={() => setIsCreateProjectOpen(false)} />
    </aside>
  );
};
