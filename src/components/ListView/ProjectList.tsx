import React from 'react';
import { Video, Mic, Zap, Calendar } from 'lucide-react';
import { type Projeto, FASE_CONFIG } from '../../types';
import { formatDate, getProjectProgress } from '../../utils/dateHelpers';
import { getCanalColor, getProjectStatus, getInitials, getAvatarColor } from '../../utils/displayHelpers';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  projetos: Projeto[];
  onSelect: (p: Projeto) => void;
  loading?: boolean;
  headerActions?: React.ReactNode;
}

export const ProjectList: React.FC<Props> = ({ projetos, onSelect, loading, headerActions }) => {
  const sorted = [...projetos].sort((a, b) => {
    const timeA = a.fases.publicacao?.data?.getTime() || Infinity;
    const timeB = b.fases.publicacao?.data?.getTime() || Infinity;
    if (timeA !== timeB) return timeA - timeB;
    return a.numero - b.numero; // secondary: by project number
  });

  // Group by month
  const groups: { label: string; projetos: Projeto[] }[] = [];
  const noDate: Projeto[] = [];

  sorted.forEach(p => {
    const pubDate = p.fases.publicacao?.data;
    if (!pubDate) {
      noDate.push(p);
      return;
    }
    const monthLabel = format(pubDate, 'MMMM yyyy', { locale: ptBR });
    const existing = groups.find(g => g.label === monthLabel);
    if (existing) {
      existing.projetos.push(p);
    } else {
      groups.push({ label: monthLabel, projetos: [p] });
    }
  });

  if (noDate.length > 0) {
    groups.push({ label: 'Sem data definida', projetos: noDate });
  }

  if (loading) {
    return (
      <div className="list-container">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="list-card">
            <div className="list-card-left" style={{ width: '60%' }}>
              <div className="skeleton skeleton-text" style={{ width: '40%', height: '20px', marginBottom: '8px' }} />
              <div className="skeleton skeleton-text" style={{ width: '20%' }} />
            </div>
            <div className="list-card-right">
              <div className="skeleton skeleton-text" style={{ width: '120px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projetos.length === 0) {
    return (
      <div className="list-view-container">
        {headerActions && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px 0', background: 'var(--bg-main)' }}>
            <div style={{ display: 'flex', gap: '12px' }}>{headerActions}</div>
          </div>
        )}
        <div className="list-view-content">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Calendar size={24} />
            </div>
            <div>
              <h3>Nenhum projeto encontrado</h3>
              <p style={{ marginTop: '4px' }}>Tente ajustar os filtros na barra lateral</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="list-view-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {headerActions && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px 0', background: 'var(--bg-main)' }}>
          <div style={{ display: 'flex', gap: '12px' }}>{headerActions}</div>
        </div>
      )}
      <div className="list-container" style={{ flex: 1, overflowY: 'auto' }}>
      {groups.map((group) => (
        <div key={group.label} className="list-group">
          <div className="list-group-header">
            <Calendar size={14} />
            <span>{group.label}</span>
            <span className="list-group-count">{group.projetos.length}</span>
          </div>
          {group.projetos.map((projeto) => {
            const progress = getProjectProgress(projeto);
            const isLive = projeto.fases.gravacao?.aoVivo;
            const status = getProjectStatus(projeto);

            return (
              <div key={projeto.id} className="list-card" onClick={() => onSelect(projeto)}>
                <div className="list-card-left">
                  <div className="list-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <h3 className="list-title" style={{ marginBottom: 0 }}>{projeto.titulo}</h3>
                      <span className="status-badge" style={{ background: status.bg, color: status.color }}>{status.label}</span>
                    </div>
                    <div className="list-meta">
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {(Array.isArray(projeto.canal) ? projeto.canal : (projeto.canal ? [projeto.canal] : [])).map(c => {
                          const cc = getCanalColor(c);
                          return (
                            <span key={c} className="list-canal-chip" style={{ background: cc.bg, color: cc.text, borderColor: cc.border }}>
                              {projeto.tipo === 'video' ? <Video size={11} /> : <Mic size={11} />}
                              {c}
                            </span>
                          );
                        })}
                        {isLive && <span className="list-live"><Zap size={12} /> AO VIVO</span>}
                      </div>
                      {projeto.casting.length > 0 && (
                        <div className="list-casting">
                          {projeto.casting.slice(0, 3).map(name => (
                            <span key={name} className="mini-avatar" style={{ background: getAvatarColor(name) }} title={name}>
                              {getInitials(name)}
                            </span>
                          ))}
                          {projeto.casting.length > 3 && (
                            <span className="mini-avatar-more">+{projeto.casting.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="list-card-right">
                  <div className="list-phases">
                    {(['gravacao', 'edicao', 'publicacao'] as const).map((fase) => {
                      const config = FASE_CONFIG[fase];
                      const data = fase === 'publicacao' ? projeto.fases.publicacao : projeto.fases[fase];
                      if (!data) return null;
                      
                      let dateStr = '';
                      if (fase === 'publicacao') {
                        const pubData = data as { data?: Date };
                        if (!pubData.data) return null;
                        dateStr = formatDate(pubData.data, 'dd/MM');
                      } else {
                        const start = (data as any).inicio;
                        const end = (data as any).fim;
                        if (!start || !end) return null;
                        dateStr = `${formatDate(start, 'dd/MM')} → ${formatDate(end, 'dd/MM')}`;
                      }

                      return (
                        <span key={fase} className="list-phase" style={{ color: config.color }}>
                          {config.label} {dateStr}
                        </span>
                      );
                    })}
                  </div>
                  <div className="list-progress">
                    <div className="list-progress-bar">
                      <div className="list-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="list-progress-pct">{progress}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      </div>
    </div>
  );
};
