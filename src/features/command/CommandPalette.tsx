import { useState, useEffect, useMemo } from 'react';
import { Search, Inbox, Calendar, FolderKanban, Filter, Tags, Hash } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useUIStore } from '@/stores/useUIStore';
import { useProjectStore } from '@/stores/useProjectStore';
import { useTaskStore } from '@/stores/useTaskStore';
import { useLabelStore } from '@/stores/useLabelStore';
import { useFilterStore } from '@/stores/useFilterStore';
import { useNavigate } from 'react-router-dom';
import { globalSearch, type SearchResult } from '@/lib/search';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, closeCommandPalette, setActiveView, setSelectedProjectId } = useUIStore();
  const { projects } = useProjectStore();
  const { tasks } = useTaskStore();
  const { labels } = useLabelStore();
  const { filters } = useFilterStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleNavigate = (view: 'inbox' | 'today' | 'upcoming' | 'filters' | 'labels') => {
    setActiveView(view);
    navigate(`/${view}`);
    closeCommandPalette();
  };

  const handleProjectNavigate = (projectId: string) => {
    setActiveView('project');
    setSelectedProjectId(projectId);
    navigate(`/project/${projectId}`);
    closeCommandPalette();
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'project') {
      handleProjectNavigate(result.id);
      return;
    }

    if (result.type === 'label') {
      setActiveView('labels');
      navigate('/labels');
      closeCommandPalette();
      return;
    }

    if (result.type === 'filter') {
      setActiveView('filters');
      navigate('/filters');
      closeCommandPalette();
      return;
    }

    if (result.type === 'task') {
      const task = result.item;
      if ('projectId' in task && task.projectId) {
        handleProjectNavigate(task.projectId);
      } else {
        handleNavigate('inbox');
      }
      return;
    }
  };

  const searchResults = useMemo(() => {
    if (!query) return [];
    return globalSearch(query, tasks, projects, labels, filters);
  }, [query, tasks, projects, labels, filters]);

  const showQuickNav = !query || searchResults.length === 0;
  const quickProjects = projects.slice(0, 5);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isCommandPaletteOpen) {
          closeCommandPalette();
        } else {
          useUIStore.getState().toggleCommandPalette();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, closeCommandPalette]);

  return (
    <Modal isOpen={isCommandPaletteOpen} onClose={closeCommandPalette} className="max-w-2xl">
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-6 border border-white/10 bg-white/5 px-3 py-2">
          <Search className="h-5 w-5 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or jump to..."
            className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
            autoFocus
          />
        </div>

        {showQuickNav && (
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/40">
              Quick navigation
            </div>

            <button
              onClick={() => handleNavigate('inbox')}
              className="flex w-full items-center gap-3 rounded-6 px-3 py-2 text-left transition hover:bg-white/5"
            >
            <Inbox className="h-5 w-5 text-white/60" />
            <span className="text-sm text-white">Inbox</span>
          </button>

          <button
            onClick={() => handleNavigate('today')}
            className="flex w-full items-center gap-3 rounded-6 px-3 py-2 text-left transition hover:bg-white/5"
          >
            <Calendar className="h-5 w-5 text-white/60" />
            <span className="text-sm text-white">Today</span>
          </button>

          <button
            onClick={() => handleNavigate('upcoming')}
            className="flex w-full items-center gap-3 rounded-6 px-3 py-2 text-left transition hover:bg-white/5"
          >
            <Calendar className="h-5 w-5 text-white/60" />
            <span className="text-sm text-white">Upcoming</span>
          </button>

          <button
            onClick={() => handleNavigate('filters')}
            className="flex w-full items-center gap-3 rounded-6 px-3 py-2 text-left transition hover:bg-white/5"
          >
            <Filter className="h-5 w-5 text-white/60" />
            <span className="text-sm text-white">Filters</span>
          </button>

          <button
            onClick={() => handleNavigate('labels')}
            className="flex w-full items-center gap-3 rounded-6 px-3 py-2 text-left transition hover:bg-white/5"
          >
            <Tags className="h-5 w-5 text-white/60" />
            <span className="text-sm text-white">Labels</span>
          </button>
        </div>
        )}

        {query && searchResults.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/40">
              Search Results ({searchResults.length})
            </div>

            {searchResults.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className="flex w-full items-center gap-3 rounded-6 px-3 py-2 text-left transition hover:bg-white/5"
              >
                {result.type === 'task' && <Hash className="h-5 w-5 text-white/60" />}
                {result.type === 'project' && <FolderKanban className="h-5 w-5 text-white/60" />}
                {result.type === 'label' && <Tags className="h-5 w-5 text-white/60" />}
                {result.type === 'filter' && <Filter className="h-5 w-5 text-white/60" />}
                
                <div className="flex-1">
                  <p className="text-sm text-white">{result.title}</p>
                  {result.subtitle && (
                    <p className="text-xs text-white/50 truncate">{result.subtitle}</p>
                  )}
                </div>

                {result.color && (
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: result.color }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {showQuickNav && quickProjects.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/40">
              Projects
            </div>

            {quickProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleProjectNavigate(project.id)}
                className="flex w-full items-center gap-3 rounded-6 px-3 py-2 text-left transition hover:bg-white/5"
              >
                <FolderKanban className="h-5 w-5 text-white/60" />
                <span className="text-sm text-white">{project.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
