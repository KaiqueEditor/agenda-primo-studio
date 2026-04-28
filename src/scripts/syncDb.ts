import { createClient } from '@supabase/supabase-js';
import { projetosAGF } from '../data/projects';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://eqndkrurbrfkvsywlatt.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7hviUsdyG9stubaA1jJtIA_FBN1eFrs'; // This is a public anon key from previous run

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncDb() {
  console.log('Syncing database...');
  
  // 1. Delete p19 and p20 from the database (old generic "Sustentação" projects)
  await supabase.from('projetos').delete().in('id', ['p19', 'p20']);
  console.log('Deleted legacy projects p19 and p20.');

  // 2. Upsert all current projects from projetosAGF
  for (const p of projetosAGF) {
    const { error } = await supabase.from('projetos').upsert({ id: p.id, data: p });
    if (error) {
      console.error('Error upserting project', p.id, error);
    } else {
      console.log('Upserted project:', p.id);
    }
  }

  console.log('Database sync complete!');
}

syncDb();
