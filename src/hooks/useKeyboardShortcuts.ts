import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/stores/useUIStore';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { openQuickAdd, toggleCommandPalette, setActiveView, closeCommandPalette } = useUIStore();

  useEffect(() => {
    let gPressed = false;
    let gTimer: ReturnType<typeof setTimeout>;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Cmd/Ctrl + K - Command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
        return;
      }

      // Escape - Close modals
      if (e.key === 'Escape') {
        closeCommandPalette();
        return;
      }

      // Don't trigger shortcuts when typing in inputs (except for Cmd+K and Escape)
      if (isInput) return;

      // Q - Quick add
      if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        openQuickAdd();
        return;
      }

      // / - Focus search (opens command palette)
      if (e.key === '/') {
        e.preventDefault();
        toggleCommandPalette();
        return;
      }

      // G key - Start navigation sequence
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        gPressed = true;
        
        // Reset after 1 second
        if (gTimer) clearTimeout(gTimer);
        gTimer = setTimeout(() => {
          gPressed = false;
        }, 1000);
        return;
      }

      // Navigation shortcuts (G then another key)
      if (gPressed) {
        e.preventDefault();
        gPressed = false;
        if (gTimer) clearTimeout(gTimer);

        switch (e.key.toLowerCase()) {
          case 'i':
            setActiveView('inbox');
            navigate('/inbox');
            break;
          case 't':
            setActiveView('today');
            navigate('/today');
            break;
          case 'u':
            setActiveView('upcoming');
            navigate('/upcoming');
            break;
          case 'f':
            setActiveView('filters');
            navigate('/filters');
            break;
          case 'l':
            setActiveView('labels');
            navigate('/labels');
            break;
          case 'p':
            setActiveView('productivity');
            navigate('/productivity');
            break;
        }
        return;
      }

      // Priority shortcuts (1-4)
      if (['1', '2', '3', '4'].includes(e.key)) {
        // This would work with selected tasks - for now just prevent default
        // In a full implementation, you'd track which task is selected
        const priorityMap: Record<string, 'p1' | 'p2' | 'p3' | 'p4'> = {
          '1': 'p1',
          '2': 'p2',
          '3': 'p3',
          '4': 'p4',
        };
        // Would update selected task: updateTask(selectedTaskId, { priority: priorityMap[e.key] });
        console.log(`Priority ${priorityMap[e.key]} shortcut triggered`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gTimer) clearTimeout(gTimer);
    };
  }, [navigate, openQuickAdd, toggleCommandPalette, setActiveView, closeCommandPalette]);
};
