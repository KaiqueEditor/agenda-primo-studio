import React from 'react';
import { type CalendarEvent, FASE_CONFIG } from '../../types';
import { Zap } from 'lucide-react';

interface Props {
  event: CalendarEvent;
  onClick: (e: CalendarEvent) => void;
}

export const CalendarEventItem: React.FC<Props> = ({ event, onClick }) => {
  const config = FASE_CONFIG[event.fase];
  const isLive = event.fase === 'gravacao' && event.projeto.fases.gravacao?.aoVivo;

  return (
    <button
      className="cal-event"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
          projetoId: event.projeto.id,
          fase: event.fase,
          date: event.date.toISOString(),
        }));
      }}
      style={{
        '--event-color': config.color,
        '--event-bg': config.colorLight,
        cursor: 'grab'
      } as React.CSSProperties}
      onClick={() => onClick(event)}
      title={`${event.projeto.titulo} (${config.label})`}
    >
      <span className="cal-event-dot" />
      <span className="cal-event-label">
        {event.projeto.titulo}
        {isLive && <Zap size={10} className="live-icon" />}
      </span>
    </button>
  );
};
