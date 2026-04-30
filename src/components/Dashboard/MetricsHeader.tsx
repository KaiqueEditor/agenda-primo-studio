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
    <header className="metrics-header">
      <div className="metrics-left">
        <div className="metric-pill">
          <div className="metric-icon">
            <Video size={16} />
          </div>
          <div className="metric-info">
            <span className="metric-value">{totalVideos}</span>
            <span className="metric-label">Vídeos</span>
          </div>
        </div>
        <div className="metric-pill">
          <div className="metric-icon">
            <Mic size={16} />
          </div>
          <div className="metric-info">
            <span className="metric-value">{totalPodcasts}</span>
            <span className="metric-label">Podcasts</span>
          </div>
        </div>
        <div className="metric-pill">
          <div className="metric-icon">
            <Clock size={16} />
          </div>
          <div className="metric-info">
            <span className="metric-value">{projetos.length}</span>
            <span className="metric-label">Total Projetos</span>
          </div>
        </div>
        {conflicts.length > 0 && (
          <div className="metric-pill alert">
            <div className="metric-icon" style={{ color: '#FF3B30', background: 'rgba(255,59,48,0.1)' }}>
              <AlertTriangle size={16} />
            </div>
            <div className="metric-info">
              <span className="metric-value" style={{ color: '#FF3B30' }}>{conflicts.length}</span>
              <span className="metric-label">Conflitos</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="metrics-actions">
        {onSaveAll && (
          <button 
            className="save-btn secondary-btn" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <div className="spinner-small" /> : <Cloud size={16} />}
            {isSaving ? 'Salvando...' : 'Salvar Tudo'}
          </button>
        )}
        <button 
          className="save-btn primary-btn" 
          onClick={onAddProjeto}
        >
          <Plus size={16} /> Novo Projeto
        </button>
      </div>
    </header>
  );
};
