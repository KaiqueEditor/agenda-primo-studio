import React from 'react';
import { differenceInDays, format } from 'date-fns';
import { type Projeto, FASE_CONFIG, type FaseType } from '../../types';

interface Props {
  projetos: Projeto[];
  onSelect: (p: Projeto) => void;
}

export const TimelineView: React.FC<Props> = ({ projetos, onSelect }) => {
  // Find global date range
  const allDates: Date[] = [];
  projetos.forEach((p) => {
    if (p.fases.planejamento?.inicio) allDates.push(p.fases.planejamento.inicio);
    if (p.fases.planejamento?.fim) allDates.push(p.fases.planejamento.fim);
    if (p.fases.gravacao?.inicio) allDates.push(p.fases.gravacao.inicio);
    if (p.fases.gravacao?.fim) allDates.push(p.fases.gravacao.fim);
    if (p.fases.edicao?.inicio) allDates.push(p.fases.edicao.inicio);
    if (p.fases.edicao?.fim) allDates.push(p.fases.edicao.fim);
    if (p.fases.publicacao?.data) allDates.push(p.fases.publicacao.data);
  });

  if (allDates.length === 0) return <div className="empty-state">Nenhum projeto com data encontrado</div>;

  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
  const totalDays = differenceInDays(maxDate, minDate) || 1;

  const getPos = (date: Date) => ((differenceInDays(date, minDate) / totalDays) * 100);
  const getWidth = (start: Date, end: Date) => Math.max(((differenceInDays(end, start) / totalDays) * 100), 1.5);

  const faseOrder: FaseType[] = ['planejamento', 'gravacao', 'edicao', 'publicacao'];

  // Generate month markers
  const months: { label: string; pos: number }[] = [];
  const cur = new Date(minDate);
  cur.setDate(1);
  while (cur <= maxDate) {
    const pos = getPos(cur);
    if (pos >= 0 && pos <= 100) {
      months.push({ label: format(cur, 'MMM'), pos });
    }
    cur.setMonth(cur.getMonth() + 1);
  }

  return (
    <div className="timeline-container">
      <div className="timeline-header-row">
        <div className="timeline-label-col">Projeto</div>
        <div className="timeline-bar-col">
          <div className="timeline-months">
            {months.map((m, i) => (
              <span key={i} className="month-marker" style={{ left: `${m.pos}%` }}>{m.label}</span>
            ))}
          </div>
        </div>
      </div>
      {projetos.map((projeto) => (
        <div key={projeto.id} className="timeline-row" onClick={() => onSelect(projeto)}>
          <div className="timeline-label-col">
            <span className="tl-title">{projeto.titulo}</span>
          </div>
          <div className="timeline-bar-col">
            {faseOrder.map((fase) => {
              const config = FASE_CONFIG[fase];
              if (fase === 'publicacao') {
                if (!projeto.fases.publicacao?.data) return null;
                const pos = getPos(projeto.fases.publicacao.data);
                return (
                  <div
                    key={fase}
                    className="tl-bar tl-diamond"
                    style={{ left: `${pos}%`, background: config.color }}
                    title={`Publicação: ${format(projeto.fases.publicacao.data, 'dd/MM')}`}
                  />
                );
              }
              const faseData = projeto.fases[fase];
              if (!faseData || !faseData.inicio || !faseData.fim) return null;
              const left = getPos(faseData.inicio);
              const width = getWidth(faseData.inicio, faseData.fim);
              return (
                <div
                  key={fase}
                  className="tl-bar"
                  style={{ left: `${left}%`, width: `${width}%`, background: config.color }}
                  title={`${config.label}: ${format(faseData.inicio, 'dd/MM')} → ${format(faseData.fim, 'dd/MM')}`}
                />
              );
            })}
          </div>
        </div>
      ))}
      <div className="timeline-legend">
        {faseOrder.map((f) => (
          <span key={f} className="legend-item">
            <span className="legend-dot" style={{ background: FASE_CONFIG[f].color }} />
            {FASE_CONFIG[f].label}
          </span>
        ))}
      </div>
    </div>
  );
};
