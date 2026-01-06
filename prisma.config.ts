// Prisma 7 Configuration
// Connection URLs must be here, not in schema.prisma
import "dotenv/config";
import { defineConfig } from "prisma/config";

// Ensure environment variables are loaded
const prismaUrl = process.env["PRISMA_DATABASE_URL"];
const postgresUrl = process.env["POSTGRES_URL"];

if (!prismaUrl) {
  throw new Error("PRISMA_DATABASE_URL is required in .env.local");
}

if (!postgresUrl) {
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
