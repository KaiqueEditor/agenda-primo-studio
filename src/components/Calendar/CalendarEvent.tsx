import React, { useState } from 'react';
import { type CalendarEvent, FASE_CONFIG } from '../../types';
import { getCanalColor, getShortTitle } from '../../utils/displayHelpers';
import { formatDate } from '../../utils/dateHelpers';
import { Zap } from 'lucide-react';

interface Props {
  event: CalendarEvent;
  onClick: (e: CalendarEvent) => void;
}

export const CalendarEventItem: React.FC<Props> = ({ event, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const canalColor = getCanalColor(event.projeto.canal);
  const shortTitle = getShortTitle(event.projeto.titulo, event.projeto.canal);
  const isLive = event.fase === 'gravacao' && event.projeto.fases.gravacao?.aoVivo;
  const faseConfig = FASE_CONFIG[event.fase];

  return (
    <div className="cal-event-wrapper" 
      onMouseEnter={() => setShowTooltip(true)} 
      onMouseLeave={() => setShowTooltip(false)}
    >
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
          '--event-color': canalColor.dot,
          '--event-bg': canalColor.bg,
          '--event-border': canalColor.border,
          cursor: 'grab',
          borderColor: canalColor.border,
        } as React.CSSProperties}
        onClick={() => onClick(event)}
      >
        <span className="cal-event-dot" style={{ background: canalColor.dot }} />
        <span className="cal-event-label" style={{ color: canalColor.text }}>
          {shortTitle}
          {isLive && <Zap size={10} className="live-icon" />}
        </span>
        <span className="cal-event-fase-dot" style={{ background: faseConfig.color }} title={faseConfig.label} />
      </button>

      {showTooltip && (
        <div className="event-tooltip">
          <div className="tooltip-title">{event.projeto.titulo}</div>
          <div className="tooltip-meta">
            <span className="tooltip-canal" style={{ color: canalColor.dot }}>
              {Array.isArray(event.projeto.canal) ? event.projeto.canal.join(' + ') : event.projeto.canal}
            </span>
            <span className="tooltip-fase" style={{ color: faseConfig.color }}>
              {faseConfig.label}
            </span>
          </div>
          {event.projeto.casting.length > 0 && (
            <div className="tooltip-casting">
              {event.projeto.casting.join(', ')}
            </div>
          )}
          {event.projeto.fases.publicacao?.data && (
            <div className="tooltip-date">
              Publicação: {formatDate(event.projeto.fases.publicacao.data, 'dd/MM/yyyy')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
