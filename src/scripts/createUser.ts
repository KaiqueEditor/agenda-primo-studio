import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eqndkrurbrfkvsywlatt.supabase.co';
const supabaseKey = 'sb_publishable_7hviUsdyG9stubaA1jJtIA_FBN1eFrs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser() {
  // Try sign up
  const { data, error } = await supabase.auth.signUp({
    email: 'kaique@primostudio.com.br',
    password: 'primo2026',
  });

  if (error) {
    console.error('Error:', error.message);
    
    // If user already exists, try signing in
    if (error.message.includes('already')) {
      console.log('User may already exist, trying sign in...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'kaique@primostudio.com.br',
        password: 'primo2026',
      });
      if (signInError) {
        console.error('Sign in error:', signInError.message);
      } else {
        console.log('Sign in successful!', signInData.user?.email);
      }
    }
  } else {
    console.log('User created!', data.user?.email);
    console.log('Session:', data.session ? 'Active' : 'Needs email confirmation');
    
    if (!data.session) {
      console.log('\n⚠️  Supabase requires email confirmation.');
      console.log('You need to disable "Confirm email" in Supabase Dashboard:');
      console.log('→ Authentication → Providers → Email → Disable "Confirm email"');
      console.log('\nOr use the Supabase Dashboard to manually confirm the user.');
    }
  }
}

createUser();
