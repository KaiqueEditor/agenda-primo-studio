import React from 'react';
import { Search, Filter, CalendarDays, BarChart, List, Video, Mic, Users, ChevronLeft, ChevronRight, LogOut, LayoutGrid, User, Moon, Sun } from 'lucide-react';
import { type FaseType, FASE_CONFIG, type FilterState, type ViewMode } from '../../types';
import type { AppUser } from '../../hooks/useAuth';
import { getInitials, getAvatarColor } from '../../utils/displayHelpers';

interface Props {
  filters: FilterState;
  viewMode: ViewMode;
  collapsed: boolean;
  user: AppUser | null;
  onToggleFase: (fase: FaseType) => void;
  onSetCanal: (canal: string) => void;
  onSetSearch: (s: string) => void;
  onSetTipo: (t: 'all' | 'video' | 'podcast') => void;
  onSetResponsavel: (r: string) => void;
  onSetView: (v: ViewMode) => void;
  onOpenTeam: () => void;
  onToggleCollapse: () => void;
  onSignOut: () => void;
  teamMembers: string[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Sidebar: React.FC<Props> = ({
  filters, viewMode, collapsed, user, onToggleFase, onSetCanal, onSetSearch, onSetTipo, onSetResponsavel, onSetView, onOpenTeam, onToggleCollapse, onSignOut, teamMembers, darkMode, onToggleDarkMode
}) => {
  const canais = [
    'O Primo Rico',
    'O Primo Rico + AGF',
    'Você Mais Rico',
    'Você Mais Rico + AGF',
    'PrimoCast',
    'Finclass',
    'AGF + Finclass',
    'Os Sócios Podcast',
    'Os Economistas',
    'G4 / PrimoCast',
  ];
  const faseKeys: FaseType[] = ['gravacao', 'edicao', 'publicacao'];

  if (collapsed) {
    return (
      <aside className="sidebar sidebar-collapsed">
        <button className="sidebar-expand-btn" onClick={onToggleCollapse} title="Expandir menu">
          <ChevronRight size={18} />
        </button>
        <div className="sidebar-collapsed-icons">
          {(['calendar', 'timeline', 'list', 'board'] as ViewMode[]).map((v) => (
            <button
              key={v}
              className={`collapsed-icon-btn ${viewMode === v ? 'active' : ''}`}
              onClick={() => onSetView(v)}
              title={v === 'calendar' ? 'Calendário' : v === 'timeline' ? 'Timeline' : v === 'board' ? 'Board' : 'Lista'}
            >
              {v === 'calendar' ? <CalendarDays size={18} /> : v === 'timeline' ? <BarChart size={18} /> : v === 'board' ? <LayoutGrid size={18} /> : <List size={18} />}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button className="collapsed-icon-btn" onClick={onToggleDarkMode} title={darkMode ? 'Modo Claro' : 'Modo Escuro'}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="collapsed-icon-btn" onClick={onOpenTeam} title="Gerenciar Equipe">
            <Users size={18} />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sidebar-logo">
          <span className="logo-text">Primo.Studio</span>
        </div>
        <button className="sidebar-collapse-btn" onClick={onToggleCollapse} title="Colapsar menu">
          <ChevronLeft size={16} />
        </button>
      </div>

      {user && (
        <div className="sidebar-user">
          <div className="user-avatar" style={{ background: getAvatarColor(user.displayName) }}>
            {getInitials(user.displayName)}
          </div>
          <div className="user-info">
            <span className="user-name">{user.displayName}</span>
            <span className="user-role">{user.role === 'admin' ? 'Admin' : 'Visualizador'}</span>
          </div>
          <button className="user-logout" onClick={onSignOut} title="Sair">
            <LogOut size={14} />
          </button>
        </div>
      )}

      <div className="sidebar-section">
        <label className="sidebar-label">Visualização</label>
        <div className="view-toggle">
          {(['calendar', 'timeline', 'list', 'board'] as ViewMode[]).map((v) => (
            <button
              key={v}
              className={`view-btn ${viewMode === v ? 'active' : ''}`}
              onClick={() => onSetView(v)}
            >
              {v === 'calendar' ? <CalendarDays size={14} /> : v === 'timeline' ? <BarChart size={14} /> : v === 'board' ? <LayoutGrid size={14} /> : <List size={14} />}
              <span>{v === 'calendar' ? 'Calend.' : v === 'timeline' ? 'Timeline' : v === 'board' ? 'Board' : 'Lista'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <label className="sidebar-label"><Search size={14} /> Buscar</label>
        <input
          type="text"
          className="sidebar-input"
          placeholder="Nome do projeto..."
          value={filters.search}
          onChange={(e) => onSetSearch(e.target.value)}
        />
      </div>

      <div className="sidebar-section">
        <label className="sidebar-label"><Filter size={14} /> Fases</label>
        <div className="fase-filters">
          {faseKeys.map((fase) => {
            const config = FASE_CONFIG[fase];
            const isActive = filters.fases.includes(fase);
            return (
              <button
                key={fase}
                className={`fase-filter-btn ${isActive ? 'active' : ''}`}
                style={{ '--fase-color': config.color, '--fase-bg': config.colorLight } as React.CSSProperties}
                onClick={() => onToggleFase(fase)}
              >
                <span className="fase-dot" />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="sidebar-section">
        <label className="sidebar-label">Tipo</label>
        <div className="tipo-toggle">
          {(['all', 'video', 'podcast'] as const).map((t) => (
            <button
              key={t}
              className={`tipo-btn ${filters.tipo === t ? 'active' : ''}`}
              onClick={() => onSetTipo(t)}
            >
              {t === 'all' ? 'Todos' : t === 'video' ? <><Video size={14} /> Vídeo</> : <><Mic size={14} /> Podcast</>}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <label className="sidebar-label">Canal</label>
        <select
          className="sidebar-select"
          value={filters.canal}
          onChange={(e) => onSetCanal(e.target.value)}
        >
          <option value="">Todos os canais</option>
          {canais.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="sidebar-section">
        <label className="sidebar-label"><User size={14} /> Responsável</label>
        <select
          className="sidebar-select"
          value={filters.responsavel}
          onChange={(e) => onSetResponsavel(e.target.value)}
        >
          <option value="">Todos</option>
          {teamMembers.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="sidebar-section" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="sidebar-team-btn" onClick={onOpenTeam} style={{ flex: 1 }}>
            <Users size={16} /> Equipe
          </button>
          <button className="sidebar-team-btn" onClick={onToggleDarkMode} style={{ width: 'auto', padding: '10px 12px' }} title={darkMode ? 'Modo Claro' : 'Modo Escuro'}>
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
};
