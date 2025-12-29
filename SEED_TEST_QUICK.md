# QUICK START: Seed & Test WrenchMC

You have real Supabase credentials in `.env.local`. Do this now:

## 1. Copy & Apply SQL Migrations

Go to: https://app.supabase.com → your project → SQL Editor

**Create 3 new queries and run them in order:**

### Query 1: Schema
Copy from: `supabase/schema.sql`
(Creates 3 tables)

### Query 2: RLS Policies  
Copy from: `supabase/rls_policies.sql`
(Enables security)

### Query 3: Seed Data
Copy from: `supabase/seed.sql`
(Adds 3 sample specs)

## 2. Start Dev Server
```bash
npm run dev
```

Wait for "Ready in X ms"

## 3. Test in Browser

| Test | URL | Expected | Notes |
|------|-----|----------|-------|
| **Search specs** | http://localhost:3000/search | See "Transmission cover" | Public, no auth needed |
| **Sign up** | http://localhost:3000/auth/login | Create account | Check DevTools → Local Storage for `sb-` keys |
| **View profile** | http://localhost:3000/profile | Save bike year/model | Creates row in `user_profiles` |
| **Voice search** | http://localhost:3000/voice | Say "transmission" | Chrome/Edge only; allow microphone |
| **Submit spec** | http://localhost:3000/specs/new | Fill form & submit | Goes to moderation queue |
| **Approve spec** | http://localhost:3000/admin/moderation | See unapproved specs; click Approve | Uses service role to set `approved: true` |
| **Upvote** | http://localhost:3000/search | Click vote button | Creates row in `spec_votes` |

## 4. Verify in Supabase

Go to Table Editor → check row counts:
- `specs` — Should have 4 rows (3 seed + 1 from test)
- `user_profiles` — Should have 1 row (your account)
- `spec_votes` — Should have 1+ rows (your upvotes)

## 5. Check RLS Working

Open incognito window → http://localhost:3000/search → search still works
- This proves RLS allows public read of approved specs
- If you submit an unapproved spec, incognito user won't see it

## Done! ✓

Your MVP is now:
- ✓ Deployed locally with real Supabase
- ✓ Database secured with RLS policies
- ✓ Voice search working (Chrome)
- ✓ User auth + profiles
- ✓ Spec submission + moderation
- ✓ Voting system
- ✓ PWA installable

Next: Deploy to Vercel with same env vars.

See `TESTING.md` for detailed tests.
