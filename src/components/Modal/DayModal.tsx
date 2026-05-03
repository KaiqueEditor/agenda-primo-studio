import React from 'react';
import { X } from 'lucide-react';
import type { CalendarEvent as CalEvent } from '../../types';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FASE_CONFIG } from '../../types';
import { getCanalColor } from '../../utils/displayHelpers';

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
              {events.map((ev, i) => {
                const canalColor = getCanalColor(ev.projeto.canal);
                const faseConfig = FASE_CONFIG[ev.fase];
                const canais = Array.isArray(ev.projeto.canal) ? ev.projeto.canal.join(', ') : ev.projeto.canal;
                const responsaveis = ev.projeto.responsavel && ev.projeto.responsavel.length > 0 ? ev.projeto.responsavel.join(', ') : null;

                return (
                  <button
                    key={`${ev.projeto.id}-${ev.fase}-${i}`}
                    onClick={() => {
                      onSelectEvent(ev);
                      onClose();
                    }}
                    style={{
                      width: '100%',
                      background: canalColor.bg,
                      border: 'none',
                      borderLeft: `4px solid ${canalColor.dot}`,
                      borderRadius: '8px',
                      padding: '12px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: '600', color: canalColor.text, lineHeight: '1.3' }}>
                      {ev.projeto.titulo}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
                      {canais && (
                        <span style={{ fontSize: '12px', fontWeight: '500', color: canalColor.text, opacity: 0.8 }}>
                          {canais}
                        </span>
                      )}
                      {responsaveis && (
                        <span style={{ fontSize: '12px', fontWeight: '500', color: canalColor.text, opacity: 0.8 }}>
                          {responsaveis}
                        </span>
                      )}
                    </div>
                    <span style={{ 
                      fontSize: '12px', fontWeight: '600', color: faseConfig.color, 
                      display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' 
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: faseConfig.color }} />
                      {faseConfig.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
