import React from 'react';
import { type Projeto, type FaseType, FASE_CONFIG } from '../../types';
import { getCanalColor, getInitials, getAvatarColor } from '../../utils/displayHelpers';
import { formatDate } from '../../utils/dateHelpers';
import { Video, Mic, Calendar, Users, Zap } from 'lucide-react';
import { isSameDay, isBefore, isAfter } from 'date-fns';

interface Props {
  projetos: Projeto[];
  onSelect: (p: Projeto) => void;
  loading?: boolean;
}

type BoardColumn = {
  fase: FaseType | 'sem_fase' | 'concluido';
  label: string;
  color: string;
  bg: string;
  description: string;
};

const BOARD_COLS: BoardColumn[] = [
  { fase: 'sem_fase',   label: 'A Definir',   color: '#8E8E93', bg: 'rgba(142,142,147,0.06)', description: 'Sem datas definidas' },
  { fase: 'gravacao',   label: 'Gravação',    color: '#007AFF', bg: 'rgba(0,122,255,0.06)',   description: 'Em fase de gravação' },
  { fase: 'edicao',     label: 'Edição',      color: '#FF9500', bg: 'rgba(255,149,0,0.06)',   description: 'Em fase de edição' },
  { fase: 'publicacao', label: 'Publicação',  color: '#34C759', bg: 'rgba(52,199,89,0.06)',   description: 'Pronto para publicar' },
  { fase: 'concluido',  label: 'Publicado',   color: '#5856D6', bg: 'rgba(88,86,214,0.06)',   description: 'Já publicado' },
];

/** Determine which board columns this project belongs to based on dates */
function getBoardColsForProject(p: Projeto): Array<BoardColumn['fase']> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const grav = p.fases.gravacao;
  const edit = p.fases.edicao;
  const pub  = p.fases.publicacao;

  // 1. Concluído: passed publication date
  if (pub?.data && isBefore(pub.data, today) && !isSameDay(pub.data, today)) {
    return ['concluido'];
  }

  const cols: Array<BoardColumn['fase']> = [];

  if (grav?.inicio || grav?.fim) cols.push('gravacao');
  if (edit?.inicio || edit?.fim) cols.push('edicao');
  if (pub?.data) cols.push('publicacao');

  if (cols.length === 0) cols.push('sem_fase');

  return cols;
}

function getNextDate(p: Projeto): { label: string; date: Date } | null {
  const now = new Date();
  const grav = p.fases.gravacao;
  const edit = p.fases.edicao;
  const pub  = p.fases.publicacao;
  if (grav?.inicio && isAfter(grav.inicio, now)) return { label: 'Grav.', date: grav.inicio };
  if (edit?.inicio && isAfter(edit.inicio, now)) return { label: 'Edição', date: edit.inicio };
  if (pub?.data && isAfter(pub.data, now))        return { label: 'Pub.',  date: pub.data };
  if (pub?.data)                                  return { label: 'Pub.',  date: pub.data };
  return null;
}

