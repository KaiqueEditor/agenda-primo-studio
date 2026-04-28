import React, { useState } from 'react';
import { X, Video, Mic, Users, Zap, Save, Trash2, Briefcase } from 'lucide-react';
import { type Projeto, FASE_CONFIG, type FaseType, type TeamMember } from '../../types';
import { getProjectProgress } from '../../utils/dateHelpers';
import { format } from 'date-fns';

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

  const faseOrder: FaseType[] = ['planejamento', 'gravacao', 'edicao', 'publicacao'];

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
    try {
      return format(d, 'yyyy-MM-dd');
    } catch {
      return '';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>

        <div className="modal-header">
          <div className="modal-badge">
            <select 
              value={edited.tipo} 
              onChange={e => handleChange('tipo', e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'inherit', fontWeight: 'bold' }}
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
          <input 
            className="modal-canal-input" 
            value={edited.canal} 
            onChange={e => handleChange('canal', e.target.value)}
            placeholder="Canal / Collab"
          />
        </div>

        <div className="modal-progress-section">
          <div className="progress-label">
            <span>Progresso Geral</span>
            <span className="progress-pct">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="modal-timeline">
          <h3>Cronograma</h3>
          <div className="timeline-track">
            {faseOrder.map((fase) => {
              const config = FASE_CONFIG[fase];
              const faseData = fase === 'publicacao' ? edited.fases.publicacao : edited.fases[fase];
              
              const isPubli = fase === 'publicacao';
              const isLive = fase === 'gravacao' && edited.fases.gravacao?.aoVivo;

              return (
                <div key={fase} className="timeline-item active">
                  <div className="timeline-dot filled" style={{ background: config.color, borderColor: config.color }} />
                  <div className="timeline-info" style={{ width: '100%' }}>
                    <span className="timeline-fase" style={{ color: config.color }}>
                      {config.label}
                      {isLive && <Zap size={12} className="live-badge" title="Ao Vivo" />}
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
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
          <div className="modal-casting" style={{ flex: 1, margin: 0 }}>
            <h3><Users size={16} /> Casting (separado por vírgula)</h3>
            <input 
              className="casting-input" 
              value={edited.casting.join(', ')} 
              onChange={e => handleChange('casting', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              placeholder="Ex: Louise, Barsi..."
            />
          </div>

          <div className="modal-casting" style={{ flex: 1, margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3><Briefcase size={16} /> Equipe Alocada</h3>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '120px', overflowY: 'auto', paddingRight: '4px' }}>
              {team.map(m => {
                const isSelected = (edited.responsavel || []).includes(m.name);
                return (
                  <button
                    key={m.name}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: `1px solid ${isSelected ? '#007AFF' : 'var(--border)'}`,
                      background: isSelected ? 'rgba(0,122,255,0.1)' : 'transparent',
                      color: isSelected ? '#007AFF' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    onClick={() => {
                      const current = edited.responsavel || [];
                      if (isSelected) {
                        handleChange('responsavel', current.filter(n => n !== m.name));
                      } else {
                        handleChange('responsavel', [...current, m.name]);
                      }
                    }}
                  >
                    {m.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          {onDelete ? (
            <button 
              onClick={() => onDelete(edited.id)} 
              style={{ color: '#FF3B30', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
            >
              <Trash2 size={16} /> Excluir Projeto
            </button>
          ) : <div />}
          
          <button className="save-btn" onClick={() => onSave(edited)}>
            <Save size={16} /> Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};
