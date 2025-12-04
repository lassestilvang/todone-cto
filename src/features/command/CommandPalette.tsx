import { useState, useEffect } from 'react';
import { Search, Inbox, Calendar, FolderKanban } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useUIStore } from '@/stores/useUIStore';
import { useProjectStore } from '@/stores/useProjectStore';
import { useNavigate } from 'react-router-dom';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, closeCommandPalette, setActiveView, setSelectedProjectId } = useUIStore();
  const { projects } = useProjectStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleNavigate = (view: 'inbox' | 'today' | 'upcoming') => {
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

  const filteredProjects = query
    ? projects.filter((project) => project.name.toLowerCase().includes(query.toLowerCase()))
    : projects;

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
        </div>

        {filteredProjects.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/40">
              Projects
            </div>

            {filteredProjects.slice(0, 5).map((project) => (
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
