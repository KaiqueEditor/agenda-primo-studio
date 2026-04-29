import React, { useState, useEffect, useRef } from 'react';
import { Search, MonitorPlay, Mic, Calendar } from 'lucide-react';
import { type Projeto } from '../../types';
import { getShortTitle } from '../../utils/displayHelpers';

interface Props {
  projetos: Projeto[];
  onSelect: (projeto: Projeto) => void;
}

export const CommandPalette: React.FC<Props> = ({ projetos, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  const filtered = query.trim() === ''
    ? projetos.slice(0, 5) // Recent/First 5
    : projetos.filter(p => 
        p.titulo.toLowerCase().includes(query.toLowerCase()) || 
        (Array.isArray(p.canal) ? p.canal.join(' ') : p.canal).toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && filtered.length > 0) {
      e.preventDefault();
      onSelect(filtered[selectedIndex]);
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <div className="cmd-overlay" onClick={() => setOpen(false)}>
      <div className="cmd-palette" onClick={e => e.stopPropagation()}>
        <div className="cmd-input-wrapper">
          <Search size={20} color="var(--text-muted)" />
          <input
            ref={inputRef}
            className="cmd-input"
            placeholder="Buscar projetos... (Ex: PrimoCast, Ações)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="cmd-list">
          {filtered.length > 0 ? (
            filtered.map((p, i) => (
              <div 
                key={p.id} 
                className="cmd-item" 
                aria-selected={i === selectedIndex}
                onMouseEnter={() => setSelectedIndex(i)}
                onClick={() => {
                  onSelect(p);
                  setOpen(false);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {p.tipo === 'video' ? <MonitorPlay size={16} color="var(--accent)" /> : <Mic size={16} color="var(--accent)" />}
                  <span className="cmd-item-title">{p.titulo}</span>
                </div>
                <div className="cmd-item-meta">
                  <span className="status-badge" style={{ background: 'var(--bg-main)' }}>
                    {getShortTitle('', p.canal)}
                  </span>
                  {p.fases.publicacao?.data && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />
                      {new Date(p.fases.publicacao.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="cmd-empty">
              Nenhum projeto encontrado para "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
