# WrenchMC Seeding & Testing Guide

You have real Supabase credentials in `.env.local`. Follow these steps to seed the database and test end-to-end.

## Step 1: Apply Migrations to Supabase

You have three SQL files to apply in order:
1. `supabase/schema.sql` — Creates tables
2. `supabase/rls_policies.sql` — Enables row-level security
3. `supabase/seed.sql` — Adds sample data

### Apply via Supabase SQL Editor (Recommended)

1. Go to https://app.supabase.com
2. Select your project
3. Open **SQL Editor** (left sidebar)
4. Create a **New query** (top-right button)

#### Query 1: Schema
- Copy entire contents of `supabase/schema.sql`
- Paste into the SQL editor
- Click **Run**
- Wait for success message

#### Query 2: RLS Policies
- Create a **New query**
- Copy entire contents of `supabase/rls_policies.sql`
- Paste into the SQL editor
- Click **Run**
- Wait for success message

#### Query 3: Seed Data
- Create a **New query**
- Copy entire contents of `supabase/seed.sql`
- Paste into the SQL editor
- Click **Run**
- Wait for success message

### Verify in Supabase Dashboard

After running migrations:

1. Open **Table Editor** (left sidebar)
2. You should see three tables:
   - `specs` — Should have 3 sample rows (transmission cover, chain adjuster, exhaust nut)
   - `spec_votes` — Empty (votes created by users)
   - `user_profiles` — Empty (created when users sign up)

## Step 2: Start the Dev Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` with your real Supabase connection active.

## Step 3: Run Manual Tests

### Test 1: Public Spec Search (No Auth Required)
1. Open http://localhost:3000/search
2. Search for "transmission"
3. Should see: **Transmission cover** (M8, 20-25 Nm, 2018 Softail)
4. This works because the spec is `approved: true` and RLS policy allows public read

### Test 2: Authentication
1. Visit http://localhost:3000/auth/login
2. Click **Sign up**
3. Enter test email (e.g., `test@example.com`) and password
4. Check browser DevTools → Application → Local Storage
5. Should see `sb-*` keys (Supabase session)

### Test 3: User Profile
1. After signing up, visit http://localhost:3000/profile
2. Select a bike year and model
3. Click **Save**
4. Check Supabase **Table Editor** → `user_profiles`
5. Should see a new row with your user ID

### Test 4: Voice Search (Chrome/Edge only)
1. Visit http://localhost:3000/voice
2. Click **Start Listening**
3. Say "transmission" or "chain"
4. Should hear TTS response: "Found specs for transmission"
5. Click a result to see details

### Test 5: Submit a Spec
1. Visit http://localhost:3000/specs/new
2. Fill in the form:
   - Component: "Test bolt"
   - Bolt size: "M6"
   - Torque low: "10"
   - Torque high: "12"
3. Click **Submit**
4. Check Supabase **Table Editor** → `specs`
5. New row should appear with `approved: false`
6. It won't show in search (RLS policy blocks unapproved)

### Test 6: Admin Moderation
1. Visit http://localhost:3000/admin/moderation
2. Should see your unapproved "Test bolt" spec
3. Click **Approve**
4. Go back to http://localhost:3000/search
5. Search for "test"
6. Now you should see "Test bolt" in results

### Test 7: Voting
1. On the search page, find a spec result
2. Click the upvote button
3. Check Supabase **Table Editor** → `spec_votes`
4. New row with `up: true` should appear

## Step 4: Verify RLS Policies

RLS prevents unauthorized data access at the database level.

### Test: Unauthenticated user cannot see unapproved specs
1. Open http://localhost:3000/search in an **Incognito window** (no session)
2. Search — should only see approved specs
3. Refresh the private window — still only approved specs
4. This proves RLS is working (database rejects unapproved read)

### Test: User can only edit their own profile
1. In Supabase SQL editor, try:
   ```sql
   select * from user_profiles;
   ```
2. Success (you have service role)
3. But if another user tries to UPDATE your profile via the app, RLS blocks it

## Step 5: Automated Testing (Optional)

Run the end-to-end test script:

```bash
# Make it executable
chmod +x test-e2e.sh

# Run it (make sure `npm run dev` is running)
bash test-e2e.sh
```

This will:
- Check frontend routes return 200
- Verify API endpoints are accessible
- Query Supabase for seeded data
- Print test results

## Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is required"
- **Cause**: `.env.local` missing or empty
- **Fix**: Ensure `.env.local` has all three keys (check [README](../README.md))
- **Action**: Restart dev server after adding env vars

### Search returns no results
- **Cause**: Seed data didn't apply
- **Fix**: Re-run `supabase/seed.sql` in SQL editor
- **Check**: Supabase Table Editor → `specs` should show 3 rows

### Submit spec not appearing in moderation queue
- **Cause**: User not authenticated or RLS policy blocking insert
- **Fix**: Sign up first at `/auth/login`
- **Check**: Supabase Table Editor → `specs` → filter by your user ID

### RLS permission denied error
- **Cause**: Policy config mismatch or missing user auth
- **Fix**: Check browser console for error; verify RLS policies are applied
- **Debug**: Try the SQL editor and run policies again

### Voice recognition not working
- **Cause**: Only works in Chrome/Edge; requires HTTPS in production
- **Action**: Use Chrome; allow microphone permission when prompted

## Next: Production Deployment

When ready to deploy to production:

1. **Set Supabase env vars in Vercel**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

2. **Ensure RLS policies are applied** in your production Supabase project

3. **Review security**:
   - Service role key is secret — never expose
   - RLS policies enforce data access
   - Users can't bypass via API

4. **Deploy**:
   ```bash
   git push
   ```
   Vercel will auto-deploy with env vars

## Summary

✓ Migrations applied (schema, RLS, seed)
✓ Dev server running with real Supabase
✓ Users can sign up → create profiles → submit specs → vote
✓ Admins can approve specs → visible in search
✓ RLS policies enforce security at database level
✓ Voice search works (Chrome only)
✓ PWA ready (installable)

Enjoy building! 🚀
