#!/bin/bash
# test-end-to-end.sh
# End-to-end testing for WrenchMC with real Supabase

set -e

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [[ -z "$SUPABASE_URL" ]] || [[ -z "$ANON_KEY" ]]; then
  echo "Error: Missing Supabase env vars. Check .env.local"
  exit 1
fi

echo "WrenchMC End-to-End Tests"
echo "=========================="
echo ""
echo "Testing with:"
echo "  Supabase URL: $SUPABASE_URL"
echo ""

BASE_URL="http://localhost:3000"
SUPABASE_API="${SUPABASE_URL}/rest/v1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_route() {
  local route=$1
  local expected_status=$2
  local description=$3
  
  echo -n "Testing $route ... "
  status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")
  
  if [[ "$status" == "$expected_status" ]]; then
    echo -e "${GREEN}✓ $status${NC} ($description)"
  else
    echo -e "${RED}✗ $status (expected $expected_status)${NC} - $description"
  fi
}

echo "=== Frontend Routes ==="
test_route "/" "200" "Home page"
test_route "/search" "200" "Search page"
test_route "/voice" "200" "Voice page"
test_route "/profile" "200" "Profile page"
test_route "/specs/new" "200" "Spec submission"
test_route "/admin/moderation" "200" "Admin moderation"
test_route "/auth/login" "200" "Login page"

echo ""
echo "=== API Routes ==="
echo ""

# Test search API
echo "Testing GET /api/search (approved specs only):"
curl -s -X GET "$BASE_URL/api/search?q=transmission" \
  -H "Authorization: Bearer $ANON_KEY" | jq '.' 2>/dev/null || echo "(Response body shown above)"

echo ""
echo "Testing POST /api/specs (requires auth - will fail without valid session):"
echo "  Note: This requires an authenticated user session."
echo "  Sign up at /auth/login first, then try submitting a spec at /specs/new"

echo ""
echo "=== Database Health Check ==="
echo ""

# Check if specs table is accessible and has data
echo "Checking specs table:"
curl -s -X GET "$SUPABASE_API/specs?approved=eq.true&select=id,component_name" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY" | jq 'length' 2>/dev/null && echo "✓ Specs table is accessible"

echo ""
echo "=== Manual Testing Workflow ==="
echo ""
echo "1. Open http://localhost:3000 in your browser"
echo ""
echo "2. Test Authentication:"
echo "   - Click 'Login' or visit /auth/login"
echo "   - Sign up with a test email"
echo "   - Check localStorage for 'sb-' keys"
echo ""
echo "3. Test User Profile:"
echo "   - Visit /profile"
echo "   - Select a bike year/model"
echo "   - Submit"
echo ""
echo "4. Test Search:"
echo "   - Visit /search"
echo "   - Search for 'transmission' or 'bolt'"
echo "   - Should see approved specs from seed data"
echo ""
echo "5. Test Voice (Chrome/Edge only):"
echo "   - Visit /voice"
echo "   - Click 'Start listening'"
echo "   - Say 'transmission' or 'chain'"
echo "   - Should hear TTS response"
echo ""
echo "6. Test Spec Submission:"
echo "   - Visit /specs/new"
echo "   - Fill form and submit"
echo "   - Spec goes to moderation queue (approved=false)"
echo ""
echo "7. Test Admin Moderation:"
echo "   - Visit /admin/moderation"
echo "   - See unapproved specs"
echo "   - Click 'Approve' (uses service role)"
echo "   - Spec now visible in search"
echo ""
echo "✓ End-to-end tests complete"
