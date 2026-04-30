import React from 'react';
import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Projeto, FaseType, CalendarEvent as CalEvent } from '../../types';
import { getEventsForDay } from '../../utils/dateHelpers';
import { getCanalColor } from '../../utils/displayHelpers';
import { FASE_CONFIG } from '../../types';

interface Props {
  currentDate: Date;
  projetos: Projeto[];
  fases: FaseType[];
  onSelectEvent: (event: CalEvent) => void;
}

export const WeekView: React.FC<Props> = ({ currentDate, projetos, fases, onSelectEvent }) => {
  const now = new Date();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="week-view">
      {/* Day headers */}
      <div className="week-header">
        {weekDays.map((day, i) => {
          const today = isToday(day);
          const isNow = isSameDay(day, now);
          return (
            <div key={i} className={`week-day-col-header ${today ? 'today' : ''}`}>
              <span className="week-day-name">
                {format(day, 'EEE', { locale: ptBR }).toUpperCase()}
              </span>
              <span className={`week-day-number ${isNow ? 'today-circle' : ''}`}>
                {format(day, 'd')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Event columns — no time grid, just stacked cards */}
      <div className="week-body-flat">
        {weekDays.map((day, colIdx) => {
          const events = getEventsForDay(projetos, day, fases);
          const today = isToday(day);
          return (
            <div key={colIdx} className={`week-col-flat ${today ? 'today-col-flat' : ''}`}>
              {events.length === 0 ? (
                <div className="week-col-empty" />
              ) : (
                events.map((ev, j) => {
                  const canalColor = getCanalColor(ev.projeto.canal);
                  const faseConfig = FASE_CONFIG[ev.fase];
                  return (
                    <button
                      key={j}
                      className="week-event-flat"
                      style={{
                        background: canalColor.bg,
                        borderLeft: `3px solid ${canalColor.dot}`,
                        color: canalColor.text,
                      }}
                      onClick={() => onSelectEvent(ev)}
                    >
                      <span className="week-flat-title">
                        {ev.projeto.titulo.split(' - ')[0]}
                      </span>
                      <span className="week-flat-fase" style={{ color: faseConfig.color }}>
                        <span className="week-flat-dot" style={{ background: faseConfig.color }} />
                        {faseConfig.label}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