export const BoardView: React.FC<Props> = ({ projetos, onSelect, loading }) => {
  const columns = BOARD_COLS.map(col => ({
    ...col,
    items: projetos.filter(p => getBoardColsForProject(p).includes(col.fase)),
  }));

  if (loading) {
    return (
      <div className="board-container">
        {BOARD_COLS.map(col => (
          <div key={col.fase} className="board-column" style={{ '--col-color': col.color } as React.CSSProperties}>
            <div className="board-column-header">
              <span className="board-col-dot" style={{ background: col.color }} />
              <span className="board-col-title">{col.label}</span>
            </div>
            <div className="board-column-body">
              {[1, 2].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: '100px' }} />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="board-container">
      {columns.map(col => (
        <div
          key={col.fase}
          className="board-column"
          style={{ '--col-color': col.color, '--col-bg': col.bg } as React.CSSProperties}
        >
          {/* Column header */}
          <div className="board-column-header">
            <div className="board-col-left">
              <span className="board-col-dot" style={{ background: col.color }} />
              <div>
                <span className="board-col-title">{col.label}</span>
                <span className="board-col-desc">{col.description}</span>
              </div>
            </div>
            <span className="board-col-count" style={{ background: col.color + '22', color: col.color }}>
              {col.items.length}
            </span>
          </div>

          {/* Cards */}
          <div className="board-column-body">
            {col.items.map(projeto => {
              const canalColor = getCanalColor(projeto.canal);
              const isLive = projeto.fases.gravacao?.aoVivo;
              const nextDate = getNextDate(projeto);
              const canal = Array.isArray(projeto.canal) ? projeto.canal.join(' + ') : projeto.canal;
              const colFase = col.fase as FaseType;
              const faseConfig = FASE_CONFIG[colFase as FaseType];
              
              // We want to show the specific date for THIS column
              let columnSpecificDate = nextDate;
              if (colFase === 'gravacao' && projeto.fases.gravacao?.inicio) columnSpecificDate = { label: 'Grav.', date: projeto.fases.gravacao.inicio };
              if (colFase === 'edicao' && projeto.fases.edicao?.inicio) columnSpecificDate = { label: 'Edição', date: projeto.fases.edicao.inicio };
              if (colFase === 'publicacao' && projeto.fases.publicacao?.data) columnSpecificDate = { label: 'Pub.', date: projeto.fases.publicacao.data };

              return (
                <div key={projeto.id} className="board-card" onClick={() => onSelect(projeto)}>
                  {/* Canal chip + live */}
                  <div className="board-card-header">
                    <span
                      className="board-canal-chip"
                      style={{ background: canalColor.bg, color: canalColor.text, borderColor: canalColor.border }}
                    >
                      {projeto.tipo === 'video' ? <Video size={10} /> : <Mic size={10} />}
                      {canal}
                    </span>
                    {isLive && (
                      <span className="board-live"><Zap size={10} /> LIVE</span>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="board-card-title">{projeto.titulo}</h4>

                  {/* Phase progress dots */}
                  {faseConfig && (
                    <div className="board-phase-row">
                      {(['gravacao', 'edicao', 'publicacao'] as FaseType[]).map(f => {
                        const fc = FASE_CONFIG[f];
                        const active = f === colFase;
                        const done = (
                          (f === 'gravacao' && (colFase === 'edicao' || colFase === 'publicacao' || colFase === 'concluido' as any)) ||
                          (f === 'edicao' && (colFase === 'publicacao' || colFase === 'concluido' as any)) ||
                          (f === 'publicacao' && colFase === 'concluido' as any)
                        );
                        return (
                          <span key={f} className="board-phase-step">
                            <span
                              className="board-phase-dot"
                              style={{
                                background: active ? fc.color : done ? fc.color : 'var(--border)',
                                opacity: done ? 0.5 : 1,
                                transform: active ? 'scale(1.3)' : 'scale(1)',
                              }}
                            />
                            <span className="board-phase-label" style={{ color: active ? fc.color : 'var(--text-muted)' }}>
                              {fc.label}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Next date */}
                  {columnSpecificDate && (
                    <div className="board-card-date">
                      <Calendar size={11} />
                      {columnSpecificDate.label} {formatDate(columnSpecificDate.date, 'dd/MM')}
                    </div>
                  )}

                  {/* People */}
                  {(projeto.responsavel?.length || projeto.casting.length > 0) && (
                    <div className="board-card-footer">
                      <Users size={11} style={{ color: 'var(--text-muted)' }} />
                      <div className="board-card-people">
                        {[...(projeto.responsavel || []), ...projeto.casting].slice(0, 5).map(name => (
                          <span
                            key={name}
                            className="board-avatar"
                            style={{ background: getAvatarColor(name) }}
                            title={name}
                          >
                            {getInitials(name)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {col.items.length === 0 && (
              <div className="board-empty">
                <span>Nenhum projeto</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
