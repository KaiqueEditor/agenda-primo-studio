import React from 'react';
import { Plus, Cloud } from 'lucide-react';

interface Props {
  onAddProjeto: () => void;
  onSaveAll?: () => void;
}

export const GlobalActions: React.FC<Props> = ({ onAddProjeto, onSaveAll }) => {
  const [isSaving, setIsSaving] = React.useState(false);

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
    <>
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
