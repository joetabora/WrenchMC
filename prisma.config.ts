// Prisma 7 Configuration
// Connection URLs must be here, not in schema.prisma
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["PRISMA_DATABASE_URL"], // Prisma Accelerate (pooled) for Prisma Client
    directUrl: process.env["POSTGRES_URL"],   // Direct connection for migrations
  },
});
