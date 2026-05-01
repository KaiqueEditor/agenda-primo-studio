import React from 'react';
import { Search, CalendarDays, BarChart, List, Users, ChevronLeft, ChevronRight, LogOut, LayoutGrid, Moon, Sun, Plus, MonitorPlay } from 'lucide-react';
import { type FaseType, FASE_CONFIG, type FilterState, type ViewMode } from '../../types';
import type { AppUser } from '../../hooks/useAuth';
import { getInitials, getAvatarColor } from '../../utils/displayHelpers';
import type { TagCategory } from '../Modal/TagManagerModal';

interface Props {
  filters: FilterState;
  viewMode: ViewMode;
  collapsed: boolean;
  user: AppUser | null;
  onToggleFase: (fase: FaseType) => void;
  onSetCanal: (canal: string) => void;
  onSetSearch: (s: string) => void;
  onSetTipo: (t: string) => void;
  onSetResponsavel: (r: string) => void;
  onSetView: (v: ViewMode) => void;
  onOpenTeam: () => void;
  onToggleCollapse: () => void;
  onSignOut: () => void;
  teamMembers: string[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenProfile: () => void;
  onOpenTagManager: (category: TagCategory) => void;
  customFormatos: string[];
  customCanais: string[];
}

export const Sidebar: React.FC<Props> = ({
  filters, viewMode, collapsed, user, onToggleFase, onSetCanal, onSetSearch, onSetTipo, onSetResponsavel, onSetView, onOpenTeam, onToggleCollapse, onSignOut, teamMembers, darkMode, onToggleDarkMode, onOpenProfile, onOpenTagManager, customFormatos, customCanais
}) => {
  const formatoOptions = [...customFormatos].sort();
  const canalOptions = [...customCanais].sort();
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
      <div className="sidebar-header-row">
        <div className="sidebar-logo-container">
          <div className="sidebar-logo-icon">
            <MonitorPlay size={16} />
          </div>
          <span className="sidebar-logo-text">Primo.Studio</span>
        </div>
        <button className="sidebar-collapse-btn" onClick={onToggleCollapse} title="Recolher menu">
          <ChevronLeft size={16} />
        </button>
      </div>

      {user && (
        <div className="sidebar-user-card" onClick={onOpenProfile} title="Ver Perfil">
          <div className="sidebar-user-avatar" style={{ background: getAvatarColor(user.displayName) }}>
            {getInitials(user.displayName)}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user.displayName}</span>
            <span className="sidebar-user-role">{user.role === 'admin' ? 'Administrador' : 'Visualizador'}</span>
          </div>
          <button className="sidebar-logout-btn" onClick={(e) => { e.stopPropagation(); onSignOut(); }} title="Sair da conta">
            <LogOut size={14} />
          </button>
        </div>
      )}

      <div className="sidebar-nav-group">
        <label className="sidebar-section-title">Visualização</label>
        <div className="sidebar-segmented-control">
          {(['calendar', 'timeline', 'board', 'list'] as ViewMode[]).map((v) => (
            <button
              key={v}
              className={`segmented-btn ${viewMode === v ? 'active' : ''}`}
              onClick={() => onSetView(v)}
              title={v === 'calendar' ? 'Calendário' : v === 'timeline' ? 'Timeline' : v === 'board' ? 'Board' : 'Lista'}
            >
              {v === 'calendar' ? <CalendarDays size={14} /> : v === 'timeline' ? <BarChart size={14} /> : v === 'board' ? <LayoutGrid size={14} /> : <List size={14} />}
              <span>{v === 'calendar' ? 'Calend.' : v === 'timeline' ? 'Timeline' : v === 'board' ? 'Board' : 'Lista'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-nav-group">
        <div className="sidebar-search-box">
          <Search size={14} className="sidebar-search-icon" />
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Buscar projetos..."
            value={filters.search}
            onChange={(e) => onSetSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-nav-group">
        <label className="sidebar-section-title">Fases do Projeto</label>
        <div className="sidebar-fases-grid">
          {faseKeys.map((fase) => {
            const config = FASE_CONFIG[fase];
            const isActive = filters.fases.includes(fase);
            return (
              <button
                key={fase}
                className={`sidebar-fase-toggle ${isActive ? 'active' : ''}`}
                style={{ '--fase-color': config.color } as React.CSSProperties}
                onClick={() => onToggleFase(fase)}
              >
                <div className="fase-indicator" />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sidebar-nav-group">
        <div className="sidebar-label-row">
          <label className="sidebar-section-title">Formato</label>
          <button className="sidebar-add-btn" onClick={() => onOpenTagManager('formato')} title="Gerenciar formatos">
            <Plus size={14} />
          </button>
        </div>
        <select
          className="sidebar-select"
          value={filters.tipo}
          onChange={(e) => onSetTipo(e.target.value)}
        >
          <option value="all">Todos os formatos</option>
          {formatoOptions.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      <div className="sidebar-nav-group">
        <div className="sidebar-label-row">
          <label className="sidebar-section-title">Canal</label>
          <button className="sidebar-add-btn" onClick={() => onOpenTagManager('canal')} title="Gerenciar canais">
            <Plus size={14} />
          </button>
        </div>
        <select
          className="sidebar-select"
          value={filters.canal}
          onChange={(e) => onSetCanal(e.target.value)}
        >
          <option value="">Todos os canais</option>
          {canalOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="sidebar-nav-group">
        <div className="sidebar-label-row">
          <label className="sidebar-section-title">Responsável</label>
          <button className="sidebar-add-btn" onClick={() => onOpenTagManager('responsavel')} title="Gerenciar responsáveis">
            <Plus size={14} />
          </button>
        </div>
        <select
          className="sidebar-select"
          value={filters.responsavel}
          onChange={(e) => onSetResponsavel(e.target.value)}
        >
          <option value="">Todos</option>
          {[...teamMembers].sort().map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-footer-btn" onClick={onOpenTeam}>
          <Users size={15} /> Equipe
        </button>
        <button className="sidebar-footer-btn-icon" onClick={onToggleDarkMode} title={darkMode ? 'Modo Claro' : 'Modo Escuro'}>
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </aside>
  );
};
