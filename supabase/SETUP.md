# Supabase Setup Guide for WrenchMC

This guide walks through setting up the Supabase backend for WrenchMC.

## Prerequisites

- A Supabase account (https://supabase.com)
- A new Supabase project created
- Supabase CLI installed (optional, for local development)

## Step 1: Set Up Environment Variables

Copy `.env.example` to `.env.local` in the project root and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Then update `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Find these values in your Supabase project:
1. **URL & Anon Key**: Settings → API → Project URL and Project API keys
2. **Service Role Key**: Settings → API → Project API keys (marked "Service role" / "secret")

## Step 2: Create Database Schema

1. Go to your Supabase project dashboard
2. Open **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/schema.sql` into the editor
5. Click **Run**

This creates three tables:
- `user_profiles` — user metadata (bike year/model)
- `specs` — technical specifications (torque specs, notes, etc.)
- `spec_votes` — user votes on specs (upvote/downvote)

## Step 3: Load Sample Data (Optional)

To populate test data:

1. In **SQL Editor**, create a new query
2. Copy the contents of `supabase/seed.sql`
3. Click **Run**

This adds sample specs and profiles for testing.

## Step 4: Enable Row Level Security (RLS)

RLS policies restrict data access based on user authentication and roles.

1. In **SQL Editor**, create a new query
2. Copy the contents of `supabase/rls_policies.sql`
3. Click **Run**

### RLS Policy Summary

| Table | Policy | Details |
|-------|--------|---------|
| `user_profiles` | view_own_profile | Users see only their own profile |
| | update_own_profile | Users update only their own profile |
| | insert_own_profile | Users create profile on signup |
| `specs` | view_approved_specs | Anyone sees approved specs |
| | view_all_specs_if_authenticated | Authenticated users see all specs |
| | insert_specs_authenticated | Authenticated users submit new specs |
| | update_own_unapproved_specs | Users edit their own unapproved specs |
| | approve_specs_admin | Service role can approve specs (backend only) |
| `spec_votes` | view_spec_votes | Anyone can view vote counts |
| | insert_own_votes | Users vote on specs |
| | update_own_votes | Users change their own votes |
| | delete_own_votes | Users delete their own votes |

## Step 5: Set Up Authentication

WrenchMC uses Supabase Auth (email/password or OAuth).

1. Go to **Authentication** → **Providers**
2. Enable desired providers (Email/Password is enabled by default)
3. (Optional) Enable OAuth: Google, GitHub, etc.

## Step 6: Configure API Routes

Backend API routes (in `src/app/api/`) use the Supabase server client to perform privileged operations:

- **POST `/api/specs`** — Submit a new spec (requires auth, auto-set `submitted_by`)
- **GET `/api/search`** — Search approved specs
- **POST `/api/specs/vote`** — Vote on a spec
- **POST `/api/admin/approve`** — Approve a spec (requires service role)

### Server-Side Client Setup

Your API routes already import the server client:

```typescript
import supabase from '@/lib/supabaseServer'
```

This client uses `SUPABASE_SERVICE_ROLE_KEY` for elevated privileges. **Keep this key secure** — only use it in server-side code, never expose it to the browser.

## Step 7: Test the App

1. Start the dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. Sign up with an email/password
4. Submit a spec (goes to moderation queue, `approved: false`)
5. Visit `/admin/moderation` to approve specs
6. Search for specs and vote

## Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is required"
- Check `.env.local` has both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Ensure they're not empty strings
- Restart the dev server after adding env vars

### RLS Policy Errors in API
- If you get "permission denied" errors, check that the policy matches your use case
- Verify the authenticated user ID is correct in the policy condition
- For admin endpoints, ensure the API uses the service role client

### Auth Not Persisting
- Supabase client caches session in localStorage
- Check browser DevTools → Application → Local Storage for `sb-` keys
- Clear cache and sign in again

## Production Deployment

When deploying to Vercel:

1. Go to Vercel project settings → **Environment Variables**
2. Add all three env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Re-deploy

**Security Note**: The service role key is secret and only for server-side use. Never expose it in client code or commit it to version control.

## References

- [Supabase Docs](https://supabase.com/docs)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JS SDK](https://supabase.com/docs/reference/javascript/introduction)
