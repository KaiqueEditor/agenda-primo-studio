import React from 'react';
import { Search, Filter, Calendar, CalendarDays, BarChart, List, Video, Mic } from 'lucide-react';
import { type FaseType, FASE_CONFIG, type FilterState, type ViewMode } from '../../types';
import { getAllCanais } from '../../data/projects';

interface Props {
  filters: FilterState;
  viewMode: ViewMode;
  onToggleFase: (fase: FaseType) => void;
  onSetCanal: (canal: string) => void;
  onSetSearch: (s: string) => void;
  onSetTipo: (t: 'all' | 'video' | 'podcast') => void;
  onSetView: (v: ViewMode) => void;
  onOpenTeam: () => void;
}

export const Sidebar: React.FC<Props> = ({
  filters, viewMode, onToggleFase, onSetCanal, onSetSearch, onSetTipo, onSetView, onOpenTeam
}) => {
  const canais = getAllCanais();
  const faseKeys: FaseType[] = ['planejamento', 'gravacao', 'edicao', 'publicacao'];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon"><Calendar size={22} /></span>
        <span className="logo-text">Agenda Primo.Studio</span>
      </div>

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

      <div className="sidebar-section" style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
        <button className="save-btn" style={{ width: '100%', background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} onClick={onOpenTeam}>
          👥 Gerenciar Equipe
        </button>
      </div>
    </aside>
  );
};
