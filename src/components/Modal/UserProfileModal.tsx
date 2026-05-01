import React, { useState } from 'react';
import { X, User, Mail, Save } from 'lucide-react';
import type { AppUser } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { toast } from '../UI/Toast';

interface Props {
  user: AppUser;
  onClose: () => void;
}

export const UserProfileModal: React.FC<Props> = ({ user, onClose }) => {
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (email === user.email) {
      onClose();
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ email });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Um link de confirmação foi enviado para os dois emails. Confirme a alteração.');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '400px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>

        <div className="modal-header">
          <h2 style={{ fontSize: '20px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} /> Perfil do Usuário
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Visualize ou altere as informações da sua conta.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div className="login-field" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Nome / Nick</label>
            <div style={{ background: 'var(--bg-main)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', color: 'var(--text-secondary)' }}>
              {user.displayName}
            </div>
          </div>
          
          <div className="login-field" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={12} /> Email de Acesso
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="modal-textarea"
              style={{ padding: '10px 12px', resize: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="save-btn" 
            onClick={handleSave}
            disabled={loading}
            style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? <div className="spinner" style={{ width: '16px', height: '16px' }} /> : <Save size={16} />}
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
};
