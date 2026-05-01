import React, { useState } from 'react';
import { X, Plus, Pencil, Trash2, Check } from 'lucide-react';

export type TagCategory = 'formato' | 'canal' | 'responsavel';

const CATEGORY_LABELS: Record<TagCategory, string> = {
  formato: 'Formatos',
  canal: 'Canais',
  responsavel: 'Responsáveis',
};

interface Props {
  category: TagCategory;
  tags: string[];
  onClose: () => void;
  onSave: (tags: string[]) => void;
}

export const TagManagerModal: React.FC<Props> = ({ category, tags: initialTags, onClose, onSave }) => {
  const [tags, setTags] = useState<string[]>([...initialTags].sort());
  const [newTag, setNewTag] = useState('');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (tags.some(t => t.toLowerCase() === trimmed.toLowerCase())) return;
    setTags(prev => [...prev, trimmed].sort());
    setNewTag('');
  };

  const handleDelete = (idx: number) => {
    setTags(prev => prev.filter((_, i) => i !== idx));
  };

  const handleStartEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditValue(tags[idx]);
  };

  const handleConfirmEdit = () => {
    if (editingIdx === null) return;
    const trimmed = editValue.trim();
    if (!trimmed) return;
    setTags(prev => {
      const updated = [...prev];
      updated[editingIdx] = trimmed;
      return updated.sort();
    });
    setEditingIdx(null);
    setEditValue('');
  };

  const handleSave = () => {
    onSave(tags);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '420px', width: '90%' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>

        <div className="modal-header">
          <h2 style={{ fontSize: '18px', marginBottom: '4px' }}>
            Gerenciar {CATEGORY_LABELS[category]}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
            Adicione, edite ou remova tags.
          </p>
        </div>

        {/* Add new */}
        <div className="tag-mgr-add">
          <input
            type="text"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            placeholder={`Nova tag...`}
            className="tag-mgr-input"
          />
          <button className="tag-mgr-add-btn" onClick={handleAdd} disabled={!newTag.trim()}>
            <Plus size={14} /> Adicionar
          </button>
        </div>

        {/* Tag list */}
        <div className="tag-mgr-list">
          {tags.length === 0 && (
            <div className="tag-mgr-empty">Nenhuma tag cadastrada.</div>
          )}
          {tags.map((tag, idx) => (
            <div key={`${tag}-${idx}`} className="tag-mgr-item">
              {editingIdx === idx ? (
                <div className="tag-mgr-edit-row">
                  <input
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleConfirmEdit(); }}
                    className="tag-mgr-input"
                    autoFocus
                  />
                  <button className="tag-mgr-icon-btn confirm" onClick={handleConfirmEdit} title="Confirmar">
                    <Check size={14} />
                  </button>
                  <button className="tag-mgr-icon-btn" onClick={() => setEditingIdx(null)} title="Cancelar">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="tag-mgr-name">{tag}</span>
                  <div className="tag-mgr-actions">
                    <button className="tag-mgr-icon-btn" onClick={() => handleStartEdit(idx)} title="Editar">
                      <Pencil size={13} />
                    </button>
                    <button className="tag-mgr-icon-btn danger" onClick={() => handleDelete(idx)} title="Apagar">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="tag-mgr-footer">
          <button className="save-btn" onClick={handleSave} style={{ width: '100%' }}>
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};
