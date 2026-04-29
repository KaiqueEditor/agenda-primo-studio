import React, { useState, useCallback } from 'react';
import { format } from 'date-fns';
import type { Projeto, FaseType, CalendarEvent as CalEvent } from '../../types';
import { getCalendarDays, isCurrentMonth, isToday, getEventsForDay, getWeekDayNames, getNextMonth, getPrevMonth } from '../../utils/dateHelpers';
import { CalendarNavigation } from './CalendarNavigation';
import { CalendarEventItem } from './CalendarEvent';
import { DayModal } from '../Modal/DayModal';

interface Props {
  projetos: Projeto[];
  fases: FaseType[];
  onSelectEvent: (event: CalEvent) => void;
  onDropEvent?: (projetoId: string, fase: FaseType, oldDate: string, newDate: string) => void;
  loading?: boolean;
}

export const CalendarGrid: React.FC<Props> = ({ projetos, fases, onSelectEvent, onDropEvent, loading }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date('2026-05-01'));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
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
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const data = e.dataTransfer.getData('application/json');
                if (!data || !onDropEvent) return;
                try {
                  const { projetoId, fase, date } = JSON.parse(data);
                  onDropEvent(projetoId, fase, date, day.toISOString());
                } catch(err) {}
              }}
            >
              <div className="cell-header">
                {today && <span className="today-label">Hoje</span>}
                <span className={`cell-day ${today ? 'today-number' : ''}`}>
                  {format(day, 'd')}
                </span>
              </div>
              <div className="cell-events">
                {loading ? (
                  <>
                    <div className="skeleton skeleton-text" style={{ width: '80%', marginBottom: '4px' }} />
                    <div className="skeleton skeleton-text" style={{ width: '50%' }} />
                  </>
                ) : (
                  <>
                    {events.slice(0, 3).map((ev, j) => (
                      <CalendarEventItem key={`${ev.projeto.id}-${ev.fase}-${j}`} event={ev} onClick={onSelectEvent} />
                    ))}
                    {events.length > 3 && (
                      <span className="more-events">+{events.length - 3} mais</span>
                    )}
                  </>
                )}
              </div>
              <div 
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, cursor: 'pointer', zIndex: 0 }} 
                onClick={() => setSelectedDay(day)}
              />
            </div>
          );
        })}
      </div>
      
      {selectedDay && (
        <DayModal
          date={selectedDay}
          events={getEventsForDay(projetos, selectedDay, fases)}
          onClose={() => setSelectedDay(null)}
          onSelectEvent={onSelectEvent}
        />
      )}
    </div>
  );
};
