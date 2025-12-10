import { useState, useEffect } from 'react';
import { Search, Bell, Command } from 'lucide-react';
import { useUIStore } from '@/stores/useUIStore';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/useAuthStore';

export const Header: React.FC = () => {
  const { openQuickAdd, toggleCommandPalette } = useUIStore();
  const { user, logout } = useAuthStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/10 bg-slate-900/80 p-4 backdrop-blur">
      <div className="flex flex-1 items-center gap-3 rounded-6 border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
        <Search className="h-4 w-4" />
        <input
          type="search"
          placeholder="Search tasks, projects, filters"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          onFocus={toggleCommandPalette}
        />
        <span className="flex items-center gap-1 text-xs text-white/40">
          <Command className="h-4 w-4" />
          K
        </span>
      </div>

      <Button variant="secondary" onClick={openQuickAdd}>
        + Quick add
      </Button>

      <button className="rounded-6 border border-white/10 p-2 text-white/70 transition hover:text-white">
        <Bell className="h-5 w-5" />
      </button>

      <div className="rounded-6 border border-white/10 bg-white/5 px-3 py-2 text-right text-xs text-white/60">
        <p className="text-sm font-semibold text-white">{user?.name ?? 'Guest'}</p>
        <p>{time.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
      </div>

      <button
        onClick={logout}
        className="rounded-6 border border-white/10 px-3 py-2 text-xs text-white/60 transition hover:bg-white/5"
      >
        Logout
      </button>
    </header>
  );
};
