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
}

export const ProjectList: React.FC<Props> = ({ projetos, onSelect }) => {
  const sorted = [...projetos].sort((a, b) => {
    const timeA = a.fases.publicacao?.data?.getTime() || Infinity;
    const timeB = b.fases.publicacao?.data?.getTime() || Infinity;
    return timeA - timeB;
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

  return (
    <div className="list-container">
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
            const canalColor = getCanalColor(projeto.canal);
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
                      <span className="list-canal-chip" style={{ background: canalColor.bg, color: canalColor.text, borderColor: canalColor.border }}>
                        {projeto.tipo === 'video' ? <Video size={11} /> : <Mic size={11} />}
                        {Array.isArray(projeto.canal) ? projeto.canal.join(' + ') : projeto.canal}
                      </span>
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
  );
};
