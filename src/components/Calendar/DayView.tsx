import React from 'react';
import { format, isToday, isSameDay } from 'date-fns';
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
  onChangeDate?: (d: Date) => void;
}

// Minimal inline mini calendar for the sidebar
const MiniCal: React.FC<{ date: Date; onSelect: (d: Date) => void }> = ({ date, onSelect }) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
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
          const todayFlag = isToday(d);
          const sel = isSameDay(d, date);
          return (
            <button
              key={i}
              className={`mini-cal-day ${todayFlag ? 'mini-today' : ''} ${sel ? 'mini-selected' : ''}`}
              onClick={() => onSelect(d)}
            >{day}</button>
          );
        })}
      </div>
    </div>
  );
};

export const DayView: React.FC<Props> = ({ currentDate, projetos, fases, onSelectEvent, onChangeDate }) => {
  const events = getEventsForDay(projetos, currentDate, fases);
  const today = isToday(currentDate);
  const dayLabel = format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <div className="day-view">
      {/* Main content */}
      <div className="day-view-main">
        {/* Day header */}
        <div className={`day-view-header ${today ? 'day-view-header-today' : ''}`}>
          <span className="day-view-label">{dayLabel}</span>
          {today && <span className="day-view-today-badge">Hoje</span>}
        </div>

        {/* Events list */}
        <div className="day-events-list">
          {events.length === 0 ? (
            <div className="day-empty">
              <div className="day-empty-icon">📅</div>
              <span>Nenhum projeto neste dia</span>
            </div>
          ) : (
            events.map((ev, j) => {
              const canalColor = getCanalColor(ev.projeto.canal);
              const faseConfig = FASE_CONFIG[ev.fase];
              const canal = Array.isArray(ev.projeto.canal) ? ev.projeto.canal.join(' + ') : ev.projeto.canal;
              return (
                <button
                  key={j}
                  className="day-event-card"
                  style={{
                    background: canalColor.bg,
                    borderLeft: `4px solid ${canalColor.dot}`,
                  }}
                  onClick={() => onSelectEvent(ev)}
                >
                  <div className="day-event-card-top">
                    <span className="day-event-card-title" style={{ color: canalColor.text }}>
                      {ev.projeto.titulo}
                    </span>
                    <span className="day-event-card-fase" style={{ background: faseConfig.color }}>
                      {faseConfig.label}
                    </span>
                  </div>
                  <div className="day-event-card-meta">
                    <span style={{ color: canalColor.dot }}>● {canal}</span>
                    <span>{ev.projeto.tipo === 'video' ? '🎬 Vídeo' : '🎙 Podcast'}</span>
                    {ev.projeto.casting.length > 0 && (
                      <span>👥 {ev.projeto.casting.slice(0, 3).join(', ')}</span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Sidebar: mini calendar */}
      <div className="day-view-sidebar">
        <MiniCal date={currentDate} onSelect={onChangeDate || (() => {})} />
      </div>
    </div>
  );
};
