import React, { useState } from 'react';
import { Calendar, LogIn, Eye, EyeOff } from 'lucide-react';

interface Props {
  onSignIn: (email: string, password: string) => void;
  onSignUp: (email: string, password: string) => void;
  onSignInWithGoogle: () => void;
  error: string | null;
  loading: boolean;
}

export const LoginPage: React.FC<Props> = ({ onSignIn, onSignUp, onSignInWithGoogle, error, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      onSignUp(email, password);
    } else {
      onSignIn(email, password);
    }
  };

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

        {/* Google Login Button */}
        <button 
          type="button" 
          className="google-btn" 
          onClick={onSignInWithGoogle}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Entrar com Google
        </button>

        <div className="login-divider">
          <span>ou</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Senha</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? (
              <><div className="spinner" /> Entrando...</>
            ) : (
              <><LogIn size={16} /> {isSignUp ? 'Criar Conta' : 'Entrar'}</>
            )}
          </button>
        </form>

        <div className="login-footer">
          <button className="login-toggle" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Já tenho conta → Entrar' : 'Primeiro acesso? → Criar conta'}
          </button>
        </div>
      </div>
    </div>
  );
};
