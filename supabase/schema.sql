-- Supabase schema for WrenchMC

-- user_profiles linked to auth.users
create table if not exists user_profiles (
  id uuid references auth.users(id) on delete cascade,
  bike_year text,
  bike_model text,
  bike_variant text,
  primary key (id)
);

-- specs table
create table if not exists specs (
  id uuid default gen_random_uuid() primary key,
  component_name text not null,
  bolt_size text,
  torque_spec_low numeric,
  torque_spec_high numeric,
  sequence_notes text,
  applicable_years text[],
  applicable_models text[],
  submitted_by uuid references auth.users(id),
  approved boolean default false,
  source_notes text,
  created_at timestamptz default now()
);

-- simple votes table
create table if not exists spec_votes (
  id uuid default gen_random_uuid() primary key,
  spec_id uuid references specs(id) on delete cascade,
  user_id uuid references auth.users(id),
  up boolean,
  created_at timestamptz default now()
);

-- RLS policies examples (apply in Supabase SQL editor):
-- Enable row level security for specs
-- alter table specs enable row level security;

-- Allow authenticated users to insert their own specs
-- create policy "insert specs for authenticated" on specs
--   for insert
--   with check (auth.role() = 'authenticated');

-- Allow everyone to select approved specs
-- create policy "select approved" on specs
--   for select
--   using (approved = true);

