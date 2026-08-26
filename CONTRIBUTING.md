# Contributing

1. Fork + clone
2. `cp .env.example .env.local` + fill Supabase keys
3. Run SQL migration from `supabase/migrations/`
4. `npm install && npm run dev`
5. Before PR: `npm run lint && npm run typecheck && npm run test && npm run build`
