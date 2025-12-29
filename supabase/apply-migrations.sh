#!/bin/bash
# apply-migrations.sh
# Applies schema, RLS policies, and seed data to Supabase

set -e

echo "WrenchMC Supabase Migration Script"
echo "===================================="
echo ""
echo "This script applies the following in order:"
echo "  1. schema.sql (tables)"
echo "  2. rls_policies.sql (row-level security)"
echo "  3. seed.sql (sample data)"
echo ""
echo "You will need to paste the SQL into your Supabase SQL editor manually."
echo ""
echo "1. Go to: https://app.supabase.com"
echo "2. Select your project"
echo "3. Open SQL Editor"
echo ""

echo "=== Step 1: Apply schema.sql ==="
echo "Copy and paste this into the SQL editor:"
echo ""
cat supabase/schema.sql
echo ""
echo "Click Run. Wait for success."
echo ""
read -p "Press Enter once schema.sql is applied..."

echo ""
echo "=== Step 2: Apply rls_policies.sql ==="
echo "Copy and paste this into a NEW SQL query:"
echo ""
cat supabase/rls_policies.sql
echo ""
echo "Click Run. Wait for success."
echo ""
read -p "Press Enter once rls_policies.sql is applied..."

echo ""
echo "=== Step 3: Apply seed.sql ==="
echo "Copy and paste this into a NEW SQL query:"
echo ""
cat supabase/seed.sql
echo ""
echo "Click Run. Wait for success."
echo ""
read -p "Press Enter once seed.sql is applied..."

echo ""
echo "✓ All migrations applied!"
echo ""
echo "Next: Start the dev server and test"
echo "  npm run dev"
echo ""
