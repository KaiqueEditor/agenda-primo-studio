import React from 'react';
import { X } from 'lucide-react';
import type { CalendarEvent as CalEvent } from '../../types';
import { CalendarEventItem } from '../Calendar/CalendarEvent';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DayModalProps {
  date: Date;
  events: CalEvent[];
  onClose: () => void;
  onSelectEvent: (event: CalEvent) => void;
}

export const DayModal: React.FC<DayModalProps> = ({ date, events, onClose, onSelectEvent }) => {
  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', width: '100%', padding: '0' }}>
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {format(date, "d 'de' MMMM", { locale: ptBR })}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {events.length} {events.length === 1 ? 'projeto' : 'projetos'} nesse dia
            </p>
          </div>
          <button className="close-btn" onClick={onClose} style={{ background: 'var(--bg-main)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={16} />
          </button>
        </div>
        
        <div className="modal-body" style={{ padding: '16px 20px', maxHeight: '60vh', overflowY: 'auto' }}>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
              Nenhum projeto agendado para este dia.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {events.map((ev, i) => (
                <div key={`${ev.projeto.id}-${ev.fase}-${i}`} style={{ display: 'flex', width: '100%' }}>
                  <CalendarEventItem 
                    event={ev} 
                    onClick={(event) => {
                      onSelectEvent(event);
                      onClose();
                    }} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
