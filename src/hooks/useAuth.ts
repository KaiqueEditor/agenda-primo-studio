import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'viewer';

export interface AppUser {
  email: string;
  role: UserRole;
  displayName: string;
}

// Define who is admin — everyone else is viewer
const ADMIN_EMAILS = [
  'kaiqueseditor@gmail.com',
  'kaique@primostudio.com.br',
  'kaique@agf.com.br',
  'isadora@primostudio.com.br',
  'isadora.novaes@timeprimo.com',
  'itala@primostudio.com.br',
  'juan@timeprimo.com',
  'juan@primostudio.com.br',
  'juan.paul@timeprimo.com',
  'renan@timeprimo.com',
  'renan@primostudio.com.br',
  'renan.spurio@timeprimo.com',
];

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message === 'Invalid login credentials' 
        ? 'Email ou senha incorretos' 
        : error.message);
    }
    setLoading(false);
  };

  const signUp = async (email: string, password: string, nick: string) => {
    setError(null);
    setLoading(true);

    const isTimePrimo = email.toLowerCase().endsWith('@timeprimo.com');
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());

    if (!isTimePrimo && !isAdmin) {
      setError('Apenas emails @timeprimo.com estão autorizados a criar conta.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          display_name: nick,
        }
      }
    });
    if (error) {
      setError(error.message);
    } else {
      setError(null);
    }
    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };



  const signInWithMagicLink = async (email: string) => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      setError(error.message);
    } else {
      setError(null);
    }
    setLoading(false);
    return !error;
  };

  const user: AppUser | null = session?.user ? {
    email: session.user.email || '',
    role: ADMIN_EMAILS.includes(session.user.email?.toLowerCase() || '') ? 'admin' : 'viewer',
    displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Usuário',
  } : null;

  return {
    session,
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithMagicLink,
    isAdmin: user?.role === 'admin',
  };
};
