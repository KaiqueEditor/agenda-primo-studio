import React, { useState } from 'react';
import { Calendar, LogIn, Eye, EyeOff, Mail } from 'lucide-react';

interface Props {
  onSignIn: (email: string, password: string) => void;
  onSignUp: (email: string, password: string, nick: string) => void;
  onSignInWithMagicLink: (email: string) => Promise<boolean>;
  error: string | null;
  loading: boolean;
}

export const LoginPage: React.FC<Props> = ({ onSignIn, onSignUp, onSignInWithMagicLink, error, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nick, setNick] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (isSignUp) {
      if (password !== confirmPassword) {
        setLocalError('As senhas não coincidem');
        return;
      }
      if (!nick.trim()) {
        setLocalError('Por favor, informe seu nome/nick');
        return;
      }
      onSignUp(email, password, nick);
    } else {
      onSignIn(email, password);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setLocalError('Digite seu email primeiro');
      return;
    }
    setLocalError(null);
    const ok = await onSignInWithMagicLink(email);
    if (ok) setMagicLinkSent(true);
  };

  const displayError = localError || error;

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Calendar size={32} />
          </div>
          <h1>Agenda Primo.Studio</h1>
          <p>Gestão de produção e cronograma</p>
        </div>

        {magicLinkSent ? (
          <div className="magic-link-sent">
            <Mail size={32} />
            <h3>Link enviado!</h3>
            <p>Verifique sua caixa de entrada em <strong>{email}</strong></p>
            <button className="login-toggle" onClick={() => setMagicLinkSent(false)}>← Voltar</button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="login-form">
              {isSignUp && (
                <div className="login-field">
                  <label htmlFor="nick">Nome / Nick</label>
                  <input id="nick" type="text" value={nick} onChange={(e) => setNick(e.target.value)} placeholder="Como devemos te chamar?" required />
                </div>
              )}

              <div className="login-field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
              </div>

              <div className="login-field">
                <label htmlFor="password">Senha</label>
                <div className="password-wrapper">
                  <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="login-field">
                  <label htmlFor="confirmPassword">Confirmar Senha</label>
                  <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                </div>
              )}

              {displayError && <div className="login-error">{displayError}</div>}

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? <><div className="spinner" /> Entrando...</> : <><LogIn size={16} /> {isSignUp ? 'Criar Conta' : 'Entrar'}</>}
              </button>
            </form>

            <div className="login-footer">
              <button className="login-toggle" onClick={() => { setIsSignUp(!isSignUp); setLocalError(null); }}>
                {isSignUp ? 'Já tenho conta → Entrar' : 'Primeiro acesso? → Criar conta'}
              </button>
              {!isSignUp && (
                <button className="magic-link-btn" onClick={handleMagicLink} disabled={loading}>
                  <Mail size={14} /> Entrar só com email (sem senha)
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
