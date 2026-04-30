import React, { useRef, useEffect, useState } from 'react';
import {
  differenceInDays, format, addDays,
  eachMonthOfInterval, isWithinInterval,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { type Projeto, FASE_CONFIG, type FaseType } from '../../types';
import { getCanalColor, getInitials, getAvatarColor } from '../../utils/displayHelpers';
import { Video, Mic, Zap } from 'lucide-react';

interface Props {
  projetos: Projeto[];
  onSelect: (p: Projeto) => void;
  loading?: boolean;
}

const ROW_HEIGHT = 52;
const DAY_W = 28; // px per day

export const TimelineView: React.FC<Props> = ({ projetos, onSelect, loading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const withDates = projetos
    .filter(p =>
      p.fases.gravacao?.inicio || p.fases.edicao?.inicio || p.fases.publicacao?.data
    )
    .sort((a, b) => a.numero - b.numero);


  // Collect all dates to build range
  const allDates: Date[] = [];
  withDates.forEach(p => {
    if (p.fases.gravacao?.inicio) allDates.push(p.fases.gravacao.inicio);
    if (p.fases.gravacao?.fim)    allDates.push(p.fases.gravacao.fim);
    if (p.fases.edicao?.inicio)   allDates.push(p.fases.edicao.inicio);
    if (p.fases.edicao?.fim)      allDates.push(p.fases.edicao.fim);
    if (p.fases.publicacao?.data) allDates.push(p.fases.publicacao.data);
  });

  // Scroll to today on mount
  useEffect(() => {
    if (scrollRef.current && allDates.length > 0) {
      const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
      const todayOffset = differenceInDays(new Date(), minDate) * DAY_W;
      const viewWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollLeft = Math.max(0, todayOffset - viewWidth / 2);
    }
  }, [projetos]);

  if (loading) {
    return (
      <div className="tl2-container">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="tl2-row">
            <div className="tl2-label-col">
              <div className="skeleton skeleton-text" style={{ width: '70%' }} />
              <div className="skeleton skeleton-text" style={{ width: '40%', marginTop: '4px' }} />
            </div>
            <div className="tl2-bars-area">
              <div className="skeleton" style={{ height: 20, width: `${80 + Math.random() * 80}px`, borderRadius: 6, marginLeft: `${Math.random() * 60}px` }} />
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5"/>
            <path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>
          </svg>
        </div>
        <div><h3>Nenhuma data na Timeline</h3></div>
      </div>
    );
  }

  const rawMin = new Date(Math.min(...allDates.map(d => d.getTime())));
  const rawMax = new Date(Math.max(...allDates.map(d => d.getTime())));
  // Pad by 14 days either side for breathing room
  const minDate = addDays(rawMin, -14);
  const maxDate = addDays(rawMax, 14);
  const totalDays = differenceInDays(maxDate, minDate) || 1;
  const totalWidth = totalDays * DAY_W;

  const dayToX = (date: Date) => differenceInDays(date, minDate) * DAY_W;

  // Month headers
  const months = eachMonthOfInterval({ start: minDate, end: maxDate });

  // Today marker
  const todayX = dayToX(new Date());
  const showToday = todayX >= 0 && todayX <= totalWidth;

  // Weekend shading: collect weekend day ranges
  const weekendStripes: { x: number; w: number }[] = [];
  let cur = new Date(minDate);
  while (cur <= maxDate) {
    const dow = cur.getDay();
    if (dow === 6) {
      // Saturday + Sunday block
      weekendStripes.push({ x: dayToX(cur), w: DAY_W * 2 });
    }
    cur = addDays(cur, 1);
  }

  const faseOrder: FaseType[] = ['gravacao', 'edicao', 'publicacao'];

  return (
    <div className="tl2-container">
      {/* Legend */}
      <div className="tl2-legend">
        {faseOrder.map(f => (
          <span key={f} className="tl2-legend-item">
            <span className="tl2-legend-dot" style={{ background: FASE_CONFIG[f].color }} />
            {FASE_CONFIG[f].label}
          </span>
        ))}
        <span className="tl2-legend-item">
          <span className="tl2-legend-dot tl2-diamond-mini" style={{ background: FASE_CONFIG.publicacao.color }} />
          Data de Publicação
        </span>
      </div>

      <div className="tl2-layout" ref={scrollRef}>
        <div style={{ display: 'flex', minWidth: 'max-content', minHeight: 'min-content' }}>
          {/* Fixed left: project labels */}
          <div className="tl2-labels-panel">
            {/* Header spacer */}
            <div className="tl2-labels-header">
              <span>Projeto</span>
            </div>
            {withDates.map(projeto => {
              const canalColor = getCanalColor(projeto.canal);
              const canal = Array.isArray(projeto.canal) ? projeto.canal.join(' + ') : projeto.canal;
              const isLive = projeto.fases.gravacao?.aoVivo;
              return (
                <div
                  key={projeto.id}
                  className="tl2-label-row"
                  style={{ height: ROW_HEIGHT }}
                  onClick={() => onSelect(projeto)}
                >
                  {/* Canal color accent */}
                  <span className="tl2-label-accent" style={{ background: canalColor.dot }} />
                  <div className="tl2-label-info">
                    <span className="tl2-label-title">{projeto.titulo}</span>
                    <div className="tl2-label-meta">
                      <span className="tl2-label-tipo">
                        {projeto.tipo === 'video' ? <Video size={10} /> : <Mic size={10} />}
                      </span>
                      <span className="tl2-label-canal" style={{ color: canalColor.text, background: canalColor.bg, borderColor: canalColor.border }}>
                        {canal}
                      </span>
                      {isLive && (
                        <span className="tl2-label-live"><Zap size={9} />LIVE</span>
                      )}
                    </div>
                  </div>
                  {/* Mini avatars */}
                  {projeto.casting.slice(0, 3).map(name => (
                    <span key={name} className="tl2-avatar" style={{ background: getAvatarColor(name) }} title={name}>
                      {getInitials(name)}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Right Gantt area */}
          <div className="tl2-gantt-area" style={{ width: totalWidth, position: 'relative' }}>
            {/* Month headers */}

            <div className="tl2-month-header">
              {months.map((m, i) => {
                const x = dayToX(m);
                const nextM = months[i + 1] || addDays(maxDate, 1);
                const w = differenceInDays(nextM, m) * DAY_W;
                return (
                  <div
                    key={i}
                    className="tl2-month-cell"
                    style={{ left: x, width: w }}
                  >
                    {format(m, 'MMMM yyyy', { locale: ptBR })}
                  </div>
                );
              })}
            </div>

            {/* Grid body */}
            <div className="tl2-grid-body" style={{ height: withDates.length * ROW_HEIGHT }}>
              {/* Weekend shading */}
              {weekendStripes.map((s, i) => (
                <div key={i} className="tl2-weekend" style={{ left: s.x, width: s.w, height: '100%' }} />
              ))}

              {/* Vertical day lines (every 7 days) */}
              {Array.from({ length: Math.ceil(totalDays / 7) }, (_, i) => (
                <div key={i} className="tl2-week-line" style={{ left: i * 7 * DAY_W }} />
              ))}

              {/* Today line */}
              {showToday && (
                <div className="tl2-today-line" style={{ left: todayX }}>
                  <div className="tl2-today-dot" />
                  <span className="tl2-today-label">Hoje</span>
                </div>
              )}

              {/* Rows */}
              {withDates.map((projeto, rowIdx) => (
                <div
                  key={projeto.id}
                  className="tl2-bar-row"
                  style={{ top: rowIdx * ROW_HEIGHT, height: ROW_HEIGHT }}
                  onClick={() => onSelect(projeto)}
                >
                  {/* Row separator */}
                  <div className="tl2-row-sep" />

                  {faseOrder.map(fase => {
                    const config = FASE_CONFIG[fase];

                    if (fase === 'publicacao') {
                      if (!projeto.fases.publicacao?.data) return null;
                      const x = dayToX(projeto.fases.publicacao.data);
                      const dateStr = format(projeto.fases.publicacao.data, 'dd/MM');
                      return (
                        <div
                          key={fase}
                          className="tl2-diamond"
                          style={{ left: x - 8, background: config.color }}
                          onMouseEnter={e => setTooltip({ text: `Publicação: ${dateStr}`, x: e.clientX, y: e.clientY - 36 })}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      );
                    }

                    const faseData = projeto.fases[fase];
                    if (!faseData?.inicio || !faseData?.fim) return null;
                    const x = dayToX(faseData.inicio);
                    const w = Math.max(differenceInDays(faseData.fim, faseData.inicio) * DAY_W, DAY_W);
                    const label = format(faseData.inicio, 'dd/MM') + ' → ' + format(faseData.fim, 'dd/MM');
                    const isActive = isWithinInterval(new Date(), { start: faseData.inicio, end: faseData.fim });

                    return (
                      <div
                        key={fase}
                        className={`tl2-bar ${isActive ? 'tl2-bar-active' : ''}`}
                        style={{ left: x, width: w, background: config.color }}
                        onMouseEnter={e => setTooltip({ text: `${config.label}: ${label}`, x: e.clientX, y: e.clientY - 36 })}
                        onMouseLeave={() => setTooltip(null)}
                      >
                        {w > 50 && (
                          <span className="tl2-bar-label">{config.label}</span>
                        )}
                        {isActive && <span className="tl2-bar-pulse" style={{ background: config.color }} />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="tl2-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
};
