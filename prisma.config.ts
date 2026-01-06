// Prisma 7 Configuration
// Connection URLs must be here, not in schema.prisma
import "dotenv/config";
import { defineConfig } from "prisma/config";

// Load environment variables from .env.local
// dotenv/config automatically loads .env.local if it exists
const prismaUrl = process.env["PRISMA_DATABASE_URL"];
const postgresUrl = process.env["POSTGRES_URL"];

if (!prismaUrl) {
  console.error("\n❌ ERROR: PRISMA_DATABASE_URL is required in .env.local");
  console.error("\n📝 Please add the following to your .env.local file:");
  console.error("\nPRISMA_DATABASE_URL=\"prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY\"");
  console.error("POSTGRES_URL=\"postgres://user:pass@db.prisma.io:5432/postgres?sslmode=require\"");
  console.error("\n💡 Get these connection strings from your Vercel database dashboard\n");
  throw new Error("PRISMA_DATABASE_URL is required in .env.local");
}

if (!postgresUrl) {
  console.error("\n❌ ERROR: POSTGRES_URL is required in .env.local");
  console.error("\n📝 Please add POSTGRES_URL to your .env.local file");
  console.error("\n💡 Get this connection string from your Vercel database dashboard\n");
  throw new Error("POSTGRES_URL is required in .env.local");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: prismaUrl,      // Prisma Accelerate (pooled) for Prisma Client
    directUrl: postgresUrl, // Direct connection for migrations
  },
});
