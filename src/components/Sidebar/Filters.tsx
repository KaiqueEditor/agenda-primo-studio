import React from 'react';
import { Search, CalendarDays, BarChart, List, LayoutGrid, ChevronRight, Moon, Sun, Plus, Users, Settings, Hash, FileText, ChevronDown, LayoutPanelLeft } from 'lucide-react';
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
      <aside className="sidebar sidebar-collapsed" style={{ width: '64px', background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}>
        <button className="sidebar-expand-btn" onClick={onToggleCollapse} title="Expandir menu" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '8px', marginBottom: '16px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-main)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          <LayoutPanelLeft size={20} />
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center' }}>
          {(['calendar', 'timeline', 'board', 'list'] as ViewMode[]).map((v) => {
            const isActive = viewMode === v;
            const icon = v === 'calendar' ? <CalendarDays size={20} /> : v === 'timeline' ? <BarChart size={20} /> : v === 'board' ? <LayoutGrid size={20} /> : <List size={20} />;
            return (
              <button
                key={v}
                onClick={() => onSetView(v)}
                title={v === 'calendar' ? 'Calendário' : v === 'timeline' ? 'Timeline' : v === 'board' ? 'Board' : 'Lista'}
                style={{
                  width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px',
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  border: 'none', outline: 'none', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {icon}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center' }}>
          <button onClick={onToggleDarkMode} title={darkMode ? 'Modo Claro' : 'Modo Escuro'} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={onOpenTeam} title="Gerenciar Equipe" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <Users size={20} />
          </button>
        </div>
      </aside>
    );
  }

  // Helper styles
  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
    padding: '0 12px',
    display: 'block'
  };

  const navItemStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    borderRadius: '8px',
    background: isActive ? 'var(--accent-light)' : 'transparent',
    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
    border: 'none',
    outline: 'none',
    fontWeight: isActive ? 600 : 500,
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease'
  });

  const listItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    fontSize: '14px',
    transition: 'background 0.15s ease'
  };

  return (
    <aside className="sidebar" style={{ width: '260px', background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      
      {/* 1. Top Header (User Info & Collapse) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: user ? 'space-between' : 'flex-end', padding: '16px 12px 12px' }}>
        {user && (
          <div 
            style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', borderRadius: '10px', transition: 'background 0.2s', flex: 1, marginRight: '4px' }} 
            onClick={onOpenProfile}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-main)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '13px', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)' }}>
              {getInitials(user.displayName)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.displayName}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1' }}>{user.role === 'admin' ? 'Administrador' : 'Visualizador'}</span>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </div>
        )}
        <button onClick={onToggleCollapse} style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'background 0.2s', flexShrink: 0 }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-main)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          <LayoutPanelLeft size={18} />
        </button>
      </div>

      {/* 3. AÇÕES RÁPIDAS */}
      <div style={{ padding: '0 12px 16px' }}>
        <button 
          onClick={onAddProjeto}
          style={{ width: '100%', padding: '10px 16px', background: 'var(--accent)', color: '#fff', borderRadius: '10px', border: 'none', outline: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', marginBottom: '12px', boxShadow: '0 2px 6px var(--accent-glow)', transition: 'all 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Plus size={16} /> Novo Projeto
        </button>
        <div style={{ background: 'var(--bg-main)', borderRadius: '10px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid transparent', transition: 'border 0.2s' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Buscar..."
            value={filters.search}
            onChange={(e) => onSetSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '14px', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* 4. Navigation Views */}
      <div style={{ padding: '0 12px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {(['calendar', 'timeline', 'board', 'list'] as ViewMode[]).map((v) => {
          const isActive = viewMode === v;
          const label = v === 'calendar' ? 'Calendário' : v === 'timeline' ? 'Timeline' : v === 'board' ? 'Board' : 'Lista';
          const icon = v === 'calendar' ? <CalendarDays size={18} /> : v === 'timeline' ? <BarChart size={18} /> : v === 'board' ? <LayoutGrid size={18} /> : <List size={18} />;
          
          return (
            <button key={v} onClick={() => onSetView(v)} style={navItemStyle(isActive)}
              onMouseEnter={(e) => !isActive && (e.currentTarget.style.background = 'var(--bg-main)')}
              onMouseLeave={(e) => !isActive && (e.currentTarget.style.background = 'transparent')}
            >
              {icon}
              {label}
            </button>
          );
        })}
      </div>

      {/* 5. PRODUÇÃO */}
      <div style={{ padding: '0 12px 20px' }}>
        <label style={sectionTitleStyle}>Produção</label>
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
                  padding: '8px 12px', border: 'none', outline: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '8px',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500, fontSize: '14px', transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-main)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: config.color, opacity: isActive ? 1 : 0.4, boxShadow: isActive ? `0 0 8px ${config.color}66` : 'none' }} />
                  {config.label}
                </div>
                <ChevronRight size={14} color={isActive ? "var(--text-secondary)" : "var(--border)"} />
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. ORGANIZAÇÃO */}
      <div style={{ padding: '0 12px 16px' }}>
        <label style={sectionTitleStyle}>Organização</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <button onClick={() => onOpenTagManager('canal')} style={listItemStyle} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-main)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <Hash size={18} color="var(--text-muted)" /> Canais
          </button>
          <button onClick={() => onOpenTagManager('formato')} style={listItemStyle} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-main)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <FileText size={18} color="var(--text-muted)" /> Formatos
          </button>
          <button onClick={onOpenTeam} style={listItemStyle} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-main)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <Users size={18} color="var(--text-muted)" /> Responsáveis
          </button>
        </div>
      </div>

      <div style={{ margin: 'auto 20px 16px', height: '1px', background: 'var(--border-subtle)' }} />

      {/* Footer */}
      <div style={{ padding: '0 12px 20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <button onClick={onOpenTeam} style={listItemStyle} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-main)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          <Users size={18} color="var(--text-muted)" /> Equipe
        </button>
        <button onClick={onToggleDarkMode} style={listItemStyle} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-main)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          <Settings size={18} color="var(--text-muted)" /> Configurações
        </button>
      </div>
    </aside>
  );
};
