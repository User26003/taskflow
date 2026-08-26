# TaskFlow

Application SaaS de gestion de tâches : liste, Kanban, priorités, échéances, filtres, archivage et authentification.

## Stack

- Next.js 16 (App Router, proxy.ts)
- React 19 + TypeScript
- Tailwind CSS v4
- Supabase (Auth + PostgreSQL + RLS)
- dnd-kit, Sonner, Vitest

## Installation

```bash
git clone https://github.com/User26003/taskflow.git
cd taskflow
npm install
cp .env.example .env.local
```

Renseigne `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans `.env.local`.

## Supabase (obligatoire)

1. Crée un projet Supabase.
2. SQL Editor → exécute `supabase/migrations/001_initial_schema.sql`
3. Auth → active Email
4. Callback URL : `http://localhost:3000/auth/callback` (et ton URL de prod)

## Commandes

```bash
npm run dev          # local
npm run lint
npm run typecheck
npm run test
npm run build
npm run start
```

## Sécurité

Mutations via Server Actions + RLS. Isolation stricte par utilisateur. Voir `SECURITY.md`.

## Déploiement (Vercel)

1. Importe le repo sur Vercel
2. Ajoute les 2 variables d’environnement
3. Déploie
4. Configure le callback Auth avec l’URL Vercel
