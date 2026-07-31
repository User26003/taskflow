# TaskFlow

Application de gestion de tâches moderne : liste, Kanban, priorités, échéances,
catégories, recherche, tri, archivage et authentification.

## Stack

- Next.js 16 (App Router, Turbopack)
- React + TypeScript
- Tailwind CSS v4
- Supabase (Auth + PostgreSQL + RLS)
- dnd-kit (drag and drop Kanban)
- Sonner (notifications)

## Fonctionnalités

- Authentification email/mot de passe
- Réinitialisation de mot de passe
- CRUD complet des tâches
- Statuts : à faire / en cours / terminé
- Priorités : basse / moyenne / haute
- Catégories et échéances
- Détection des tâches en retard
- Recherche, tri et filtres avancés
- Vue liste et vue Kanban avec glisser-déposer
- Archivage des tâches
- Préférences de profil (vue par défaut)
- Design épuré, responsive, style SaaS

## Installation locale

```bash
git clone https://github.com/User26003/taskflow.git
cd taskflow
npm install