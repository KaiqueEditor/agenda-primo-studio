import React from 'react';
import { Search, Filter, CalendarDays, BarChart, List, Video, Mic, Users, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
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
  onSetView: (v: ViewMode) => void;
  onOpenTeam: () => void;
  onToggleCollapse: () => void;
  onSignOut: () => void;
}

export const Sidebar: React.FC<Props> = ({
  filters, viewMode, collapsed, user, onToggleFase, onSetCanal, onSetSearch, onSetTipo, onSetView, onOpenTeam, onToggleCollapse, onSignOut
}) => {
  const canais = [
    'O Primo Rico',
    'Você Mais Rico',
    'PrimoCast',
    'Finclass',
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
          {(['calendar', 'timeline', 'list'] as ViewMode[]).map((v) => (
            <button
              key={v}
              className={`collapsed-icon-btn ${viewMode === v ? 'active' : ''}`}
              onClick={() => onSetView(v)}
              title={v === 'calendar' ? 'Calendário' : v === 'timeline' ? 'Timeline' : 'Lista'}
            >
              {v === 'calendar' ? <CalendarDays size={18} /> : v === 'timeline' ? <BarChart size={18} /> : <List size={18} />}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 'auto' }}>
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
          {(['calendar', 'timeline', 'list'] as ViewMode[]).map((v) => (
            <button
              key={v}
              className={`view-btn ${viewMode === v ? 'active' : ''}`}
              onClick={() => onSetView(v)}
            >
              {v === 'calendar' ? <CalendarDays size={14} /> : v === 'timeline' ? <BarChart size={14} /> : <List size={14} />}
              <span>{v === 'calendar' ? 'Calendário' : v === 'timeline' ? 'Timeline' : 'Lista'}</span>
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

      <div className="sidebar-section" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <button className="sidebar-team-btn" onClick={onOpenTeam}>
          <Users size={16} /> Gerenciar Equipe
        </button>
      </div>
    </aside>
  );
};
