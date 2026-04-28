import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { TeamMember, TeamRole, Projeto } from '../../types';

interface Props {
  team: TeamMember[];
  projetos: Projeto[];
  onClose: () => void;
  onSave: (member: TeamMember) => void;
}

export const TeamModal: React.FC<Props> = ({ team, projetos, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<TeamRole>('editor');
  const [canMultitask, setCanMultitask] = useState(false);

  const handleAdd = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), role, canMultitask });
    setName('');
  };

  const getProjectsForMember = (memberName: string) => {
    return projetos.filter(p => (p.responsavel || []).includes(memberName) || p.casting.includes(memberName));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '600px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>

        <div className="modal-header">
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Gerenciar Equipe e Ocupação</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Adicione novas pessoas (freelancers, agências) e veja em quais projetos cada um está alocado atualmente.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input 
            className="date-input" 
            style={{ flex: 1, minWidth: '150px' }} 
            placeholder="Nome do colaborador" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          <select className="sidebar-select" style={{ width: 'auto' }} value={role} onChange={e => setRole(e.target.value as TeamRole)}>
            <option value="editor">Editor</option>
            <option value="supervisor_edicao">Superv. Edição</option>
            <option value="motion">Motion</option>
            <option value="designer">Designer</option>
            <option value="cinegrafista">Cinegrafista</option>
            <option value="filmmaker">Filmmaker</option>
            <option value="produtora">Produtor(a)</option>
            <option value="gerente_producao">Gerente Prod.</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', whiteSpace: 'nowrap' }}>
            <input type="checkbox" checked={canMultitask} onChange={e => setCanMultitask(e.target.checked)} />
            Multifunção?
          </label>
          <button className="save-btn" style={{ padding: '6px 12px' }} onClick={handleAdd}>
            <Plus size={16} /> Adicionar
          </button>
        </div>

        <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '6px' }}>
          {team.map((t, i) => {
            const memberProjects = getProjectsForMember(t.name);
            return (
              <div key={i} style={{ padding: '12px', borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg-main)' : 'var(--bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '14px' }}>{t.name}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '8px', textTransform: 'capitalize' }}>{t.role.replace('_', ' ')}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: t.canMultitask ? '#34C759' : '#FF9500', fontWeight: 500 }}>
                    {t.canMultitask ? 'Pode acumular' : 'Foco exclusivo'}
                  </div>
                </div>
                
                {memberProjects.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {memberProjects.map(p => (
                      <span key={p.id} style={{ fontSize: '11px', background: 'rgba(0,122,255,0.1)', color: '#007AFF', padding: '2px 6px', borderRadius: '4px' }}>
                        {p.titulo}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Nenhum projeto alocado.</div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
