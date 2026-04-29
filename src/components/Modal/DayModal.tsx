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
    <div 
      onClick={onClose} 
      style={{ 
        position: 'fixed', inset: 0, zIndex: 9999, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          width: '100%', maxWidth: '380px', background: 'var(--bg-elevated)', 
          borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.05)',
          overflow: 'hidden', animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          border: '1px solid var(--border-subtle)', margin: '20px'
        }}
      >
        <div style={{ 
          padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          background: 'var(--bg-card)'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              {format(date, "d 'de' MMMM", { locale: ptBR })}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '500' }}>
              {events.length} {events.length === 1 ? 'projeto agendado' : 'projetos agendados'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'var(--bg-main)', border: 'none', width: '28px', height: '28px', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s' 
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--border)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-main)'}
          >
            <X size={14} />
          </button>
        </div>
        
        <div style={{ padding: '16px', maxHeight: '60vh', overflowY: 'auto', background: 'var(--bg-elevated)' }}>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
              Nenhum projeto agendado.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {events.map((ev, i) => (
                <div key={`${ev.projeto.id}-${ev.fase}-${i}`} style={{ width: '100%', position: 'relative' }}>
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
