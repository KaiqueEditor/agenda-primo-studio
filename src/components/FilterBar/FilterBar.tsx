import React from 'react';
import type { FilterState } from '../../types';
import { ChevronDown } from 'lucide-react';

interface Props {
  filters: FilterState;
  onSetCanal: (c: string) => void;
  onSetTipo: (t: string) => void;
  onSetResponsavel: (r: string) => void;
  canalOptions: string[];
  formatoOptions: string[];
  teamOptions: string[];
}

export const FilterBar: React.FC<Props> = ({
  filters,
  onSetCanal,
  onSetTipo,
  onSetResponsavel,
  canalOptions,
  formatoOptions,
  teamOptions
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ position: 'relative' }}>
        <select
          value={filters.canal}
          onChange={(e) => onSetCanal(e.target.value)}
          style={{ appearance: 'none', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 32px 8px 16px', fontSize: '14px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', minWidth: '140px' }}
        >
          <option value="">Canais</option>
          {canalOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <ChevronDown size={14} color="var(--text-secondary)" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>

      <div style={{ position: 'relative' }}>
        <select
          value={filters.tipo}
          onChange={(e) => onSetTipo(e.target.value)}
          style={{ appearance: 'none', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 32px 8px 16px', fontSize: '14px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', minWidth: '140px' }}
        >
          <option value="all">Formatos</option>
          {formatoOptions.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <ChevronDown size={14} color="var(--text-secondary)" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>

      <div style={{ position: 'relative' }}>
        <select
          value={filters.responsavel}
          onChange={(e) => onSetResponsavel(e.target.value)}
          style={{ appearance: 'none', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 32px 8px 16px', fontSize: '14px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', minWidth: '140px' }}
        >
          <option value="">Responsáveis</option>
          {teamOptions.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <ChevronDown size={14} color="var(--text-secondary)" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
};
