import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useProjectStore } from '@/stores/useProjectStore';
import { useTaskStore } from '@/stores/useTaskStore';
import { useUIStore } from '@/stores/useUIStore';

export const AppLayout: React.FC = () => {
  const { load: loadProjects } = useProjectStore();
  const { load: loadTasks } = useTaskStore();
  const { isSidebarOpen } = useUIStore();

  useEffect(() => {
    loadProjects();
    loadTasks();
  }, [loadProjects, loadTasks]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      {isSidebarOpen && <Sidebar />}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
