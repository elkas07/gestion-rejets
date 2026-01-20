# EcoBank - Système de Gestion des Rejets (SGR)

Application web professionnelle de gestion et de traçabilité des rejets d'opérations bancaires pour EcoBank.

## 🚀 Fonctionnalités Implémentées

- **Tableau de Bord Analytique** : 
  - Statistiques en temps réel (Aujourd'hui, Mois, Total).
  - Répartition visuelle par **Type d'opération** (OV, RC, PC).
  - Suivi de l'état d'avancement des dossiers.
- **Gestion des Types d'Opérations** :
  - **OV** (Ordre de Virement) - Badge Bleu.
  - **RC** (Remise Chèque) - Badge Violet.
  - **PC** (Prélèvement Chèque) - Badge Orange.
- **Workflow de Validation** :
  - Saisie par l'Agent OPS.
  - Validation par le Superviseur.
  - Confirmation par le Gestionnaire de Compte.
- **Reporting & Data** :
  - **Export CSV** : Génération instantanée de rapports pour Excel avec filtrage dynamique.
  - **Export PDF** : Rapports de synthèse officiels EcoBank.
- **Sécurité & Audit** :
  - Journal d'activité (Logs) détaillé.
  - Gestion des rôles et permissions.

## 🛠️ Installation Locale

1. Cloner le projet : `git clone <url-du-depot>`
2. Ouvrir avec un serveur local.
3. Configuration de la base de données via `services/supabase.ts`.

---
*Usage interne EcoBank - Direction des Opérations.*
