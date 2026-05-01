import React, { useState } from 'react';
import { X, Users, Zap, Save, Trash2, Briefcase } from 'lucide-react';
import { type Projeto, FASE_CONFIG, type FaseType, type TeamMember } from '../../types';
import { getProjectProgress } from '../../utils/dateHelpers';
import { format } from 'date-fns';
import { AutocompleteTagInput } from './AutocompleteTagInput';

interface Props {
  projeto: Projeto;
  team: TeamMember[];
  initialFase?: FaseType;
  onClose: () => void;
  onSave: (p: Projeto) => void;
  onDelete?: (id: string) => void;
}

export const ProjectModal: React.FC<Props> = ({ projeto, team, onClose, onSave, onDelete }) => {
  const [edited, setEdited] = useState<Projeto>({ ...projeto });
  const progress = getProjectProgress(edited);
  const faseOrder: FaseType[] = ['gravacao', 'edicao', 'publicacao'];

  const handleChange = (field: keyof Projeto, value: any) => {
    setEdited({ ...edited, [field]: value });
  };

  const handleDateChange = (fase: FaseType, field: 'inicio' | 'fim' | 'data', value: string) => {
    setEdited((prev) => {
      const newFases = { ...prev.fases };
      let newDate: Date | undefined = undefined;
      if (value) {
        const [year, month, day] = value.split('-');
        newDate = new Date(Number(year), Number(month) - 1, Number(day));
      }
      if (fase === 'publicacao') {
        newFases.publicacao = { data: newDate };
      } else {
        const current = newFases[fase] || {};
        newFases[fase] = { ...current, [field]: newDate };
      }
      return { ...prev, fases: newFases };
    });
  };

  const formatForInput = (d?: Date) => {
    if (!d) return '';
    try { return format(d, 'yyyy-MM-dd'); } catch { return ''; }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>

        {/* ── Header ── */}
        <div className="modal-header">
          <div className="modal-badge">
            <select
              value={edited.tipo}
              onChange={e => handleChange('tipo', e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'inherit', fontWeight: 'bold', cursor: 'pointer' }}
            >
              <option value="video">Vídeo</option>
              <option value="podcast">Podcast</option>
            </select>
          </div>
          <input
            className="modal-title-input"
            value={edited.titulo}
            onChange={e => handleChange('titulo', e.target.value)}
            placeholder="Nome do Projeto"
          />
          <AutocompleteTagInput
            tags={Array.isArray(edited.canal) ? edited.canal : (edited.canal ? [edited.canal] : [])}
            onChange={tags => handleChange('canal', tags)}
            suggestions={['O Primo Rico', 'Você Mais Rico', 'PrimoCast', 'Finclass', 'Os Sócios', 'AGF', 'PrimoTech']}
            placeholder="Adicionar canal/tag..."
          />
        </div>

        {/* ── Progress ── */}
        <div className="modal-progress-section">
          <div className="progress-label">
            <span>Progresso Geral</span>
            <span className="progress-pct">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* ── Cronograma ── */}
        <div className="modal-section">
          <p className="modal-section-label">Cronograma</p>
          <div className="timeline-track">
            {faseOrder.map((fase) => {
              const config = FASE_CONFIG[fase];
              const faseData = fase === 'publicacao' ? edited.fases.publicacao : edited.fases[fase];
              const isPubli = fase === 'publicacao';
              const isLive = fase === 'gravacao' && edited.fases.gravacao?.aoVivo;
              return (
                <div key={fase} className="timeline-item active">
                  <span className="timeline-dot filled" style={{ background: config.color }} />
                  <span className="timeline-fase">
                    {config.label}
                    {isLive && <Zap size={11} className="live-badge" />}
                  </span>
                  <div className="timeline-date-inputs">
                    {isPubli ? (
                      <input
                        type="date"
                        value={formatForInput((faseData as {data?: Date})?.data)}
                        onChange={e => handleDateChange(fase, 'data', e.target.value)}
                        className="date-input"
                      />
                    ) : (
                      <>
                        <input
                          type="date"
                          value={formatForInput((faseData as {inicio?: Date, fim?: Date})?.inicio)}
                          onChange={e => handleDateChange(fase, 'inicio', e.target.value)}
                          className="date-input"
                        />
                        <span className="date-sep">→</span>
                        <input
                          type="date"
                          value={formatForInput((faseData as {inicio?: Date, fim?: Date})?.fim)}
                          onChange={e => handleDateChange(fase, 'fim', e.target.value)}
                          className="date-input"
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Casting + Equipe ── */}
        <div className="modal-two-col">
          <div>
            <p className="modal-section-label"><Users size={13} /> Casting</p>
            <AutocompleteTagInput
              tags={edited.casting || []}
              onChange={tags => handleChange('casting', tags)}
              suggestions={['Thiago Nigro', 'Bruno Perini', 'Malu', 'Lucão', 'Kaique', 'Louise', 'Luis Barsi', 'Time AGF']}
              placeholder="Adicionar casting..."
            />
          </div>
          <div>
            <p className="modal-section-label"><Briefcase size={13} /> Equipe</p>
            <AutocompleteTagInput
              tags={edited.responsavel || []}
              onChange={tags => handleChange('responsavel', tags)}
              suggestions={team.map(m => m.name)}
              placeholder="Adicionar membro..."
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          {onDelete ? (
            <button
              onClick={() => onDelete(edited.id)}
              style={{ color: '#FF3B30', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '13px' }}
            >
              <Trash2 size={14} /> Excluir Projeto
            </button>
          ) : <div />}
          <button className="save-btn" onClick={() => onSave(edited)}>
            <Save size={14} /> Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};
