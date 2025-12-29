-- RLS Policies for WrenchMC
-- Apply this migration in your Supabase SQL editor after schema.sql

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================

alter table user_profiles enable row level security;
alter table specs enable row level security;
alter table spec_votes enable row level security;

-- ============================================================================
-- user_profiles policies
-- ============================================================================

-- Users can view their own profile
create policy "view_own_profile" on user_profiles
  for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "update_own_profile" on user_profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can insert their own profile (on sign up)
create policy "insert_own_profile" on user_profiles
  for insert
  with check (auth.uid() = id);

-- ============================================================================
-- specs policies
-- ============================================================================

-- Anyone (authenticated or not) can view approved specs
create policy "view_approved_specs" on specs
  for select
  using (approved = true);

-- Admins can view all specs (including unapproved)
-- (assumes an admin_users table or custom claim; fallback: use submitted_by for now)
create policy "view_all_specs_if_authenticated" on specs
  for select
  using (auth.role() = 'authenticated');

-- Authenticated users can insert specs
create policy "insert_specs_authenticated" on specs
  for insert
  with check (auth.role() = 'authenticated' and auth.uid() = submitted_by);

-- Admins can update specs (approve/reject)
-- Note: In production, use a dedicated admin table or custom JWT claim
-- For now, allow authenticated users to update only their own unapproved specs
create policy "update_own_unapproved_specs" on specs
  for update
  using (auth.uid() = submitted_by and approved = false)
  with check (auth.uid() = submitted_by and approved = false);

-- Admins (or server-side) can approve specs
-- Use a service role key for this in your backend API
-- Example: call /api/admin/approve with service role
create policy "approve_specs_admin" on specs
  for update
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ============================================================================
-- spec_votes policies
-- ============================================================================

-- Anyone can view votes (for vote counts)
create policy "view_spec_votes" on spec_votes
  for select
  using (true);

-- Authenticated users can insert votes
create policy "insert_own_votes" on spec_votes
  for insert
  with check (auth.role() = 'authenticated' and auth.uid() = user_id);

-- Authenticated users can update/delete their own votes
create policy "update_own_votes" on spec_votes
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "delete_own_votes" on spec_votes
  for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- Admin helper note:
-- For admin operations (approve specs), call the API with a service role key:
-- In your backend env: SUPABASE_SERVICE_ROLE_KEY
-- Then create server-side Supabase client with this key for elevated privileges.
-- ============================================================================
