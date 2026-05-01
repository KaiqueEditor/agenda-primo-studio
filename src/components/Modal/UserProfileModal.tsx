import React, { useState } from 'react';
import { X, User, Mail, Save, Lock, Eye, EyeOff } from 'lucide-react';
import type { AppUser } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { toast } from '../UI/Toast';

interface Props {
  user: AppUser;
  onClose: () => void;
}

export const UserProfileModal: React.FC<Props> = ({ user, onClose }) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    // Update display name if changed
    if (displayName !== user.displayName) {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName },
      });
      if (error) {
        toast.error('Erro ao atualizar nome: ' + error.message);
        setLoading(false);
        return;
      }
    }

    // Update email if changed
    if (email !== user.email) {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) {
        toast.error('Erro ao atualizar email: ' + error.message);
        setLoading(false);
        return;
      }
      toast.success('Link de confirmação enviado para os dois emails.');
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        toast.error('Informe a senha atual para alterar a senha.');
        setLoading(false);
        return;
      }
      if (newPassword.length < 6) {
        toast.error('A nova senha deve ter pelo menos 6 caracteres.');
        setLoading(false);
        return;
      }

      // Verify current password by re-signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (signInError) {
        toast.error('Senha atual incorreta.');
        setLoading(false);
        return;
      }

      const { error: pwError } = await supabase.auth.updateUser({ password: newPassword });
      if (pwError) {
        toast.error('Erro ao trocar senha: ' + pwError.message);
        setLoading(false);
        return;
      }
      toast.success('Senha alterada com sucesso.');
      setCurrentPassword('');
      setNewPassword('');
    }

    setLoading(false);
    if (displayName !== user.displayName && !newPassword && email === user.email) {
      toast.success('Nome atualizado. Recarregue para ver a mudança.');
    }
    onClose();
  };

  const labelStyle: React.CSSProperties = { fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' };
  const inputStyle: React.CSSProperties = { padding: '10px 12px', resize: 'none' as const };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '420px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>

        <div className="modal-header">
          <h2 style={{ fontSize: '18px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} /> Perfil do Usuário
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
            Edite seu nome, email ou altere sua senha.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          {/* Name */}
          <div>
            <label style={labelStyle}><User size={12} /> Nome / Nick</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="modal-textarea"
              style={inputStyle}
              placeholder="Seu nome ou nick"
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}><Mail size={12} /> Email de Acesso</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="modal-textarea"
              style={inputStyle}
            />
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />

          {/* Current Password */}
          <div>
            <label style={labelStyle}><Lock size={12} /> Senha Atual</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrentPw ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="modal-textarea"
                style={{ ...inputStyle, paddingRight: '36px' }}
                placeholder="Deixe vazio se não for trocar"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex' }}
              >
                {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label style={labelStyle}><Lock size={12} /> Nova Senha</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNewPw ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="modal-textarea"
                style={{ ...inputStyle, paddingRight: '36px' }}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex' }}
              >
                {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

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
  );
};
