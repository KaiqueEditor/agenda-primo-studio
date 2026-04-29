import React from 'react';
import { type Projeto } from '../../types';
import { getCanalColor, getProjectStatus, getInitials, getAvatarColor, type StatusInfo } from '../../utils/displayHelpers';
import { formatDate } from '../../utils/dateHelpers';
import { Video, Mic, Zap, Calendar } from 'lucide-react';

interface Props {
  projetos: Projeto[];
  onSelect: (p: Projeto) => void;
  onUpdateStatus?: (projeto: Projeto, newStatus: string) => void;
}

interface Column {
  id: string;
  label: string;
  color: string;
  bg: string;
}

const COLUMNS: Column[] = [
  { id: 'a_definir', label: 'A Definir', color: '#8E8E93', bg: 'rgba(142,142,147,0.06)' },
  { id: 'agendado', label: 'Agendado', color: '#5AC8FA', bg: 'rgba(90,200,250,0.06)' },
  { id: 'em_gravacao', label: 'Em Gravação', color: '#007AFF', bg: 'rgba(0,122,255,0.06)' },
  { id: 'em_edicao', label: 'Em Edição', color: '#FF9500', bg: 'rgba(255,149,0,0.06)' },
  { id: 'pronto', label: 'Pronto', color: '#5856D6', bg: 'rgba(88,86,214,0.06)' },
  { id: 'publicado', label: 'Publicado', color: '#34C759', bg: 'rgba(52,199,89,0.06)' },
];

const getStatusId = (status: StatusInfo): string => {
  const map: Record<string, string> = {
    'A Definir': 'a_definir',
    'Agendado': 'agendado',
    'Em Gravação': 'em_gravacao',
    'Em Edição': 'em_edicao',
    'Pronto': 'pronto',
    'Publicado': 'publicado',
  };
  return map[status.label] || 'a_definir';
};

export const BoardView: React.FC<Props> = ({ projetos, onSelect }) => {
  const grouped = COLUMNS.map(col => ({
    ...col,
    projetos: projetos.filter(p => getStatusId(getProjectStatus(p)) === col.id),
  }));

  return (
    <div className="board-container">
      {grouped.map(col => (
        <div key={col.id} className="board-column" style={{ '--col-color': col.color, '--col-bg': col.bg } as React.CSSProperties}>
          <div className="board-column-header">
            <span className="board-col-dot" style={{ background: col.color }} />
            <span className="board-col-title">{col.label}</span>
            <span className="board-col-count">{col.projetos.length}</span>
          </div>
          <div className="board-column-body">
            {col.projetos.map(projeto => {
              const canalColor = getCanalColor(projeto.canal);
              const isLive = projeto.fases.gravacao?.aoVivo;
              const pubDate = projeto.fases.publicacao?.data;

              return (
                <div key={projeto.id} className="board-card" onClick={() => onSelect(projeto)}>
                  <div className="board-card-header">
                    <span className="board-canal-chip" style={{ background: canalColor.bg, color: canalColor.text, borderColor: canalColor.border }}>
                      {projeto.tipo === 'video' ? <Video size={10} /> : <Mic size={10} />}
                      {Array.isArray(projeto.canal) ? projeto.canal[0] : projeto.canal}
                    </span>
                    {isLive && <span className="board-live"><Zap size={10} /> LIVE</span>}
                  </div>
                  <h4 className="board-card-title">{projeto.titulo}</h4>
                  {pubDate && (
                    <div className="board-card-date">
                      <Calendar size={11} />
                      {formatDate(pubDate, 'dd MMM')}
                    </div>
                  )}
                  {(projeto.responsavel?.length || projeto.casting.length > 0) && (
                    <div className="board-card-people">
                      {[...(projeto.responsavel || []), ...projeto.casting].slice(0, 4).map(name => (
                        <span key={name} className="board-avatar" style={{ background: getAvatarColor(name) }} title={name}>
                          {getInitials(name)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {col.projetos.length === 0 && (
              <div className="board-empty">Nenhum projeto</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
