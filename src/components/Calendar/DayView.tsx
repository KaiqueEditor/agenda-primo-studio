import React, { useRef, useEffect } from 'react';
import { format, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Projeto, FaseType, CalendarEvent as CalEvent } from '../../types';
import { getEventsForDay } from '../../utils/dateHelpers';
import { getCanalColor } from '../../utils/displayHelpers';
import { FASE_CONFIG } from '../../types';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 64;

interface Props {
  currentDate: Date;
  projetos: Projeto[];
  fases: FaseType[];
  onSelectEvent: (event: CalEvent) => void;
}

// Mini month calendar for day view sidebar
const MiniCalendar: React.FC<{ date: Date; onSelectDate: (d: Date) => void }> = ({ date, onSelectDate }) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  // pad to multiple of 7
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="mini-cal">
      <div className="mini-cal-header">
        {format(date, 'MMMM yyyy', { locale: ptBR })}
      </div>
      <div className="mini-cal-grid">
        {['D','S','T','Q','Q','S','S'].map((d, i) => (
          <div key={i} className="mini-cal-weekday">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const d = new Date(year, month, day);
          const today = isToday(d);
          const selected = isSameDay(d, date);
          return (
            <button
              key={i}
              className={`mini-cal-day ${today ? 'mini-today' : ''} ${selected ? 'mini-selected' : ''}`}
              onClick={() => onSelectDate(d)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const DayView: React.FC<Props> = ({ currentDate, projetos, fases, onSelectEvent }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const now = new Date();
  const isCurrentDay = isSameDay(currentDate, now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const events = getEventsForDay(projetos, currentDate, fases);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 7 * HOUR_HEIGHT;
    }
  }, []);

  return (
    <div className="day-view">
      {/* Main scrollable area */}
      <div className="day-view-main" ref={scrollRef}>
        <div className="day-time-grid" style={{ height: HOUR_HEIGHT * 24 }}>
          {/* Hour labels + lines */}
          {HOURS.map(h => (
            <div key={h} className="day-hour-row" style={{ top: h * HOUR_HEIGHT, height: HOUR_HEIGHT }}>
              <span className="day-hour-label">
                {h > 0 ? (h < 10 ? `0${h}:00` : `${h}:00`) : ''}
              </span>
              <div className="day-hour-line" />
            </div>
          ))}

          {/* Current time indicator */}
          {isCurrentDay && (
            <div className="day-now-line" style={{ top: (currentMinutes / 60) * HOUR_HEIGHT }}>
              <div className="day-now-dot" />
            </div>
          )}

          {/* Events column */}
          <div className="day-events-col">
            {events.map((ev, j) => {
              const canalColor = getCanalColor(ev.projeto.canal);
              const faseConfig = FASE_CONFIG[ev.fase];
              const top = (8 + j * 2) * HOUR_HEIGHT;
              const height = HOUR_HEIGHT * 1.5;
              return (
                <button
                  key={j}
                  className="day-event"
                  style={{
                    top,
                    height,
                    background: canalColor.bg,
                    borderLeft: `4px solid ${canalColor.dot}`,
                    color: canalColor.text,
                  }}
                  onClick={() => onSelectEvent(ev)}
                >
                  <div className="day-event-title">{ev.projeto.titulo}</div>
                  <div className="day-event-meta">
                    <span className="day-event-fase-dot" style={{ background: faseConfig.color }} />
                    <span>{faseConfig.label}</span>
                    {' · '}
                    <span>{Array.isArray(ev.projeto.canal) ? ev.projeto.canal.join(', ') : ev.projeto.canal}</span>
                  </div>
                </button>
              );
            })}
            {events.length === 0 && (
              <div className="day-empty">
                <span>Nenhum projeto neste dia</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right sidebar: mini calendar */}
      <div className="day-view-sidebar">
        <MiniCalendar date={currentDate} onSelectDate={() => {}} />
      </div>
    </div>
  );
};
