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
  'kaique@primostudio.com.br',
  'kaique@agf.com.br',
  'isadora@primostudio.com.br',
  'itala@primostudio.com.br',
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

  const signUp = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
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

  const user: AppUser | null = session?.user ? {
    email: session.user.email || '',
    role: ADMIN_EMAILS.includes(session.user.email?.toLowerCase() || '') ? 'admin' : 'viewer',
    displayName: session.user.email?.split('@')[0] || 'Usuário',
  } : null;

  return {
    session,
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    isAdmin: user?.role === 'admin',
  };
};
