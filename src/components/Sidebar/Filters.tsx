import React from 'react';
import { Search, CalendarDays, BarChart, List, LayoutGrid, ChevronRight, Moon, Sun, Plus, Users, Settings, Hash, FileText, ChevronDown, ChevronsLeft } from 'lucide-react';
import { type FaseType, FASE_CONFIG, type FilterState, type ViewMode } from '../../types';
import type { AppUser } from '../../hooks/useAuth';
import { getInitials } from '../../utils/displayHelpers';
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
  onAddProjeto?: () => void;
}

export const Sidebar: React.FC<Props> = ({
  filters, viewMode, collapsed, user, onToggleFase, onSetSearch, onSetView, onOpenTeam, onToggleCollapse, darkMode, onToggleDarkMode, onOpenProfile, onOpenTagManager, onAddProjeto
}) => {
  const faseKeys: FaseType[] = ['gravacao', 'edicao', 'publicacao'];

  if (collapsed) {
    return (
      <aside className="sidebar sidebar-collapsed">
        <button className="sidebar-expand-btn" onClick={onToggleCollapse} title="Expandir menu">
          <ChevronRight size={18} />
        </button>
        <div className="sidebar-collapsed-icons">
          {(['calendar', 'timeline', 'board', 'list'] as ViewMode[]).map((v) => (
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
    <aside className="sidebar" style={{ width: '260px', background: '#ffffff', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* 1. Primo Studio Logo & Collapse */}
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '28px', height: '28px', background: '#0D6EFD', borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
            P
          </div>
          <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Primo Studio</span>
        </div>
        <button onClick={onToggleCollapse} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <ChevronsLeft size={16} />
        </button>
      </div>

      {/* 2. User Info */}
      {user && (
        <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={onOpenProfile}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#A855F7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '14px' }}>
              {getInitials(user.displayName)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{user.displayName}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.role === 'admin' ? 'Administrador' : 'Visualizador'}</span>
            </div>
          </div>
          <ChevronDown size={14} color="var(--text-secondary)" />
        </div>
      )}

      {/* 3. AÇÕES RÁPIDAS */}
      <div style={{ padding: '0 20px 12px' }}>
        <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>
          Ações Rápidas
        </label>
        <button 
          onClick={onAddProjeto}
          style={{ width: '100%', padding: '8px 16px', background: '#0D6EFD', color: '#fff', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', marginBottom: '8px' }}
        >
          <Plus size={16} /> Novo Projeto
        </button>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={14} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Buscar"
            value={filters.search}
            onChange={(e) => onSetSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '14px', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* 4. Navigation Views */}
      <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {(['calendar', 'timeline', 'board', 'list'] as ViewMode[]).map((v) => {
          const isActive = viewMode === v;
          const label = v === 'calendar' ? 'Calendário' : v === 'timeline' ? 'Timeline' : v === 'board' ? 'Board' : 'Lista';
          const icon = v === 'calendar' ? <CalendarDays size={16} /> : v === 'timeline' ? <BarChart size={16} /> : v === 'board' ? <LayoutGrid size={16} /> : <List size={16} />;
          return (
            <button
              key={v}
              onClick={() => onSetView(v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', borderRadius: '6px',
                background: isActive ? '#EFF6FF' : 'transparent',
                color: isActive ? '#0D6EFD' : 'var(--text-secondary)',
                border: 'none', borderLeft: isActive ? '3px solid #0D6EFD' : '3px solid transparent',
                fontWeight: isActive ? 600 : 500, fontSize: '14px', cursor: 'pointer', textAlign: 'left'
              }}
            >
              {icon}
              {label}
            </button>
          );
        })}
      </div>

      {/* 5. PRODUÇÃO */}
      <div style={{ padding: '0 20px 12px' }}>
        <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
          Produção
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {faseKeys.map((fase) => {
            const config = FASE_CONFIG[fase];
            const isActive = filters.fases.includes(fase);
            return (
              <button
                key={fase}
                onClick={() => onToggleFase(fase)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '4px 0', border: 'none', background: 'transparent', cursor: 'pointer',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500, fontSize: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: config.color, opacity: isActive ? 1 : 0.5 }} />
                  {config.label}
                </div>
                <ChevronRight size={14} color="var(--text-secondary)" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. ORGANIZAÇÃO */}
      <div style={{ padding: '0 20px 12px' }}>
        <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
          Organização
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <button onClick={() => onOpenTagManager('canal')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '14px' }}>
            <Hash size={16} /> Canais
          </button>
          <button onClick={() => onOpenTagManager('formato')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '14px' }}>
            <FileText size={16} /> Formatos
          </button>
          <button onClick={onOpenTeam} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '14px' }}>
            <Users size={16} /> Responsáveis
          </button>
        </div>
      </div>

      <div style={{ margin: '0 20px 12px', height: '1px', background: 'var(--border-subtle)' }} />

      {/* Footer */}
      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: 'auto' }}>
        <button onClick={onOpenTeam} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '14px' }}>
          <Users size={16} /> Equipe
        </button>
        <button onClick={onToggleDarkMode} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '14px' }}>
          <Settings size={16} /> Configurações
        </button>
      </div>
    </aside>
  );
};
