import { createClient } from '@supabase/supabase-js';
import { User, Rejet, ActivityLog } from '../types';

const supabaseUrl = 'https://qldfjdmpzvyhgsmepynp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsZGZqZG1wenZ5aGdzbWVweW5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0OTU3NTEsImV4cCI6MjA4NDA3MTc1MX0.xAm9RrmzMCuxMfu4xjygPZMyiNbJqSXH9L_GNegbiBI';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseService = {
  getUsers: async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      return (data?.map(u => ({ ...u, permissions: Array.isArray(u.permissions) ? u.permissions : [] })) as User[]) || [];
    } catch (e) { return []; }
  },
  getRejets: async (): Promise<Rejet[]> => {
    try {
      const { data, error } = await supabase.from('rejets').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data?.map(r => ({ ...r, montant: Number(r.montant) || 0, historique: Array.isArray(r.historique) ? r.historique : [] })) as Rejet[]) || [];
    } catch (e) { return []; }
  },
  saveRejet: async (rejet: any) => {
    const { id, ...dataToSave } = rejet;
    const payload = { ...dataToSave, montant: Number(dataToSave.montant), updated_at: new Date().toISOString() };
    const { error } = await supabase.from('rejets').upsert(payload, { onConflict: 'reference' });
    if (error) throw error;
  },
  addLog: async (log: any) => {
    try { await supabase.from('journal_activite').insert([{ niveau: log.level, user_id: log.user, action: log.action, details: log.details }]); } catch (e) {}
  }
};
