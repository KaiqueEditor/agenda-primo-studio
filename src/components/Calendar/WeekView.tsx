import React, { useRef, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Projeto, FaseType, CalendarEvent as CalEvent } from '../../types';
import { getEventsForDay } from '../../utils/dateHelpers';
import { getCanalColor } from '../../utils/displayHelpers';
import { FASE_CONFIG } from '../../types';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 60; // px per hour

interface Props {
  currentDate: Date;
  projetos: Projeto[];
  fases: FaseType[];
  onSelectEvent: (event: CalEvent) => void;
}

export const WeekView: React.FC<Props> = ({ currentDate, projetos, fases, onSelectEvent }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  useEffect(() => {
    if (scrollRef.current) {
      // scroll to 7am on mount
      scrollRef.current.scrollTop = 7 * HOUR_HEIGHT;
    }
  }, []);

  return (
    <div className="week-view">
      {/* Day header row */}
      <div className="week-header">
        <div className="week-time-gutter" />
        {weekDays.map((day, i) => {
          const today = isToday(day);
          return (
            <div key={i} className={`week-day-col-header ${today ? 'today' : ''}`}>
              <span className="week-day-name">
                {format(day, 'EEE', { locale: ptBR }).toUpperCase()}
              </span>
              <span className={`week-day-number ${today ? 'today-circle' : ''}`}>
                {format(day, 'd')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Scrollable time grid */}
      <div className="week-body" ref={scrollRef}>
        <div className="week-time-grid" style={{ height: HOUR_HEIGHT * 24 }}>
          {/* Hour labels */}
          <div className="week-time-gutter">
            {HOURS.map(h => (
              <div key={h} className="week-hour-label" style={{ height: HOUR_HEIGHT }}>
                {h > 0 && (
                  <span>{h < 10 ? `0${h}:00` : `${h}:00`}</span>
                )}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, colIdx) => {
            const events = getEventsForDay(projetos, day, fases);
            const today = isToday(day);
            return (
              <div key={colIdx} className={`week-day-column ${today ? 'today-column' : ''}`} style={{ height: HOUR_HEIGHT * 24 }}>
                {/* Hour lines */}
                {HOURS.map(h => (
                  <div key={h} className="week-hour-line" style={{ top: h * HOUR_HEIGHT }} />
                ))}
                {/* Today line */}
                {today && (
                  <div className="week-now-line" style={{ top: (currentMinutes / 60) * HOUR_HEIGHT }}>
                    <div className="week-now-dot" />
                  </div>
                )}
                {/* Events as full-day blocks (since our events don't have time) */}
                {events.map((ev, j) => {
                  const canalColor = getCanalColor(ev.projeto.canal);
                  const faseConfig = FASE_CONFIG[ev.fase];
                  const top = (8 + j * 1.6) * HOUR_HEIGHT; // stagger from 8am
                  return (
                    <button
                      key={j}
                      className="week-event"
                      style={{
                        top,
                        background: canalColor.bg,
                        borderLeft: `3px solid ${canalColor.dot}`,
                        color: canalColor.text,
                      }}
                      onClick={() => onSelectEvent(ev)}
                    >
                      <span className="week-event-dot" style={{ background: faseConfig.color }} />
                      <span className="week-event-title">
                        {ev.projeto.titulo.split(' - ')[0]}
                      </span>
                      <span className="week-event-fase">{faseConfig.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
