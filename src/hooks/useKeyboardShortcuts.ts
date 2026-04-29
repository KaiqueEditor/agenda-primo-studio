import { useEffect } from 'react';
import type { ViewMode } from '../types';

interface KeyboardShortcutsProps {
  onAddProjeto: () => void;
  onOpenTeam: () => void;
  onSetView: (v: ViewMode) => void;
  onToggleSidebar: () => void;
}

export const useKeyboardShortcuts = ({
  onAddProjeto,
  onOpenTeam,
  onSetView,
  onToggleSidebar,
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;

      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          onAddProjeto();
          break;
        case 't':
          e.preventDefault();
          onOpenTeam();
          break;
        case '1':
          onSetView('calendar');
          break;
        case '2':
          onSetView('timeline');
          break;
        case '3':
          onSetView('list');
          break;
        case '4':
          onSetView('board');
          break;
        case 'b':
          e.preventDefault();
          onToggleSidebar();
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onAddProjeto, onOpenTeam, onSetView, onToggleSidebar]);
};
