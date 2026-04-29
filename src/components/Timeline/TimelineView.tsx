import React from 'react';
import { differenceInDays, format } from 'date-fns';
import { type Projeto, FASE_CONFIG, type FaseType } from '../../types';

interface Props {
  projetos: Projeto[];
  onSelect: (p: Projeto) => void;
  loading?: boolean;
}

export const TimelineView: React.FC<Props> = ({ projetos, onSelect, loading }) => {
  // Filter out projects without any dates
  const withDates = projetos.filter(p => 
    p.fases.gravacao?.inicio || p.fases.edicao?.inicio || p.fases.publicacao?.data
  );
  // Find global date range
  const allDates: Date[] = [];
  withDates.forEach((p) => {
    if (p.fases.gravacao?.inicio) allDates.push(p.fases.gravacao.inicio);
    if (p.fases.gravacao?.fim) allDates.push(p.fases.gravacao.fim);
    if (p.fases.edicao?.inicio) allDates.push(p.fases.edicao.inicio);
    if (p.fases.edicao?.fim) allDates.push(p.fases.edicao.fim);
    if (p.fases.publicacao?.data) allDates.push(p.fases.publicacao.data);
  });

  if (loading) {
    return (
      <div className="timeline-container">
        <div className="timeline-header-row">
          <div className="timeline-label-col">Projeto</div>
          <div className="timeline-bar-col"></div>
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="timeline-row" style={{ cursor: 'default' }}>
            <div className="timeline-label-col">
              <div className="skeleton skeleton-text" style={{ width: '60%' }} />
            </div>
            <div className="timeline-bar-col">
              <div className="skeleton skeleton-text" style={{ width: `${Math.random() * 40 + 20}%`, left: `${Math.random() * 20}%`, position: 'absolute' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (allDates.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M21 5l-4 4-2-2"/></svg>
        </div>
        <div>
          <h3>Nenhuma data na Timeline</h3>
          <p style={{ marginTop: '4px' }}>Adicione projetos com datas de gravação ou publicação</p>
        </div>
      </div>
    );
  }

  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
  const totalDays = differenceInDays(maxDate, minDate) || 1;

  const getPos = (date: Date) => ((differenceInDays(date, minDate) / totalDays) * 100);
  const getWidth = (start: Date, end: Date) => Math.max(((differenceInDays(end, start) / totalDays) * 100), 1.5);

  const faseOrder: FaseType[] = ['gravacao', 'edicao', 'publicacao'];

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
      {withDates.map((projeto) => (
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
