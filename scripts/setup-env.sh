#!/bin/bash
# Helper script to set up .env.local file

ENV_FILE=".env.local"
TEMPLATE_FILE=".env.local.template"

echo "🔧 WrenchMC Goliath - Environment Setup"
echo "========================================"
echo ""

# Check if .env.local exists
if [ ! -f "$ENV_FILE" ]; then
  echo "📝 Creating .env.local from template..."
  if [ -f "$TEMPLATE_FILE" ]; then
    cp "$TEMPLATE_FILE" "$ENV_FILE"
    echo "✅ Created .env.local from template"
  else
    echo "❌ Template file not found. Creating basic .env.local..."
    touch "$ENV_FILE"
  fi
else
  echo "✅ .env.local already exists"
fi

echo ""
echo "📋 Current .env.local contents:"
echo "--------------------------------"
if [ -f "$ENV_FILE" ]; then
  # Show non-empty lines (excluding comments and empty lines)
  grep -v "^#" "$ENV_FILE" | grep -v "^$" | grep "=" || echo "  (file appears to be empty or only has comments)"
else
  echo "  (file not found)"
fi

echo ""
echo "🔍 Checking for required variables..."
echo "-------------------------------------"

# Check for required variables
MISSING_VARS=()

if ! grep -q "^PRISMA_DATABASE_URL=" "$ENV_FILE" 2>/dev/null; then
  MISSING_VARS+=("PRISMA_DATABASE_URL")
fi

if ! grep -q "^POSTGRES_URL=" "$ENV_FILE" 2>/dev/null; then
  MISSING_VARS+=("POSTGRES_URL")
fi

if ! grep -q "^NEXTAUTH_SECRET=" "$ENV_FILE" 2>/dev/null; then
  MISSING_VARS+=("NEXTAUTH_SECRET")
fi

if [ ${#MISSING_VARS[@]} -eq 0 ]; then
  echo "✅ All required variables are present!"
else
  echo "❌ Missing required variables:"
  for var in "${MISSING_VARS[@]}"; do
    echo "   - $var"
  done
  echo ""
  echo "📝 Next steps:"
  echo "   1. Open .env.local in your editor"
  echo "   2. Add the missing variables with your actual values"
  echo "   3. Get connection strings from: Vercel Dashboard → Storage → Your Database"
  echo ""
  echo "💡 Quick copy template:"
  echo "   cp .env.local.template .env.local"
fi

echo ""
echo "🔑 Generate NextAuth secret:"
echo "   openssl rand -base64 32"
echo ""

