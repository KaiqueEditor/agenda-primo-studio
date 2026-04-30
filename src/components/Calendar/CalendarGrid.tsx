import React, { useState, useCallback } from 'react';
import { format, addDays, addWeeks, subWeeks, addMonths, subMonths, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Projeto, FaseType, CalendarEvent as CalEvent } from '../../types';
import { getCalendarDays, isCurrentMonth, isToday, getEventsForDay, getWeekDayNames } from '../../utils/dateHelpers';
import { CalendarEventItem } from './CalendarEvent';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { DayModal } from '../Modal/DayModal';
import { format as dfFormat } from 'date-fns';

type CalView = 'mes' | 'semana' | 'dia';

interface Props {
  projetos: Projeto[];
  fases: FaseType[];
  onSelectEvent: (event: CalEvent) => void;
  onDropEvent?: (projetoId: string, fase: FaseType, oldDate: string, newDate: string) => void;
  loading?: boolean;
}

export const CalendarGrid: React.FC<Props> = ({ projetos, fases, onSelectEvent, onDropEvent, loading }) => {
  const [calView, setCalView] = useState<CalView>('mes');
  const [currentDate, setCurrentDate] = useState(new Date('2026-05-01'));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const weekDays = getWeekDayNames();

  // Navigation
  const handlePrev = useCallback(() => {
    setCurrentDate(d => {
      if (calView === 'mes') return subMonths(d, 1);
      if (calView === 'semana') return subWeeks(d, 1);
      return addDays(d, -1);
    });
  }, [calView]);

  const handleNext = useCallback(() => {
    setCurrentDate(d => {
      if (calView === 'mes') return addMonths(d, 1);
      if (calView === 'semana') return addWeeks(d, 1);
      return addDays(d, 1);
    });
  }, [calView]);

  const handleToday = useCallback(() => setCurrentDate(new Date()), []);

  // Title based on view
  const getTitle = () => {
    if (calView === 'mes') return format(currentDate, 'MMMM yyyy', { locale: ptBR });
    if (calView === 'semana') {
      const ws = startOfWeek(currentDate, { weekStartsOn: 0 });
      const we = addDays(ws, 6);
      if (ws.getMonth() === we.getMonth()) {
        return format(ws, "d '–' ") + format(we, "d 'de' MMMM yyyy", { locale: ptBR });
      }
      return format(ws, "d MMM", { locale: ptBR }) + ' – ' + format(we, "d MMM yyyy", { locale: ptBR });
    }
    return format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  // Month grid days
  const days = getCalendarDays(currentDate);

  return (
    <div className="cal-container">
      {/* Top bar: title + nav + view switcher */}
      <div className="cal-topbar">
        <div className="cal-topbar-left">
          <h2 className="cal-title">{getTitle()}</h2>
        </div>
        <div className="cal-topbar-right">
          {/* View switcher — Apple-style segmented control */}
          <div className="cal-view-switcher">
            {(['dia', 'semana', 'mes'] as CalView[]).map(v => (
              <button
                key={v}
                className={`cal-view-btn ${calView === v ? 'active' : ''}`}
                onClick={() => setCalView(v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          {/* Nav arrows */}
          <div className="cal-nav-arrows">
            <button className="cal-nav-btn" onClick={handlePrev} aria-label="Anterior">
              <ChevronLeft size={18} />
            </button>
            <button className="cal-today-btn" onClick={handleToday}>Hoje</button>
            <button className="cal-nav-btn" onClick={handleNext} aria-label="Próximo">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Month View */}
      {calView === 'mes' && (
        <div className="cal-month">
          <div className="calendar-grid">
            {weekDays.map(wd => (
              <div key={wd} className="calendar-weekday">{wd}</div>
            ))}
            {days.map((day, i) => {
              const events = getEventsForDay(projetos, day, fases);
              const inMonth = isCurrentMonth(day, currentDate);
              const today = isToday(day);
              return (
                <div
                  key={i}
                  className={`calendar-cell ${!inMonth ? 'other-month' : ''} ${today ? 'today' : ''}`}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault();
                    const data = e.dataTransfer.getData('application/json');
                    if (!data || !onDropEvent) return;
                    try {
                      const { projetoId, fase, date } = JSON.parse(data);
                      onDropEvent(projetoId, fase, date, day.toISOString());
                    } catch {}
                  }}
                >
                  <div className="cell-header">
                    {today && <span className="today-label">Hoje</span>}
                    <span className={`cell-day ${today ? 'today-number' : ''}`}>
                      {dfFormat(day, 'd')}
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
        </div>
      )}

      {/* Week View */}
      {calView === 'semana' && (
        <WeekView
          currentDate={currentDate}
          projetos={projetos}
          fases={fases}
          onSelectEvent={onSelectEvent}
        />
      )}

      {/* Day View */}
      {calView === 'dia' && (
        <DayView
          currentDate={currentDate}
          projetos={projetos}
          fases={fases}
          onSelectEvent={onSelectEvent}
        />
      )}

      {/* Day Modal (month view click) */}
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
