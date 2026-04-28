import React from 'react';
import { Video, Mic, Users, Zap } from 'lucide-react';
import { type Projeto, FASE_CONFIG } from '../../types';
import { formatDate, getProjectProgress } from '../../utils/dateHelpers';

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

  return (
    <div className="list-container">
      {sorted.map((projeto) => {
        const progress = getProjectProgress(projeto);
        const isLive = projeto.fases.gravacao?.aoVivo;

        return (
          <div key={projeto.id} className="list-card" onClick={() => onSelect(projeto)}>
            <div className="list-card-left">
              <div className="list-info">
                <h3 className="list-title">{projeto.titulo}</h3>
                <div className="list-meta">
                  <span className="list-canal">
                    {projeto.tipo === 'video' ? <Video size={12} /> : <Mic size={12} />}
                    {projeto.canal}
                  </span>
                  {isLive && <span className="list-live"><Zap size={12} /> AO VIVO</span>}
                </div>
                <div className="list-casting">
                  <Users size={12} />
                  {projeto.casting.length > 0 ? projeto.casting.join(', ') : 'Sem casting'}
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
  );
};
