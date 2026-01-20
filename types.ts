export type UserRole = 'agent' | 'superviseur' | 'gestionnaire';
export interface User { id: string; username: string; fullname: string; email: string; role: UserRole; departement: string; status: string; permissions: string[]; force_password_change?: boolean; }
export interface Rejet { id: number; reference: string; type: string; departement: string; charge: string; client_nom: string; client_compte: string; montant: number; date_operation: string; motif: string; commentaire: string; agent_id: string; date_saisie: string; statut: string; historique: any[]; }
export interface ActivityLog { id: number; timestamp: string; level: string; user: string; action: string; details: string; }
