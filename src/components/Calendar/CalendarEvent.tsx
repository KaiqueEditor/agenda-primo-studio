import React from 'react';
import { type CalendarEvent as CalEvent } from '../../types';
import { getCanalColor, FASE_CONFIG } from '../../utils/displayHelpers';
import { Zap } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  event: CalEvent;
  onClick: (event: CalEvent) => void;
}

export const CalendarEventItem: React.FC<Props> = ({ event, onClick }) => {
  const canalColor = getCanalColor(event.projeto.canal);
  
  const getShortTitle = (titulo: string, canal: string | string[]) => {
    const isPodcast = canal === 'PrimoCast' || canal === 'Os Sócios Podcast' || canal === 'Os Economistas';
    const mainTitle = titulo.split('-')[0].trim();
    if (isPodcast && titulo.includes('(EP.')) {
      return titulo.replace('(EP. ', '').replace(')', '');
    }
    return mainTitle;
  };

  const shortTitle = getShortTitle(event.projeto.titulo, event.projeto.canal);
  const isLive = event.fase === 'gravacao' && event.projeto.fases.gravacao?.aoVivo;
  const faseConfig = FASE_CONFIG[event.fase];

  const tooltipText = `${event.projeto.titulo}\nCanal: ${Array.isArray(event.projeto.canal) ? event.projeto.canal.join(' + ') : event.projeto.canal}\nFase: ${faseConfig.label}`;

  return (
    <div className="cal-event-wrapper" title={tooltipText}>
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
          zIndex: 10 /* Higher z-index to be clickable over the cell overlay */
        } as React.CSSProperties}
        onClick={(e) => {
          e.stopPropagation();
          onClick(event);
        }}
      >
        <span className="cal-event-dot" style={{ background: canalColor.dot }} />
        <span className="cal-event-label" style={{ color: canalColor.text }}>
          {shortTitle}
          {isLive && <Zap size={10} className="live-icon" />}
        </span>
        <span className="cal-event-fase-dot" style={{ background: faseConfig.color }} />
      </button>
    </div>
  );
};
