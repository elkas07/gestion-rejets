
export type UserRole = 'agent' | 'superviseur' | 'gestionnaire';

export interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  role: UserRole;
  departement: string;
  status: 'active' | 'suspended' | 'inactive';
  permissions: string[];
  created_at: string;
  force_password_change?: boolean;
}

export interface Rejet {
  id: number;
  reference: string;
  type: string;
  departement: string;
  charge: string;
  client_nom: string;
  client_compte: string;
  montant: number;
  date_operation: string;
  motif: string;
  commentaire: string;
  motif_retour?: string;
  agent_id: string;
  date_saisie: string;
  statut: 'enregistre' | 'attente_validation' | 'valide' | 'transmis' | 'recu';
  historique: HistoriqueItem[];
}

export interface HistoriqueItem {
  action: string;
  user: string;
  date: string;
  role: string;
}

export interface ActivityLog {
  id: number;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'security';
  user: string;
  action: string;
  details: string;
}
