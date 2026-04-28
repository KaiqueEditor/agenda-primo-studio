import React, { useState, useCallback } from 'react';
import { format } from 'date-fns';
import type { Projeto, FaseType, CalendarEvent as CalEvent } from '../../types';
import { getCalendarDays, isCurrentMonth, isToday, getEventsForDay, getWeekDayNames, getNextMonth, getPrevMonth } from '../../utils/dateHelpers';
import { CalendarNavigation } from './CalendarNavigation';
import { CalendarEventItem } from './CalendarEvent';

interface Props {
  projetos: Projeto[];
  fases: FaseType[];
  onSelectEvent: (event: CalEvent) => void;
}

export const CalendarGrid: React.FC<Props> = ({ projetos, fases, onSelectEvent }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date('2026-05-01'));
  const days = getCalendarDays(currentMonth);
  const weekDays = getWeekDayNames();

  const handlePrev = useCallback(() => setCurrentMonth((m) => getPrevMonth(m)), []);
  const handleNext = useCallback(() => setCurrentMonth((m) => getNextMonth(m)), []);

  return (
    <div className="calendar-container">
      <CalendarNavigation currentMonth={currentMonth} onPrev={handlePrev} onNext={handleNext} />
      <div className="calendar-grid">
        {weekDays.map((wd) => (
          <div key={wd} className="calendar-weekday">{wd}</div>
        ))}
        {days.map((day, i) => {
          const events = getEventsForDay(projetos, day, fases);
          const inMonth = isCurrentMonth(day, currentMonth);
          const today = isToday(day);
          return (
            <div
              key={i}
              className={`calendar-cell ${!inMonth ? 'other-month' : ''} ${today ? 'today' : ''}`}
            >
              <span className={`cell-day ${today ? 'today-number' : ''}`}>
                {format(day, 'd')}
              </span>
              <div className="cell-events">
                {events.slice(0, 3).map((ev, j) => (
                  <CalendarEventItem key={`${ev.projeto.id}-${ev.fase}-${j}`} event={ev} onClick={onSelectEvent} />
                ))}
                {events.length > 3 && (
                  <span className="more-events">+{events.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
