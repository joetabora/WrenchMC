# Setting Up .env.local

## Quick Setup

1. **Create or edit `.env.local` file** in the project root

2. **Add your Prisma Postgres connection strings** (from Vercel dashboard):

```env
PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_ACTUAL_API_KEY"
POSTGRES_URL="postgres://user:password@db.prisma.io:5432/postgres?sslmode=require"
POSTGRES_URL_NON_POOLING="postgres://user:password@db.prisma.io:5432/postgres?sslmode=require"
```

3. **Generate NextAuth secret**:
```bash
openssl rand -base64 32
```

4. **Add NextAuth config**:
```env
NEXTAUTH_SECRET="paste-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Where to Get Connection Strings

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Storage** tab
4. Click on your Prisma Postgres database
5. Copy the connection strings from the **".env.local"** tab

## Template File

A template file `.env.local.template` is available in the project root.
You can copy it:
```bash
cp .env.local.template .env.local
```
Then edit `.env.local` with your actual values.
