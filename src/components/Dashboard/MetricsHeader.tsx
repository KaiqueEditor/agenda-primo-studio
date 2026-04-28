import React from 'react';
import type { Projeto } from '../../types';
import { detectConflicts } from '../../utils/dateHelpers';
import { AlertTriangle, Video, Mic, Clock, Plus, Cloud } from 'lucide-react';

interface Props {
  projetos: Projeto[];
  onAddProjeto: () => void;
  onSaveAll?: () => void;
}

export const MetricsHeader: React.FC<Props> = ({ projetos, onAddProjeto, onSaveAll }) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const totalVideos = projetos.filter((p) => p.tipo === 'video').length;
  const totalPodcasts = projetos.filter((p) => p.tipo === 'podcast').length;
  const conflicts = detectConflicts(projetos);

  const handleSave = async () => {
    if (!onSaveAll) return;
    setIsSaving(true);
    try {
      await onSaveAll();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className="metrics-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#007AFF' }}>
            <Video size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-value">{totalVideos}</span>
            <span className="metric-label">Vídeos</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#5856D6' }}>
            <Mic size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-value">{totalPodcasts}</span>
            <span className="metric-label">Podcasts</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#1D1D1F' }}>
            <Clock size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-value">{projetos.length}</span>
            <span className="metric-label">Total Projetos</span>
          </div>
        </div>
        {conflicts.length > 0 && (
          <div className="metric-card alert">
            <div className="metric-icon" style={{ color: '#FF3B30' }}>
              <AlertTriangle size={20} />
            </div>
            <div className="metric-info">
              <span className="metric-value">{conflicts.length}</span>
              <span className="metric-label">Conflitos</span>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        {onSaveAll && (
          <button 
            className="save-btn" 
            onClick={handleSave}
            disabled={isSaving}
            style={{ height: 'fit-content', background: isSaving ? '#8E8E93' : '#34C759', border: 'none', cursor: isSaving ? 'not-allowed' : 'pointer' }}
            title="Sincronizar e salvar tudo na nuvem"
          >
            {isSaving ? (
              <>
                <div className="spinner" /> Salvando...
              </>
            ) : (
              <>
                <Cloud size={16} /> Salvar Tudo
              </>
            )}
          </button>
        )}
        <button 
          className="save-btn" 
          onClick={onAddProjeto}
          style={{ height: 'fit-content' }}
        >
          <Plus size={16} /> Novo Projeto
        </button>
      </div>
    </header>
  );
};
