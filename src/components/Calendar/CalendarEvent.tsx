import React from 'react';
import { type CalendarEvent as CalEvent, FASE_CONFIG } from '../../types';
import { getCanalColor } from '../../utils/displayHelpers';
import { Zap } from 'lucide-react';

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
          zIndex: 10
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
