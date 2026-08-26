# Security Policy

## Reporting
Open a private GitHub security advisory.

## Model
- Supabase Auth + RLS (`auth.uid() = user_id`)
- Server Actions validate session and inputs
- No service_role key in the client or repo
- `user_id` cannot be changed after insert
