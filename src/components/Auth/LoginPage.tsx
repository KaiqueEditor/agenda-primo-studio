import React, { useState } from 'react';
import { Calendar, LogIn, Eye, EyeOff } from 'lucide-react';

interface Props {
  onSignIn: (email: string, password: string) => void;
  onSignUp: (email: string, password: string) => void;
  error: string | null;
  loading: boolean;
}

export const LoginPage: React.FC<Props> = ({ onSignIn, onSignUp, error, loading }) => {
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
              autoFocus
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
