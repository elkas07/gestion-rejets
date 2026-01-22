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
      return (data?.map(u => ({
        ...u,
        permissions: Array.isArray(u.permissions) ? u.permissions : []
      })) as User[]) || [];
    } catch (e) {
      console.error("Erreur getUsers:", e);
      return [];
    }
  },

  addUser: async (userData: any) => {
    const { data, error } = await supabase.from('users').insert([userData]).select().single();
    if (error) throw error;
    return data;
  },

  updateUser: async (id: string, updates: any) => {
    const { error } = await supabase.from('users').update(updates).eq('id', id);
    if (error) throw error;
  },

  getRejets: async (): Promise<Rejet[]> => {
    try {
      const { data, error } = await supabase.from('rejets').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data?.map(r => ({
        ...r,
        montant: Number(r.montant) || 0,
        historique: Array.isArray(r.historique) ? r.historique : 
                   (typeof r.historique === 'string' ? JSON.parse(r.historique) : [])
      })) as Rejet[]) || [];
    } catch (e) {
      console.error("Erreur getRejets:", e);
      return [];
    }
  },

  saveRejet: async (rejet: any) => {
    const { id, updated_at, type_autre, created_at, ...cleanData } = rejet;
    
    const payload = {
      ...cleanData,
      montant: Number(cleanData.montant),
      historique: Array.isArray(cleanData.historique) ? cleanData.historique : [],
      updated_at: new Date().toISOString()
    };
    
    if (id) {
      const { data, error } = await supabase
        .from('rejets')
        .update(payload)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('rejets')
        .insert(payload)
        .select();
      if (error) throw error;
      return data;
    }
  },

  deleteRejet: async (id: number) => {
    const { error } = await supabase.from('rejets').delete().eq('id', id);
    if (error) throw error;
  },

  getLogs: async (): Promise<ActivityLog[]> => {
    try {
      const { data, error } = await supabase.from('journal_activite').select('*').order('created_at', { ascending: false }).limit(50);
      if (error) return [];
      return (data?.map(l => ({ 
        id: l.id,
        timestamp: l.created_at, 
        user: l.user_id,
        action: l.action,
        level: l.niveau || 'info',
        details: l.details
      })) as ActivityLog[]) || [];
    } catch (e) {
      return [];
    }
  },

  addLog: async (log: { level: string, user: string, action: string, details: string }) => {
    try {
      await supabase.from('journal_activite').insert([{
        niveau: log.level,
        user_id: log.user,
        action: log.action,
        details: log.details
      }]);
    } catch (e) {}
  }
};