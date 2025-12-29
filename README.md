# WrenchMC — MVP

Community-driven Harley-Davidson technical specs database (MVP).

Features:
- User profiles with bike saved
- Searchable specs filtered by saved bike
- Voice query using Web Speech API (client-side TTS/STT)
- Admin moderation queue
- PWA-ready skeleton

Setup (local):

**See [supabase/SETUP.md](supabase/SETUP.md) for detailed step-by-step instructions.**

Quick start:

1. Create a free Supabase project: https://app.supabase.com
2. Copy credentials to `.env.local` (see Environment variables below)
3. Apply SQL migrations:
   - `supabase/schema.sql` (tables)
   - `supabase/rls_policies.sql` (row-level security)
   - `supabase/seed.sql` (sample data)
4. Install dependencies and run:

```bash
npm install
npm run dev
```

Environment variables (.env.local):

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Deployment:
- Push to GitHub and connect to Vercel
- Add env vars in Vercel dashboard (all three: SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY)
- The service role key is secret — never commit to version control or expose in client code

Seeding:
- Use the SQL file or create a simple seed script to insert common models and a few specs for testing.

Security / RLS notes:
- Comprehensive RLS policies are in `supabase/rls_policies.sql` — apply these in Supabase SQL editor
- Policies restrict access: users see only approved specs; authenticated users can submit specs; admins approve via service role (server-side)
- For production: use secure server auth and strict RLS policies (already configured)

Next steps implemented in this scaffold:
- Voice search with Web Speech API: `src/components/VoiceController.tsx` + `src/app/voice`
- Submit new specs page: `src/app/specs/new`
- Moderation approve action: `src/app/api/admin/approve/route.ts`
- Voting API: `src/app/api/specs/vote/route.ts`


Notes:
- This is an initial scaffold. Implement more robust auth checks, RLS policies, and validation before production.
