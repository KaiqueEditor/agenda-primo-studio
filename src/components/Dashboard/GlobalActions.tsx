import React, { useState, useEffect } from 'react';
import { Plus, Cloud, Camera, AlertTriangle, X } from 'lucide-react';
import type { Projeto } from '../../types';
import { detectConflicts } from '../../utils/dateHelpers';
import * as htmlToImage from 'html-to-image';

interface Props {
  projetos: Projeto[];
  onAddProjeto: () => void;
  onSaveAll?: () => void;
}

export const GlobalActions: React.FC<Props> = ({ projetos, onAddProjeto, onSaveAll }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showConflicts, setShowConflicts] = useState(false);
  const conflicts = detectConflicts(projetos);

  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  const handleSave = async () => {
    if (!onSaveAll) return;
    setIsSaving(true);
    try {
      await onSaveAll();
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const el = document.querySelector('.view-area') as HTMLElement;
    if (!el) return;
    htmlToImage.toPng(el, { backgroundColor: '#F8F9FA' }).then(dataUrl => {
      const link = document.createElement('a');
      link.download = 'agf-calendar-export.png';
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <>
      {showToast && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: '#34C759', color: 'white', padding: '12px 24px', borderRadius: '100px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', zIndex: 9999, boxShadow: '0 8px 30px rgba(52,199,89,0.3)', animation: 'slideUp 0.3s ease' }}>
          <span>✅ Alterações salvas com sucesso!</span>
        </div>
      )}

      {conflicts.length > 0 && (
        <div style={{ position: 'relative' }}>
          <button 
            className="save-btn" 
            style={{ background: 'rgba(255,59,48,0.1)', color: '#FF3B30', borderColor: 'transparent' }}
            onClick={() => setShowConflicts(true)}
          >
            <AlertTriangle size={16} />
            {conflicts.length} Conflitos
          </button>
          
          {showConflicts && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--bg-elevated)', borderRadius: '12px', padding: '16px', width: '320px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', zIndex: 100 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, color: '#FF3B30', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={14}/> Conflitos Detectados</h4>
                <button onClick={() => setShowConflicts(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={14}/></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                {conflicts.map((c, i) => (
                  <div key={i} style={{ fontSize: '13px', background: 'var(--bg-main)', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #FF3B30' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{c.casting}</strong> está locado em:<br/>
                    <span style={{ color: 'var(--text-secondary)' }}>• {c.projeto1.titulo}</span><br/>
                    <span style={{ color: 'var(--text-secondary)' }}>• {c.projeto2.titulo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <button className="save-btn secondary-btn" onClick={handleExport} title="Exportar como Imagem">
        <Camera size={16} /> Exportar
      </button>

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
    </>
  );
};
